"use client"

import { useState, useTransition } from 'react'
import { CANADIAN_PROVINCES, TRADE_TYPES } from '@/lib/canada'

interface Lead {
  id: string
  createdAt: Date
  projectType: string
  description: string
  estimate: string
  postalCode?: string | null
  source?: string | null
  affiliateId?: string | null
  status: string
  city?: string | null
  province?: string | null
  budgetMin?: number | null
  budgetMax?: number | null
  tags?: string | null
  claimedById?: string | null
  notesAdmin?: string | null
}

interface EditableFieldProps {
  value: string | number | null | undefined
  onSave: (value: string | number | null) => void
  type?: 'text' | 'number' | 'select'
  options?: Array<{ value: string; label: string }>
  placeholder?: string
}

function EditableField({ value, onSave, type = 'text', options, placeholder }: EditableFieldProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(value?.toString() || '')

  const handleSave = () => {
    let parsedValue: string | number | null = editValue || null
    if (type === 'number' && editValue) {
      parsedValue = parseFloat(editValue)
    }
    onSave(parsedValue)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(value?.toString() || '')
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        {type === 'select' && options ? (
          <select
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="text-sm border border-ink-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand"
            autoFocus
          >
            <option value="">{placeholder || 'Select...'}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="text-sm border border-ink-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-brand w-32"
            placeholder={placeholder}
            autoFocus
          />
        )}
        <button
          onClick={handleSave}
          className="text-green-600 hover:text-green-700 text-sm"
        >
          ✓
        </button>
        <button
          onClick={handleCancel}
          className="text-red-600 hover:text-red-700 text-sm"
        >
          ✕
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="text-left hover:bg-ink-50 px-2 py-1 rounded transition-colors duration-200"
    >
      {value || <span className="text-ink-400 italic">{placeholder || 'Add...'}</span>}
    </button>
  )
}

export default function AdminLeadsTable({ leads }: { leads: Lead[] }) {
  const [isPending, startTransition] = useTransition()

  const updateLeadStatus = async (leadId: string, status: string) => {
    try {
      const response = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, status })
      })
      if (!response.ok) throw new Error('Failed to update status')
      
      // Revalidate the page
      window.location.reload()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const updateLeadField = async (leadId: string, field: string, value: string | number | null) => {
    try {
      const response = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId, [field]: value })
      })
      if (!response.ok) throw new Error('Failed to update field')
      
      // Revalidate the page
      window.location.reload()
    } catch (error) {
      console.error('Error updating field:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      DRAFT: 'bg-gray-100 text-gray-800',
      PUBLISHED: 'bg-green-100 text-green-800',
      CLOSED: 'bg-red-100 text-red-800',
      ARCHIVED: 'bg-ink-100 text-ink-600'
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status as keyof typeof statusStyles] || statusStyles.DRAFT}`}>
        {status}
      </span>
    )
  }

  return (
    <div className="bg-white border border-ink-200 rounded-[var(--radius-card)] shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-ink-200">
          <thead className="bg-ink-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                Project Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                Budget
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                Tags
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-ink-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-ink-200">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-ink-500">
                  No leads found
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="hover:bg-ink-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-900">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {getStatusBadge(lead.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-ink-900">
                    {lead.projectType}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="space-y-1">
                      <EditableField
                        value={lead.city}
                        onSave={(value) => updateLeadField(lead.id, 'city', value)}
                        placeholder="City"
                      />
                      <EditableField
                        value={lead.province}
                        onSave={(value) => updateLeadField(lead.id, 'province', value)}
                        type="select"
                        options={CANADIAN_PROVINCES.map((p: { code: string; name: string }) => ({ value: p.code, label: p.name }))}
                        placeholder="Province"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        $<EditableField
                          value={lead.budgetMin}
                          onSave={(value) => updateLeadField(lead.id, 'budgetMin', value)}
                          type="number"
                          placeholder="Min"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        $<EditableField
                          value={lead.budgetMax}
                          onSave={(value) => updateLeadField(lead.id, 'budgetMax', value)}
                          type="number"
                          placeholder="Max"
                        />
                      </div>
                    </div>
                    <div className="text-xs text-ink-500 mt-1">
                      Original: {lead.estimate}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <EditableField
                      value={lead.tags}
                      onSave={(value) => updateLeadField(lead.id, 'tags', value)}
                      placeholder="Add tags..."
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-ink-900 max-w-xs">
                    <details className="cursor-pointer">
                      <summary className="font-medium hover:text-[var(--brand)]">
                        View description
                      </summary>
                      <p className="mt-2 text-ink-600 whitespace-pre-wrap">
                        {lead.description}
                      </p>
                    </details>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex flex-col gap-2">
                      {lead.status === 'DRAFT' && (
                        <button
                          onClick={() => startTransition(() => updateLeadStatus(lead.id, 'PUBLISHED'))}
                          disabled={isPending}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-medium transition-colors duration-200 disabled:opacity-50"
                        >
                          Publish
                        </button>
                      )}
                      {lead.status === 'PUBLISHED' && (
                        <button
                          onClick={() => startTransition(() => updateLeadStatus(lead.id, 'CLOSED'))}
                          disabled={isPending}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-medium transition-colors duration-200 disabled:opacity-50"
                        >
                          Close
                        </button>
                      )}
                      {(lead.status === 'CLOSED' || lead.status === 'PUBLISHED') && (
                        <button
                          onClick={() => startTransition(() => updateLeadStatus(lead.id, 'ARCHIVED'))}
                          disabled={isPending}
                          className="px-3 py-1 bg-ink-600 hover:bg-ink-700 text-white rounded text-xs font-medium transition-colors duration-200 disabled:opacity-50"
                        >
                          Archive
                        </button>
                      )}
                      {lead.claimedById && (
                        <div className="text-xs text-green-600 font-medium">
                          Claimed
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
