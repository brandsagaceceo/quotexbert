import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const resolvedParams = await params;
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Simple mock messages for now - in a real app, you'd store these in the database
    const messages = [
      {
        id: '1',
        content: 'Hi! I\'m excited to work on your project. When would be a good time to start?',
        senderId: 'contractor-123',
        senderName: 'John\'s Plumbing',
        timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        isHomeowner: false
      },
      {
        id: '2',
        content: 'Hello! Thanks for accepting the job. I\'m available starting next Monday. Does that work for you?',
        senderId: userId,
        senderName: 'Sarah Johnson',
        timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
        isHomeowner: true
      },
      {
        id: '3',
        content: 'Perfect! Monday works great. I\'ll be there around 9 AM. I\'ll bring all the necessary tools and materials.',
        senderId: 'contractor-123',
        senderName: 'John\'s Plumbing',
        timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
        isHomeowner: false
      }
    ];

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { content, senderId, senderName, jobId } = await request.json();
    const resolvedParams = await params;
    
    if (!content || !senderId || !senderName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // In a real app, you'd save the message to the database
    // For now, we'll just return a success response
    const newMessage = {
      id: Date.now().toString(),
      content,
      senderId,
      senderName,
      timestamp: new Date().toISOString(),
      isHomeowner: true // This would be determined based on user role
    };

    return NextResponse.json(newMessage);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}