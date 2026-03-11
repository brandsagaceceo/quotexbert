# Unified Contractor Response Time Tracking

## Overview

The unified response time tracking system measures contractor responsiveness by combining TWO data sources:

1. **Job Acceptance Time**: How quickly contractors accept job leads  
2. **Message Reply Time**: How quickly contractors respond to homeowner messages

This gives homeowners a complete picture of how responsive each contractor is.

## Features

✅ **Automatic Calculation**: Response times are automatically recalculated when contractors send messages  
✅ **Smart Averaging**: Calculates average response time from all contractor-homeowner conversations  
✅ **Human-Readable Labels**: Displays friendly time ranges like "~2 hours" or "~30 minutes"  
✅ **Profile Badge**: Shows response time prominently on contractor profiles with ⚡ icon  
✅ **Listing Display**: Response time badges appear in contractor search results  
✅ **Outlier Filtering**: Ignores extremely long delays (>7 days) for accurate averages  

## How It Works

### 1. Message Tracking

When a homeowner sends a message and a contractor replies, the system:
- Records the timestamp of the homeowner's message
- Records the timestamp of the contractor's reply
- Calculates the time difference in minutes
- Stores this as a data point for response time calculation

### 2. Automatic Updates

Response times are automatically recalculated whenever:
- A contractor sends a message in a conversation
- The system calculates the average across all responses
- Updates the contractor's profile with the new metrics

### 3. Display Logic

Response times are formatted into human-readable labels:

| Average Time | Display Label |
|--------------|---------------|
| < 5 minutes | ~5 minutes |
| 5-15 minutes | ~10 minutes |
| 15-30 minutes | ~15 minutes |
| 30-60 minutes | ~30 minutes |
| 1-2 hours | ~1 hour |
| 2-3 hours | ~2 hours |
| 3-4 hours | ~3 hours |
| 4-6 hours | ~4 hours |
| 6-8 hours | ~6 hours |
| 8-12 hours | ~8 hours |
| 12-24 hours | ~12 hours |
| 1-2 days | ~1 day |
| 2-3 days | ~2 days |
| 3+ days | ~3+ days |

## Database Schema

### ContractorProfile Fields

```prisma
model ContractorProfile {
  // ... existing fields ...
  
  // Response time tracking
  avgResponseTimeMinutes Int?      // Average response time in minutes
  responseTimeLabel      String?   // Human-readable label (e.g., "~2 hours")
  totalResponses         Int       @default(0) // Total responses tracked
  lastResponseCalculated DateTime? // Last calculation timestamp
}
```

## API Endpoints

### Automatic Updates

Response times are automatically updated via the messaging system:

**POST `/api/conversations/[id]/messages`**
- When a contractor sends a message, triggers automatic response time recalculation
- Updates happen asynchronously without blocking the message sending

### Manual Calculation

You can manually trigger response time calculations:

**GET `/api/contractors/response-time?userId=CONTRACTOR_USER_ID`**
- Calculates response time for a specific contractor
- Returns success message

**POST `/api/contractors/response-time`**
- Body: `{ "all": true }` - Calculate for all contractors
- Body: `{ "userId": "XXX" }` - Calculate for specific contractor
- Useful for initial setup or bulk recalculation

## Setup Instructions

### 1. Run Database Migration

```bash
npx prisma migrate dev --name add_contractor_response_time
```

This adds the response time fields to the `ContractorProfile` model.

### 2. Generate Prisma Client

```bash
npx prisma generate
```

### 3. Initial Calculation (Optional)

Calculate response times for all existing contractors:

**Option A: Using the script**
```bash
node calculate-response-times.js
```

**Option B: Using the API**
```bash
curl -X POST http://localhost:3000/api/contractors/response-time \
  -H "Content-Type: application/json" \
  -d '{"all": true}'
```

## Display Locations

### 1. Contractor Profile Page

`/contractors/[id]`

The response time badge appears in the "Trust Signals" section:

```tsx
{contractor.responseTimeLabel && (
  <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
    <span>⚡</span>
    <span className="font-medium">
      Responds in {contractor.responseTimeLabel}
    </span>
  </div>
)}
```

### 2. Contractor Listing Page

`/contractors`

Each contractor card shows the response time badge below the location:

```tsx
{contractor.responseTimeLabel && (
  <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">
    <span>⚡</span>
    <span>Responds in {contractor.responseTimeLabel}</span>
  </div>
)}
```

## Usage Examples

### View Response Time in Code

```typescript
import { calculateContractorResponseTime } from '@/lib/responseTime';

// Get response time metrics
const { avgResponseTimeMinutes, responseTimeLabel, totalResponses } = 
  await calculateContractorResponseTime(contractorUserId);

console.log(`Average: ${avgResponseTimeMinutes} minutes`);
console.log(`Label: ${responseTimeLabel}`);
console.log(`Based on ${totalResponses} responses`);
```

### Update Response Time

```typescript
import { updateContractorResponseTime } from '@/lib/responseTime';

// Update contractor profile with latest response time
await updateContractorResponseTime(contractorUserId);
```

### Batch Update All Contractors

```typescript
import { updateAllContractorResponseTimes } from '@/lib/responseTime';

// Calculate for all contractors (useful for cron jobs)
await updateAllContractorResponseTimes();
```

## Testing

### 1. Create Test Conversations

```javascript
// Create a conversation with messages
const conversation = await prisma.conversation.create({
  data: {
    jobId: 'test-job-id',
    homeownerId: 'homeowner-id',
    contractorId: 'contractor-id',
    status: 'active'
  }
});

// Homeowner sends message
const homeownerMessage = await prisma.conversationMessage.create({
  data: {
    conversationId: conversation.id,
    senderId: 'homeowner-id',
    senderRole: 'homeowner',
    receiverId: 'contractor-id',
    receiverRole: 'contractor',
    content: 'Can you help with my kitchen renovation?',
    createdAt: new Date('2026-03-10T10:00:00Z')
  }
});

// Contractor responds 30 minutes later
const contractorMessage = await prisma.conversationMessage.create({
  data: {
    conversationId: conversation.id,
    senderId: 'contractor-id',
    senderRole: 'contractor',
    receiverId: 'homeowner-id',
    receiverRole: 'homeowner',
    content: 'Yes, I can help! Let me know your requirements.',
    createdAt: new Date('2026-03-10T10:30:00Z')
  }
});
```

### 2. Calculate Response Time

```bash
# Using the API
curl http://localhost:3000/api/contractors/response-time?userId=contractor-id

# Using the script
node calculate-response-times.js
```

### 3. Verify Display

Visit contractor profile:
```
http://localhost:3000/contractors/contractor-id
```

Expected: You should see "⚡ Responds in ~30 minutes" badge

## Performance Considerations

- Response time calculations run asynchronously to avoid blocking message sending
- Only tracks responses from the last 7 days to focus on recent behavior
- Batching calculations for all contractors should be done during off-peak hours
- Consider adding a cron job to recalculate weekly for accuracy

## Cron Job Setup (Optional)

Add to your task scheduler to recalculate response times weekly:

```bash
# Crontab entry (runs every Sunday at 2 AM)
0 2 * * 0 cd /path/to/quotexbert && node calculate-response-times.js
```

Or use Vercel Cron Jobs:

```typescript
// app/api/cron/update-response-times/route.ts
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  await updateAllContractorResponseTimes();
  
  return Response.json({ success: true });
}
```

```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/update-response-times",
    "schedule": "0 2 * * 0"
  }]
}
```

## Troubleshooting

### Response time not showing

1. **Check if contractor has sent any messages**
   ```sql
   SELECT COUNT(*) FROM conversation_messages 
   WHERE senderRole = 'contractor' AND senderId = 'contractor-id';
   ```

2. **Verify calculations ran**
   ```sql
   SELECT avgResponseTimeMinutes, responseTimeLabel, lastResponseCalculated 
   FROM contractor_profiles 
   WHERE userId = 'contractor-id';
   ```

3. **Manually trigger calculation**
   ```bash
   curl http://localhost:3000/api/contractors/response-time?userId=contractor-id
   ```

### Response time seems incorrect

- Check for outlier messages (very long delays)
- Verify message timestamps are correct
- Ensure senderRole is properly set in messages
- Run calculation again to refresh metrics

## Future Enhancements

Potential improvements for the response time system:

- [ ] Add response time trend tracking (improving/declining)
- [ ] Show response time by day of week or time of day
- [ ] Add "typical response time" vs "fastest response time"
- [ ] Filter by response times in contractor search
- [ ] Send notifications to contractors about their response time metrics
- [ ] Add response time goals and achievements
- [ ] Track first response time vs average response time

## Support

For issues or questions about response time tracking:
1. Check the logs: `console.log` statements show calculation progress
2. Review the database: Check `contractor_profiles` table
3. Test the API endpoints manually
4. Review message timestamps in `conversation_messages` table
