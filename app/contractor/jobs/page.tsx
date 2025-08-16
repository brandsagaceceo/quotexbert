import { listPublishedLeads } from '@/lib/jobs'
import JobsClient from './JobsClient'

export default async function ContractorJobsPage() {
  try {
    const leads = await listPublishedLeads({})
    return <JobsClient initialLeads={leads.leads} />
  } catch (error) {
    console.error('Error loading jobs:', error)
    return <JobsClient initialLeads={[]} />
  }
}
