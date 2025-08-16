import { claimLead, saveInterest } from '@/lib/jobs'
// import { currentUser } from '@clerk/nextjs/server' // Disabled for demo

export async function saveInterestAction(leadId: string, type: 'SAVED' | 'APPLIED', message?: string) {
  try {
    // For demo purposes, use mock contractor ID
    // const user = await currentUser()
    // if (!user || user.publicMetadata?.role !== 'contractor') {
    //   throw new Error('Unauthorized')
    // }
    
    const contractorId = 'demo-contractor-123' // Mock ID for demo
    
    await saveInterest({
      contractorId,
      leadId,
      type,
      message
    })
    
    return { success: true }
  } catch (error) {
    console.error('Error saving interest:', error)
    return { success: false, error: 'Failed to save interest' }
  }
}

export async function claimLeadAction(leadId: string, message?: string) {
  try {
    // For demo purposes, use mock contractor ID
    // const user = await currentUser()
    // if (!user || user.publicMetadata?.role !== 'contractor') {
    //   throw new Error('Unauthorized')
    // }
    
    const contractorId = 'demo-contractor-123' // Mock ID for demo
    
    // First save the application with message
    if (message) {
      await saveInterest({
        contractorId,
        leadId,
        type: 'APPLIED',
        message
      })
    }
    
    // Then attempt to claim
    const result = await claimLead({
      leadId,
      contractorId
    })

    if (result.claimed) {
      // TODO: Send email notifications here
      // - Email to site owner about claim
      // - Confirmation email to contractor
      console.log('Job claimed successfully, emails would be sent here')
    }
    
    return result
  } catch (error) {
    console.error('Error claiming lead:', error)
    return { claimed: false, reason: 'TRANSACTION_FAILED' }
  }
}
