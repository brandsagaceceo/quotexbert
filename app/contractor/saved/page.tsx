import SavedJobsClient from "./SavedJobsClient";

export default async function SavedJobsPage() {
  // For demo purposes, return empty array since we don't have actual user auth
  // const contractorId = 'demo-contractor-123'
  // const interests = await getContractorInterests(contractorId, 'SAVED')

  const savedJobs: any[] = [];
  const leads: any[] = [];

  return <SavedJobsClient initialSavedJobs={savedJobs} initialLeads={leads} />;
}
