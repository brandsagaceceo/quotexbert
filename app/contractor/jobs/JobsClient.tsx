"use client"

import { useState, useEffect } from 'react'
import { saveInterestAction } from './actions'
import FiltersBar from '@/app/_components/jobs/FiltersBar'
import JobCard from '@/app/_components/jobs/JobCard'

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

interface Filters {
  q?: string
  trade?: string
  minBudget?: number
  maxBudget?: number
  province?: string
  city?: string
}

interface JobsClientProps {
  initialLeads: Lead[]
}

export default function JobsClient({ initialLeads }: JobsClientProps) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>(initialLeads)
  const [filters, setFilters] = useState<Filters>({})

  const handleSaveJob = async (leadId: string) => {
    try {
      await saveInterestAction(leadId, 'SAVED')
      // Could show success message
    } catch (error) {
      console.error('Error saving job:', error)
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

  const applyFilters = () => {
    let filtered = leads

    // Search filter
    if (filters.q) {
      const searchLower = filters.q.toLowerCase()
      filtered = filtered.filter(lead => 
        lead.projectType.toLowerCase().includes(searchLower) ||
        lead.description.toLowerCase().includes(searchLower) ||
        lead.tags?.toLowerCase().includes(searchLower) ||
        lead.city?.toLowerCase().includes(searchLower)
      )
    }

    // Location filters
    if (filters.city) {
      filtered = filtered.filter(lead => 
        lead.city?.toLowerCase().includes(filters.city!.toLowerCase())
      )
    }

    if (filters.province) {
      filtered = filtered.filter(lead => lead.province === filters.province)
    }

    // Trade type filter
    if (filters.trade) {
      filtered = filtered.filter(lead => 
        lead.projectType.toLowerCase().includes(filters.trade!.toLowerCase()) ||
        lead.tags?.toLowerCase().includes(filters.trade!.toLowerCase())
      )
    }

    // Budget filters
    if (filters.minBudget) {
      filtered = filtered.filter(lead => 
        lead.budgetMin && lead.budgetMin >= filters.minBudget!
      )
    }

    if (filters.maxBudget) {
      filtered = filtered.filter(lead => 
        lead.budgetMax && lead.budgetMax <= filters.maxBudget!
      )
    }

    setFilteredLeads(filtered)
  }

  useEffect(() => {
    applyFilters()
  }, [filters, leads])

  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters)
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink-900 mb-2">
            Available Jobs
          </h1>
          <p className="text-ink-600">
            Find and apply to construction projects in your area
          </p>
          <div className="mt-4 flex gap-4 text-sm text-ink-500">
            <span>Total Jobs: {leads.length}</span>
            <span>•</span>
            <span>Filtered: {filteredLeads.length}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <FiltersBar onFiltersChange={handleFilterChange} />
        </div>

        {/* Jobs List */}
        <div className="space-y-6">
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-ink-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-ink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-ink-900 mb-2">
                No jobs found
              </h3>
              <p className="text-ink-600 mb-4">
                Try adjusting your filters to see more results.
              </p>
              <button
                onClick={() => setFilters({})}
                className="px-6 py-3 bg-brand hover:bg-brand-dark text-white rounded-xl font-medium transition-colors duration-200"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            filteredLeads.map((lead) => (
              <JobCard
                key={lead.id}
                lead={lead}
                onSave={handleSaveJob}
                onApply={handleApplyJob}
              />
            ))
          )}
        </div>

        {/* Load More (placeholder for infinite scroll) */}
        {filteredLeads.length > 0 && filteredLeads.length >= 10 && (
          <div className="text-center mt-12">
            <button className="px-6 py-3 bg-white border border-ink-300 hover:bg-ink-50 text-ink-700 rounded-xl font-medium transition-colors duration-200">
              Load More Jobs
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
