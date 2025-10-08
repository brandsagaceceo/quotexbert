import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const contractorId = searchParams.get("contractorId");
  const homeownerId = searchParams.get("homeownerId");

  if (!contractorId && !homeownerId) {
    return NextResponse.json({ error: "Contractor ID or Homeowner ID required" }, { status: 400 });
  }

  // Mock quotes data for demo
  const mockQuotes = [
    {
      id: "quote1",
      jobId: "job1",
      contractorId: "demo-contractor-123",
      homeownerId: "demo-homeowner-123",
      amount: 12500,
      description: "Complete kitchen renovation including cabinets, countertops, and appliances. Timeline: 3-4 weeks.",
      status: "pending",
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      job: {
        title: "Kitchen Renovation"
      }
    },
    {
      id: "quote2",
      jobId: "job2",
      contractorId: "demo-contractor-123",
      homeownerId: "demo-homeowner-123",
      amount: 850,
      description: "Bathroom tile installation with premium materials. Timeline: 1-2 days.",
      status: "accepted",
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      job: {
        title: "Bathroom Tile Installation"
      }
    },
    {
      id: "quote3",
      jobId: "job3",
      contractorId: "demo-contractor-123",
      homeownerId: "demo-homeowner-123",
      amount: 450,
      description: "Electrical outlet installation in basement. All materials included.",
      status: "rejected",
      createdAt: new Date(Date.now() - 345600000).toISOString(),
      job: {
        title: "Electrical Outlet Installation"
      }
    }
  ];

  // Filter quotes based on the requesting user
  let filteredQuotes = mockQuotes;
  if (contractorId) {
    filteredQuotes = mockQuotes.filter(quote => quote.contractorId === contractorId);
  } else if (homeownerId) {
    filteredQuotes = mockQuotes.filter(quote => quote.homeownerId === homeownerId);
  }

  return NextResponse.json(filteredQuotes);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobId, contractorId, homeownerId, amount, description } = body;

    if (!jobId || !contractorId || !homeownerId || !amount || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Mock creating a new quote
    const newQuote = {
      id: `quote_${Date.now()}`,
      jobId,
      contractorId,
      homeownerId,
      amount,
      description,
      status: "pending",
      createdAt: new Date().toISOString(),
      job: {
        title: "New Job" // In real app, fetch from jobs table
      }
    };

    return NextResponse.json(newQuote, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create quote" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { quoteId, status } = body;

    if (!quoteId || !status) {
      return NextResponse.json({ error: "Quote ID and status required" }, { status: 400 });
    }

    // Mock updating quote status
    const updatedQuote = {
      id: quoteId,
      status,
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(updatedQuote);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update quote" }, { status: 500 });
  }
}