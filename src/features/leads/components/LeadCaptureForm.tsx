import type { FormEvent } from 'react'
import { useState } from 'react'
import type { LeadCreatePayload, LeadUrgency } from '../../../shared/types'

type LeadCaptureFormProps = {
  onSubmit: (lead: LeadCreatePayload) => Promise<void> | void
  loading?: boolean
}

export const LeadCaptureForm = ({ onSubmit, loading }: LeadCaptureFormProps) => {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    preferred_area: '',
    budget: '',
    urgency: 'medium' as LeadUrgency,
    notes: '',
  })

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const payload: LeadCreatePayload = {
      full_name: form.full_name,
      email: form.email || undefined,
      phone: form.phone || undefined,
      preferred_area: form.preferred_area || undefined,
      budget: form.budget ? Number(form.budget) : undefined,
      urgency: form.urgency,
      notes: form.notes || undefined,
    }

    await onSubmit(payload)
    setForm({
      full_name: '',
      email: '',
      phone: '',
      preferred_area: '',
      budget: '',
      urgency: 'medium',
      notes: '',
    })
  }


}
