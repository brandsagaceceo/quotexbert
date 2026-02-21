import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      projectType, 
      description, 
      location, 
      timeline, 
      budget, 
      companyName, 
      clientName,
      clientEmail,
      clientPhone 
    } = body;

    if (!projectType || !description || !companyName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create a detailed prompt for the AI
    const prompt = `Generate a comprehensive, professional contract and quote for the following project:

PROJECT DETAILS:
- Type: ${projectType}
- Description: ${description}
${location ? `- Location: ${location}` : ''}
${timeline ? `- Timeline: ${timeline}` : ''}
${budget ? `- Budget: ${budget}` : ''}

COMPANY & CLIENT:
- Contractor/Company: ${companyName}
${clientName ? `- Client Name: ${clientName}` : ''}
${clientEmail ? `- Client Email: ${clientEmail}` : ''}
${clientPhone ? `- Client Phone: ${clientPhone}` : ''}

Generate a COMPREHENSIVE, DETAILED professional contract with excellent formatting that includes ALL of these sections:

1. CONTRACT HEADER & TITLE
   - Professional title with contract number
   - Date of contract creation
   - Company and client information in a clean format

2. EXECUTIVE SUMMARY
   - Brief overview of the entire project
   - Key highlights and deliverables

3. PROJECT SCOPE AND DESCRIPTION
   - Detailed description of ALL work to be performed
   - Specific materials and methods
   - What IS and IS NOT included in the scope
   - Site preparation requirements
   - Clean-up and disposal responsibilities

4. DETAILED ITEMIZED COST BREAKDOWN
   - Create a professional HTML table with proper borders and padding
   - Include categories: Labor, Materials, Equipment, Permits, Disposal, Contingency
   - List specific line items with quantities, unit prices, and totals
   - Add subtotals for each category
   - Show any applicable taxes
   - Display TOTAL COST with emphasis
   - If budget is provided, ensure total aligns reasonably with it

5. PAYMENT TERMS AND SCHEDULE
   - Deposit amount and due date
   - Progress payment milestones (e.g., 30% at start, 40% at midpoint, 30% on completion)
   - Accepted payment methods
   - Late payment terms and consequences
   - Final payment conditions

6. PROJECT TIMELINE AND MILESTONES
   - Estimated start date
   - Key milestone dates with specific deliverables
   - Estimated completion date
   - Weather and delay provisions
   - Communication protocols for schedule changes

7. MATERIALS AND SPECIFICATIONS
   - Grade and type of materials to be used
   - Brand names where applicable
   - Client approval requirements for material selections
   - Storage and protection of materials

8. PERMITS AND INSPECTIONS
   - Who is responsible for obtaining permits
   - Inspection requirements
   - Compliance with local building codes
   - Fees and costs associated with permits

9. INSURANCE AND LIABILITY
   - Contractor's insurance coverage
   - Worker's compensation
   - Liability for damages
   - Property protection measures

10. CHANGE ORDERS AND ADDITIONAL WORK
    - Process for requesting changes
    - How additional costs are calculated
    - Written approval requirements
    - Time extensions for change orders

11. WARRANTY AND GUARANTEES
    - Detailed warranty period (typically 1-2 years)
    - What is covered and what is not covered
    - Maintenance requirements to maintain warranty
    - Process for warranty claims

12. TERMS AND CONDITIONS
    - Work hours and site access
    - Client responsibilities
    - Contractor responsibilities
    - Dispute resolution procedures
    - Governing law and jurisdiction

13. CANCELLATION AND TERMINATION POLICY
    - Cancellation periods and penalties
    - Process for termination by either party
    - Handling of deposits and partial work
    - Final cleanup obligations

14. SAFETY AND SITE PROTOCOLS
    - Safety measures and equipment
    - Site security
    - Protection of existing structures
    - Waste disposal and environmental compliance

15. SIGNATURES AND ACCEPTANCE
    - Signature lines for contractor with date
    - Signature lines for client with date
    - Witness signature line if applicable

FORMAT REQUIREMENTS:
- Use clean, professional HTML with proper spacing (margins and padding)
- Use <h1> for main title, <h2> for major sections, <h3> for subsections
- Add margin-bottom: 20px after each section for spacing
- Use <p> tags with line-height: 1.6 for readability
- Create professional tables with borders, padding, and alternating row colors
- Use <strong> or <b> for emphasis on important terms
- Add subtle background colors to section headers (#f8f9fa)
- Use a professional color scheme (dark blues/grays for text)
- Ensure there's adequate white space between all sections
- Make the cost breakdown table well-formatted with proper alignment

IMPORTANT: 
- Be specific and detailed in every section
- Use professional legal language but keep it understandable
- Ensure all sections flow logically
- Make it print-ready with proper formatting
- Include realistic cost estimates based on the project description and budget
- Add specific details rather than generic placeholder text wherever possible`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are an expert contract and quote generator for construction, renovation, and home improvement projects. You create comprehensive, legally-sound contracts with exceptional formatting, detailed cost breakdowns, and professional presentation. Your contracts are thorough, specific, and formatted in clean HTML with proper spacing, tables, and styling. You include all necessary legal protections while remaining clear and understandable. You provide realistic cost estimates and detailed project specifications."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000
    });

    const generatedQuote = completion.choices[0]?.message?.content;

    if (!generatedQuote) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate quote' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      quote: generatedQuote
    });

  } catch (error) {
    console.error('Error generating quote:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate quote'
      },
      { status: 500 }
    );
  }
}
