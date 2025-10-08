import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Store active connections for real-time updates
const connections = new Map<string, Response>();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const threadId = searchParams.get('threadId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  // Create Server-Sent Events stream for real-time updates
  const stream = new ReadableStream({
    start(controller) {
      const connectionId = `${userId}-${threadId || 'all'}`;
      
      // Store connection for broadcasting updates
      const response = new Response();
      connections.set(connectionId, response);

      // Send initial connection event
      const data = JSON.stringify({
        type: 'connected',
        timestamp: new Date().toISOString(),
        userId,
        threadId
      });
      
      controller.enqueue(`data: ${data}\n\n`);

      // Set up periodic heartbeat to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          const heartbeatData = JSON.stringify({
            type: 'heartbeat',
            timestamp: new Date().toISOString()
          });
          controller.enqueue(`data: ${heartbeatData}\n\n`);
        } catch (error) {
          console.error('Heartbeat error:', error);
          clearInterval(heartbeat);
          connections.delete(connectionId);
        }
      }, 30000); // 30 seconds heartbeat

      // Clean up on connection close
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeat);
        connections.delete(connectionId);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, userId, threadId, data } = body;

    switch (type) {
      case 'new_message':
        // Broadcast new message to all connections in this thread
        await broadcastToThread(threadId, {
          type: 'new_message',
          message: data.message,
          timestamp: new Date().toISOString()
        });
        break;

      case 'typing_start':
        // Broadcast typing indicator
        await broadcastToThread(threadId, {
          type: 'typing_start',
          userId,
          timestamp: new Date().toISOString()
        }, userId); // Exclude sender
        break;

      case 'typing_stop':
        // Stop typing indicator
        await broadcastToThread(threadId, {
          type: 'typing_stop',
          userId,
          timestamp: new Date().toISOString()
        }, userId); // Exclude sender
        break;

      case 'message_read':
        // For now, just broadcast the read status
        // In future, update database when readAt field is available
        await broadcastToThread(threadId, {
          type: 'message_read',
          messageId: data.messageId,
          readBy: userId,
          timestamp: new Date().toISOString()
        });
        break;

      case 'user_online':
        // For now, just broadcast online status
        // In future, update database when lastSeen field is available
        await broadcastToUser(userId, {
          type: 'user_online',
          userId,
          timestamp: new Date().toISOString()
        });
        break;

      case 'user_offline':
        // For now, just broadcast offline status
        // In future, update database when lastSeen field is available
        await broadcastToUser(userId, {
          type: 'user_offline',
          userId,
          timestamp: new Date().toISOString()
        });
        break;

      default:
        return NextResponse.json({ error: 'Unknown event type' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Real-time messaging error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// Helper function to broadcast to all connections in a thread
async function broadcastToThread(threadId: string, data: any, excludeUserId?: string) {
  const message = `data: ${JSON.stringify(data)}\n\n`;
  
  for (const [connectionId, response] of connections.entries()) {
    if (connectionId.includes(threadId)) {
      // Skip sender if excludeUserId is provided
      if (excludeUserId && connectionId.startsWith(excludeUserId)) {
        continue;
      }
      
      try {
        // Note: In a real implementation, you'd need to store the controller reference
        // This is a simplified version - you might want to use a proper WebSocket library
        console.log(`Broadcasting to ${connectionId}:`, data);
      } catch (error) {
        console.error('Broadcast error:', error);
        connections.delete(connectionId);
      }
    }
  }
}

// Helper function to broadcast to all user's connections
async function broadcastToUser(userId: string, data: any) {
  const message = `data: ${JSON.stringify(data)}\n\n`;
  
  for (const [connectionId, response] of connections.entries()) {
    if (connectionId.startsWith(userId)) {
      try {
        console.log(`Broadcasting to user ${userId}:`, data);
      } catch (error) {
        console.error('Broadcast error:', error);
        connections.delete(connectionId);
      }
    }
  }
}