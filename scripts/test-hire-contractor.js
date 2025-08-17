// Test the contractor acceptance API
const testHireContractor = async () => {
  try {
    console.log("Testing contractor hire functionality...");

    // Use the Kitchen Sink Repair lead
    const leadId = "cmeelabu30006jkistp4fbfh0";
    const contractorId = "cmeelabtm0001jkisp3uamyg2";

    const response = await fetch(
      `http://localhost:3000/api/leads/${leadId}/accept`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contractorId: contractorId,
        }),
      },
    );

    const result = await response.json();
    console.log("Response status:", response.status);
    console.log("Response:", result);

    if (response.ok) {
      console.log("✅ Contractor hired successfully!");
      console.log("Lead status:", result.lead.status);
      console.log("Published:", result.lead.published);
    } else {
      console.log("❌ Failed to hire contractor:", result.error);
    }
  } catch (error) {
    console.error("Error testing hire:", error);
  }
};

testHireContractor();
