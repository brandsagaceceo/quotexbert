import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
}) : null;

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

    // If OpenAI is not configured, use template-based fallback
    if (!openai) {
      console.warn('OpenAI not configured, using template-based quote');
      const fallbackQuote = generateFallbackQuote({
        projectType,
        description,
        location,
        timeline,
        budget,
        companyName,
        clientName,
        clientEmail,
        clientPhone
      });
      
      return NextResponse.json({
        success: true,
        quote: fallbackQuote
      });
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
    
    // Try fallback template if OpenAI fails
    try {
      const body = await request.json();
      const fallbackQuote = generateFallbackQuote(body);
      return NextResponse.json({
        success: true,
        quote: fallbackQuote,
        warning: 'AI service temporarily unavailable. Using template-based quote.'
      });
    } catch {
      return NextResponse.json(
        { 
          success: false, 
          error: error instanceof Error ? error.message : 'Failed to generate quote'
        },
        { status: 500 }
      );
    }
  }
}

// Fallback template-based quote generator
function generateFallbackQuote(params: {
  projectType: string;
  description: string;
  location?: string;
  timeline?: string;
  budget?: string;
  companyName: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
}): string {
  const {
    projectType,
    description,
    location = 'Toronto, ON',
    timeline = '2-4 weeks',
    budget = '$5,000 - $15,000',
    companyName,
    clientName = '[Client Name]',
    clientEmail = '[Client Email]',
    clientPhone = '[Client Phone]'
  } = params;

  const contractNumber = `QX-${Date.now().toString().slice(-6)}`;
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  
  // Parse budget to calculate breakdown
  const budgetMatch = budget.match(/\$?([\d,]+)/g);
  let estimateHigh = 15000;
  if (budgetMatch && budgetMatch.length > 0) {
    const lastAmount = budgetMatch[budgetMatch.length - 1].replace(/,/g, '');
    estimateHigh = parseInt(lastAmount) || 15000;
  }
  
  const materials = Math.round(estimateHigh * 0.40);
  const labor = Math.round(estimateHigh * 0.45);
  const permits = Math.round(estimateHigh * 0.05);
  const disposal = Math.round(estimateHigh * 0.03);
  const contingency = Math.round(estimateHigh * 0.07);

  return `
<div style="font-family: Arial, sans-serif; max-width: 850px; margin: 0 auto; padding: 40px; line-height: 1.6; color: #1a1a1a;">
  
  <!-- HEADER -->
  <div style="text-align: center; border-bottom: 4px solid #991B1B; padding-bottom: 20px; margin-bottom: 30px;">
    <h1 style="color: #991B1B; margin: 0 0 10px 0; font-size: 36px; font-weight: bold;">
      PROFESSIONAL CONTRACT & QUOTE
    </h1>
    <p style="color: #666; font-size: 14px; margin: 0;">
      Contract #${contractNumber} | Date: ${today}
    </p>
  </div>

  <!-- PARTIES -->
  <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
    <h2 style="color: #991B1B; margin: 0 0 15px 0; font-size: 20px;">Contract Parties</h2>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <div>
        <p style="margin: 0 0 5px 0;"><strong>CONTRACTOR:</strong></p>
        <p style="margin: 0; color: #333;">${companyName}</p>
        <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">${location}</p>
      </div>
      <div>
        <p style="margin: 0 0 5px 0;"><strong>CLIENT:</strong></p>
        <p style="margin: 0; color: #333;">${clientName}</p>
        ${clientEmail ? `<p style="margin: 3px 0 0 0; color: #666; font-size: 14px;">${clientEmail}</p>` : ''}
        ${clientPhone ? `<p style="margin: 3px 0 0 0; color: #666; font-size: 14px;">${clientPhone}</p>` : ''}
      </div>
    </div>
  </div>

  <!-- PROJECT OVERVIEW -->
  <div style="margin-bottom: 30px;">
    <h2 style="color: #991B1B; font-size: 24px; margin: 0 0 15px 0; border-bottom: 2px solid #F97316; padding-bottom: 10px;">
      1. PROJECT OVERVIEW
    </h2>
    <p style="margin: 0 0 10px 0;"><strong>Project Type:</strong> ${projectType}</p>
    <p style="margin: 0 0 10px 0;"><strong>Location:</strong> ${location}</p>
    <p style="margin: 0 0 10px 0;"><strong>Estimated Timeline:</strong> ${timeline}</p>
    <p style="margin: 15px 0 0 0;"><strong>Project Description:</strong></p>
    <p style="margin: 5px 0 0 0; color: #333; background: #f8f9fa; padding: 15px; border-radius: 6px;">
      ${description}
    </p>
  </div>

  <!-- DETAILED SCOPE -->
  <div style="margin-bottom: 30px;">
    <h2 style="color: #991B1B; font-size: 24px; margin: 0 0 15px 0; border-bottom: 2px solid #F97316; padding-bottom: 10px;">
      2. DETAILED SCOPE OF WORK
    </h2>
    <p style="margin: 0 0 10px 0;">The Contractor agrees to perform the following services:</p>
    <ul style="margin: 0; padding-left: 20px;">
      <li style="margin-bottom: 8px;">Complete ${projectType.toLowerCase()} as described</li>
      <li style="margin-bottom: 8px;">Provide all necessary labor and expertise</li>
      <li style="margin-bottom: 8px;">Supply and install all materials specified in this contract</li>
      <li style="margin-bottom: 8px;">Obtain required permits and pass inspections</li>
      <li style="margin-bottom: 8px;">Daily site cleanup and final cleanup upon completion</li>
      <li style="margin-bottom: 8px;">Protection of existing structures and property</li>
      <li style="margin-bottom: 8px;">Disposal of all construction debris</li>
    </ul>
  </div>

  <!-- COST BREAKDOWN -->
  <div style="margin-bottom: 30px;">
    <h2 style="color: #991B1B; font-size: 24px; margin: 0 0 15px 0; border-bottom: 2px solid #F97316; padding-bottom: 10px;">
      3. ITEMIZED COST BREAKDOWN
    </h2>
    <table style="width: 100%; border-collapse: collapse; margin-top: 15px; border: 2px solid #ddd;">
      <thead>
        <tr style="background: #991B1B; color: white;">
          <th style="padding: 12px; text-align: left; border: 1px solid #991B1B;">Item</th>
          <th style="padding: 12px; text-align: right; border: 1px solid #991B1B;">Cost</th>
        </tr>
      </thead>
      <tbody>
        <tr style="background: #f8f9fa;">
          <td style="padding: 10px; border: 1px solid #ddd;">Materials and Supplies</td>
          <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">$${materials.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">Labor and Installation</td>
          <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">$${labor.toLocaleString()}</td>
        </tr>
        <tr style="background: #f8f9fa;">
          <td style="padding: 10px; border: 1px solid #ddd;">Permits and Inspections</td>
          <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">$${permits.toLocaleString()}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border: 1px solid #ddd;">Disposal and Cleanup</td>
          <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">$${disposal.toLocaleString()}</td>
        </tr>
        <tr style="background: #f8f9fa;">
          <td style="padding: 10px; border: 1px solid #ddd;">Contingency (7%)</td>
          <td style="padding: 10px; text-align: right; border: 1px solid #ddd;">$${contingency.toLocaleString()}</td>
        </tr>
        <tr style="background: #FEE2E2; font-weight: bold; font-size: 18px;">
          <td style="padding: 15px; border: 2px solid #991B1B;">TOTAL ESTIMATED COST</td>
          <td style="padding: 15px; text-align: right; border: 2px solid #991B1B; color: #991B1B;">$${estimateHigh.toLocaleString()}</td>
        </tr>
      </tbody>
    </table>
    <p style="margin: 10px 0 0 0; font-size: 12px; color: #666; font-style: italic;">
      * Final costs may vary based on unforeseen conditions and material price fluctuations
    </p>
  </div>

  <!-- PAYMENT TERMS -->
  <div style="margin-bottom: 30px;">
    <h2 style="color: #991B1B; font-size: 24px; margin: 0 0 15px 0; border-bottom: 2px solid #F97316; padding-bottom: 10px;">
      4. PAYMENT TERMS
    </h2>
    <ul style="margin: 0; padding-left: 20px;">
      <li style="margin-bottom: 8px;"><strong>Deposit:</strong> ${Math.round(estimateHigh * 0.30).toLocaleString()} (30%) due upon contract signing</li>
      <li style="margin-bottom: 8px;"><strong>Milestone Payment:</strong> ${Math.round(estimateHigh * 0.40).toLocaleString()} (40%) due at project midpoint</li>
      <li style="margin-bottom: 8px;"><strong>Final Payment:</strong> ${Math.round(estimateHigh * 0.30).toLocaleString()} (30%) due upon completion</li>
      <li style="margin-bottom: 8px;">All payments due within 5 business days of invoice</li>
      <li style="margin-bottom: 8px;">Accepted payment methods: Check, Bank Transfer, Credit Card</li>
    </ul>
  </div>

  <!-- TIMELINE -->
  <div style="margin-bottom: 30px;">
    <h2 style="color: #991B1B; font-size: 24px; margin: 0 0 15px 0; border-bottom: 2px solid #F97316; padding-bottom: 10px;">
      5. PROJECT TIMELINE
    </h2>
    <p style="margin: 0 0 10px 0;"><strong>Estimated Duration:</strong> ${timeline}</p>
    <p style="margin: 0 0 10px 0;"><strong>Start Date:</strong> To be confirmed upon deposit receipt</p>
    <p style="margin: 0;">Timeline is subject to weather conditions, material availability, and permit approval times.</p>
  </div>

  <!-- WARRANTY -->
  <div style="margin-bottom: 30px;">
    <h2 style="color: #991B1B; font-size: 24px; margin: 0 0 15px 0; border-bottom: 2px solid #F97316; padding-bottom: 10px;">
      6. WARRANTY AND GUARANTEES
    </h2>
    <ul style="margin: 0; padding-left: 20px;">
      <li style="margin-bottom: 8px;">All labor is guaranteed for 1 year from completion date</li>
      <li style="margin-bottom: 8px;">Materials carry manufacturer warranties</li>
      <li style="margin-bottom: 8px;">Warranty does not cover damage from misuse or normal wear and tear</li>
      <li style="margin-bottom: 8px;">Client must notify contractor within 30 days of discovering defects</li>
    </ul>
  </div>

  <!-- TERMS AND CONDITIONS -->
  <div style="margin-bottom: 30px;">
    <h2 style="color: #991B1B; font-size: 24px; margin: 0 0 15px 0; border-bottom: 2px solid #F97316; padding-bottom: 10px;">
      7. TERMS AND CONDITIONS
    </h2>
    <ul style="margin: 0; padding-left: 20px;">
      <li style="margin-bottom: 8px;">Client will provide clear access to work areas and utilities</li>
      <li style="margin-bottom: 8px;">Contractor will maintain clean and safe work environment</li>
      <li style="margin-bottom: 8px;">Changes to scope require written approval and may affect price/timeline</li>
      <li style="margin-bottom: 8px;">Either party may terminate with 7 days written notice</li>
      <li style="margin-bottom: 8px;">Contractor carries liability insurance and workers compensation</li>
      <li style="margin-bottom: 8px;">Disputes will be resolved through mediation before litigation</li>
    </ul>
  </div>

  <!-- SIGNATURES -->
  <div style="margin-top: 50px; padding-top: 30px; border-top: 2px solid #ddd;">
    <h2 style="color: #991B1B; font-size: 24px; margin: 0 0 25px 0;">AGREEMENT AND SIGNATURES</h2>
    
    <div style="margin-bottom: 40px;">
      <p style="margin: 0 0 30px 0;"><strong>CONTRACTOR:</strong></p>
      <div style="border-bottom: 2px solid #000; width: 300px; margin-bottom: 5px;"></div>
      <p style="margin: 0; font-size: 14px; color: #666;">${companyName}</p>
      <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Date: _________________</p>
    </div>

    <div>
      <p style="margin: 0 0 30px 0;"><strong>CLIENT:</strong></p>
      <div style="border-bottom: 2px solid #000; width: 300px; margin-bottom: 5px;"></div>
      <p style="margin: 0; font-size: 14px; color: #666;">${clientName}</p>
      <p style="margin: 5px 0 0 0; font-size: 14px; color: #666;">Date: _________________</p>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; font-size: 12px; color: #999;">
    <p style="margin: 0;"><strong>Generated by QuoteXbert</strong> - Professional Quote & Contract Platform</p>
    <p style="margin: 5px 0 0 0;">www.quotexbert.com | Connecting Homeowners with Verified Contractors</p>
  </div>

</div>
`.trim();
}
