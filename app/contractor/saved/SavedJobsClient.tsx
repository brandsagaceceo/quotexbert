"use client"

import { useState } from 'react'
import Link from 'next/link'
import JobCard from '@/app/_components/jobs/JobCard'
import { saveInterestAction } from '../jobs/actions'

interface SavedJob {
  id: string
  leadId: string
  createdAt: Date
  message?: string | null
}

interface Lead {
  id: string
  createdAt: Date
  projectType: string
  description: string
  estimate: string
  city?: string | null
  province?: string | null
  tags?: string | null
  affiliateId?: string | null
  status: string
  budgetMin?: number | null
  budgetMax?: number | null
}

interface SavedJobsClientProps {
  initialSavedJobs: SavedJob[]
  initialLeads: Lead[]
}

export default function SavedJobsClient({ initialSavedJobs, initialLeads }: SavedJobsClientProps) {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>(initialSavedJobs)
  const [leads, setLeads] = useState<Lead[]>(initialLeads)

  const handleUnsaveJob = async (leadId: string) => {
    try {
      // Remove from saved jobs (in real implementation, would delete the interest)
      setSavedJobs(prev => prev.filter(job => job.leadId !== leadId))
      setLeads(prev => prev.filter(lead => lead.id !== leadId))
    } catch (error) {
      console.error('Error unsaving job:', error)
    }
  }

  const handleApplyJob = async (leadId: string) => {
    try {
      await saveInterestAction(leadId, 'APPLIED')
      // Could show success message
    } catch (error) {
      console.error('Error applying to job:', error)
    }
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink-900 mb-2">
            Saved Jobs
          </h1>
          <p className="text-ink-600">
            Jobs you&apos;ve saved for later review
          </p>
        </div>

        {/* Content */}
        {leads.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-ink-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-ink-900 mb-2">
              No saved jobs yet
            </h3>
            <p className="text-ink-600 mb-4">
              Save jobs from the job board to keep them for later review.
            </p>
            <Link
              href="/contractor/jobs"
              className="px-6 py-3 bg-brand hover:bg-brand-dark text-white rounded-xl font-medium transition-colors duration-200 inline-block"
            >
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {leads.map((lead) => {
              const savedJob = savedJobs.find(job => job.leadId === lead.id)
              return (
                <div key={lead.id} className="relative">
                  <JobCard
                    lead={lead}
                    isSaved={true}
                    onSave={handleUnsaveJob}
                    onApply={handleApplyJob}
                  />
                  {savedJob?.createdAt && (
                    <div className="absolute top-4 right-4">
                      <span className="text-xs text-ink-500">
                        Saved {new Date(savedJob.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
