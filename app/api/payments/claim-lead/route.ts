import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import { canClaimLead, chargeLead } from '@/lib/billing';

export async function POST(request: NextRequest) {
  try {
    const { userId, leadId, amount } = await request.json();

    if (!userId || !leadId || !amount) {
      return NextResponse.json({ 
        error: 'User ID, Lead ID, and amount are required' 
      }, { status: 400 });
    }

    // Check if user can claim leads
    const { canClaim, reason, billing } = await canClaimLead(userId);
    
    if (!canClaim) {
      return NextResponse.json({ 
        error: reason || 'Cannot claim lead',
        requiresPaymentSetup: reason === 'No payment method on file'
      }, { status: 400 });
    }

    // Get the lead to determine pricing
    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { homeowner: true }
    });

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    // Calculate pricing based on project type
    const leadPricing = {
      'kitchen': 1500, // $15.00
      'bathroom': 1200, // $12.00
      'general': 800,   // $8.00
      'renovation': 2000, // $20.00
    };

    const projectType = determineProjectType(lead.description || lead.title);
    const amountCents = leadPricing[projectType] || 1000; // Default $10.00

    try {
      // Create payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountCents,
        currency: 'usd',
        customer: billing.stripeCustomerId,
        description: `Lead claim: ${lead.title}`,
        metadata: {
          userId,
          leadId,
          projectType
        },
        confirm: true,
        payment_method_types: ['card'],
        // Use saved payment method
        setup_future_usage: 'off_session'
      });

      if (paymentIntent.status === 'succeeded') {
        // Charge was successful, create billing record
        await chargeLead(billing.id, leadId, amountCents, paymentIntent.id);

        // Update lead status
        await prisma.lead.update({
          where: { id: leadId },
          data: { 
            contractorId: userId,
            status: 'claimed'
          }
        });

        // Create notification for homeowner
        await prisma.notification.create({
          data: {
            userId: lead.homeownerId,
            type: 'LEAD_CLAIMED',
            payload: {
              leadId,
              contractorId: userId,
              title: lead.title
            }
          }
        });

        return NextResponse.json({
          success: true,
          paymentIntentId: paymentIntent.id,
          amountCharged: amountCents,
          leadId
        });
      } else {
        return NextResponse.json({ 
          error: 'Payment failed',
          status: paymentIntent.status 
        }, { status: 400 });
      }
    } catch (stripeError: any) {
      console.error('Stripe payment error:', stripeError);
      
      // Handle specific Stripe errors
      if (stripeError.code === 'card_declined') {
        return NextResponse.json({ 
          error: 'Payment declined. Please check your payment method.' 
        }, { status: 400 });
      } else if (stripeError.code === 'authentication_required') {
        return NextResponse.json({ 
          error: 'Payment requires authentication. Please update your payment method.' 
        }, { status: 400 });
      } else {
        return NextResponse.json({ 
          error: 'Payment processing failed. Please try again.' 
        }, { status: 400 });
      }
    }
  } catch (error) {
    console.error('Error processing lead claim payment:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

function determineProjectType(description: string): keyof typeof leadPricing {
  const text = description.toLowerCase();
  
  if (text.includes('kitchen') || text.includes('cabinet') || text.includes('countertop')) {
    return 'kitchen';
  } else if (text.includes('bathroom') || text.includes('shower') || text.includes('vanity')) {
    return 'bathroom';
  } else if (text.includes('renovation') || text.includes('remodel') || text.includes('addition')) {
    return 'renovation';
  } else {
    return 'general';
  }
}

const leadPricing = {
  'kitchen': 1500,    // $15.00
  'bathroom': 1200,   // $12.00
  'general': 800,     // $8.00
  'renovation': 2000, // $20.00
};