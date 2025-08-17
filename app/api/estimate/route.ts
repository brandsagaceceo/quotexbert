import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { logEventServer } from "@/lib/analytics";

// AI estimate stub - returns realistic price ranges based on job description
export async function POST(req: NextRequest) {
  try {
    const { description, userId } = await req.json();

    if (!description || description.trim().length < 5) {
      return NextResponse.json(
        { error: "Please provide a more detailed job description" },
        { status: 400 },
      );
    }

    // Simple AI simulation based on keywords
    const estimate = generateEstimate(description.toLowerCase());

    // Log analytics event
    await logEventServer(
      userId || "anonymous",
      "estimate_created",
      {
        description: description.substring(0, 100), // First 100 chars for privacy
        estimateMin: estimate.min,
        estimateMax: estimate.max,
        descriptionLength: description.length,
      }
    );

    return NextResponse.json(estimate);
  } catch (error) {
    console.error("Error generating estimate:", error);
    return NextResponse.json(
      { error: "Failed to generate estimate" },
      { status: 500 },
    );
  }
}

function generateEstimate(description: string): {
  min: number;
  max: number;
  description: string;
} {
  // Kitchen projects
  if (description.includes("kitchen")) {
    if (description.includes("renovation") || description.includes("remodel")) {
      return {
        min: 15000,
        max: 45000,
        description:
          "Kitchen renovation costs vary widely based on size, materials, and appliances. This estimate includes basic to mid-range finishes.",
      };
    }
    if (description.includes("cabinet")) {
      return {
        min: 3000,
        max: 12000,
        description:
          "Cabinet replacement or refacing costs depend on size, material, and hardware choices.",
      };
    }
    if (description.includes("faucet")) {
      return {
        min: 150,
        max: 500,
        description:
          "Faucet replacement including basic installation. Higher-end faucets may cost more.",
      };
    }
  }

  // Bathroom projects
  if (description.includes("bathroom")) {
    if (description.includes("renovation") || description.includes("remodel")) {
      return {
        min: 8000,
        max: 25000,
        description:
          "Bathroom renovation including fixtures, tiling, and basic electrical/plumbing work.",
      };
    }
  }

  // Painting
  if (description.includes("paint")) {
    const roomCount = extractRoomCount(description);
    const baseMin = 300;
    const baseMax = 800;
    return {
      min: baseMin * roomCount,
      max: baseMax * roomCount,
      description: `Interior painting for ${roomCount} room${roomCount > 1 ? "s" : ""} including primer, paint, and basic prep work.`,
    };
  }

  // Flooring
  if (
    description.includes("floor") ||
    description.includes("laminate") ||
    description.includes("hardwood") ||
    description.includes("tile")
  ) {
    const sqft = extractSquareFootage(description) || 500;
    const pricePerSqft = description.includes("hardwood")
      ? { min: 8, max: 15 }
      : { min: 3, max: 8 };
    return {
      min: Math.round(sqft * pricePerSqft.min),
      max: Math.round(sqft * pricePerSqft.max),
      description: `Flooring installation for approximately ${sqft} sq ft including materials and labor.`,
    };
  }

  // Roofing
  if (description.includes("roof")) {
    return {
      min: 8000,
      max: 20000,
      description:
        "Roof replacement or major repair for typical residential home. Price varies with materials and size.",
    };
  }

  // Electrical
  if (
    description.includes("electrical") ||
    description.includes("wiring") ||
    description.includes("outlet")
  ) {
    return {
      min: 200,
      max: 800,
      description:
        "Basic electrical work including outlet installation or minor wiring. Complex projects may cost more.",
    };
  }

  // Plumbing
  if (
    description.includes("plumbing") ||
    description.includes("pipe") ||
    description.includes("drain")
  ) {
    return {
      min: 250,
      max: 1200,
      description:
        "Plumbing repair or installation including basic fixtures and labor.",
    };
  }

  // HVAC
  if (
    description.includes("hvac") ||
    description.includes("furnace") ||
    description.includes("air condition")
  ) {
    return {
      min: 3000,
      max: 8000,
      description:
        "HVAC system installation or major repair including unit and basic installation.",
    };
  }

  // Default estimate for unrecognized projects
  return {
    min: 500,
    max: 2000,
    description:
      "General home repair estimate. Final cost will depend on specific project requirements and materials.",
  };
}

function extractRoomCount(description: string): number {
  const matches = description.match(/(\d+)\s*(room|bedroom|bed)/i);
  return matches ? parseInt(matches[1]!) : 1;
}

function extractSquareFootage(description: string): number | null {
  const matches =
    description.match(/(\d+)\s*(sq|square)\s*(ft|foot|feet)/i) ||
    description.match(/(\d+)\s*(sq\s*ft)/i);
  return matches ? parseInt(matches[1]!) : null;
}
