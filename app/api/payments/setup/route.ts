import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  try {
    const { userId, paymentMethodId, isDefault = false } = await request.json();

    if (!userId || !paymentMethodId) {
      return NextResponse.json(
        { error: "User ID and payment method ID are required" },
        { status: 400 }
      );
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Create Stripe customer if needed
    let stripeCustomerId = user.stripeCustomerId;
    if (!stripeCustomerId) {
      const customerData: any = {
        email: user.email,
        metadata: { userId }
      };
      
      if (user.name) {
        customerData.name = user.name;
      }

      const customer = await stripe.customers.create(customerData);
      stripeCustomerId = customer.id;

      // Update user with Stripe customer ID
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId }
      });
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId,
    });

    // Get payment method details from Stripe
    const stripePaymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    // If setting as default, remove default flag from other payment methods
    if (isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false }
      });

      // Set as default customer payment method in Stripe
      await stripe.customers.update(stripeCustomerId, {
        invoice_settings: { default_payment_method: paymentMethodId }
      });
    }

    // Store payment method in database
    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        userId: userId,
        stripePaymentMethodId: paymentMethodId,
        type: stripePaymentMethod.type,
        last4: stripePaymentMethod.card?.last4 || stripePaymentMethod.us_bank_account?.last4 || null,
        brand: stripePaymentMethod.card?.brand || null,
        expMonth: stripePaymentMethod.card?.exp_month || null,
        expYear: stripePaymentMethod.card?.exp_year || null,
        isDefault: isDefault,
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      paymentMethod: {
        id: paymentMethod.id,
        type: paymentMethod.type,
        last4: paymentMethod.last4,
        brand: paymentMethod.brand,
        expMonth: paymentMethod.expMonth,
        expYear: paymentMethod.expYear,
        isDefault: paymentMethod.isDefault,
        isActive: paymentMethod.isActive
      }
    });

  } catch (error) {
    console.error("Error setting up payment method:", error);
    
    if (error instanceof Error && 'type' in error) {
      // Stripe error
      return NextResponse.json(
        { error: `Setup failed: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to setup payment method" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get user's payment methods
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { 
        userId,
        isActive: true
      },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json({
      success: true,
      paymentMethods: paymentMethods.map(pm => ({
        id: pm.id,
        type: pm.type,
        last4: pm.last4,
        brand: pm.brand,
        expMonth: pm.expMonth,
        expYear: pm.expYear,
        isDefault: pm.isDefault,
        isActive: pm.isActive,
        stripePaymentMethodId: pm.stripePaymentMethodId
      }))
    });

  } catch (error) {
    console.error("Error fetching payment methods:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment methods" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const paymentMethodId = searchParams.get('paymentMethodId');
    const userId = searchParams.get('userId');

    if (!paymentMethodId || !userId) {
      return NextResponse.json(
        { error: "Payment method ID and user ID are required" },
        { status: 400 }
      );
    }

    // Get payment method from database
    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId }
    });

    if (!paymentMethod || paymentMethod.userId !== userId) {
      return NextResponse.json(
        { error: "Payment method not found or unauthorized" },
        { status: 404 }
      );
    }

    // Detach from Stripe
    await stripe.paymentMethods.detach(paymentMethod.stripePaymentMethodId);

    // Mark as inactive in database
    await prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: { isActive: false }
    });

    return NextResponse.json({
      success: true,
      message: "Payment method removed"
    });

  } catch (error) {
    console.error("Error removing payment method:", error);
    
    if (error instanceof Error && 'type' in error) {
      // Stripe error
      return NextResponse.json(
        { error: `Removal failed: ${error.message}` },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to remove payment method" },
      { status: 500 }
    );
  }
}