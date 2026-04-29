'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitScore(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const score = parseInt(formData.get('score') as string)
  const date = formData.get('date') as string

  if (score < 1 || score > 45) {
    throw new Error("Score must be between 1 and 45")
  }

  const { error } = await supabase
    .from('scores')
    .upsert({ 
      user_id: user.id, 
      score: score, 
      played_date: date 
    }, { onConflict: 'user_id, played_date' })

  if (error) {
    console.error("Error submitting score:", error)
    throw new Error("Failed to submit score. Duplicate date?")
  }

  revalidatePath('/dashboard')
}

export async function deleteScore(scoreId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const { error } = await supabase
    .from('scores')
    .delete()
    .eq('id', scoreId)
    .eq('user_id', user.id)

  if (error) {
    throw new Error("Failed to delete score")
  }

  revalidatePath('/dashboard')
}

export async function updateCharitySettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  const charityId = formData.get('charityId') as string
  const percentage = parseInt(formData.get('percentage') as string)

  if (percentage < 10 || percentage > 100) {
    throw new Error("Percentage must be between 10 and 100")
  }

  const { error } = await supabase
    .from('profiles')
    .update({ 
      selected_charity_id: charityId || null,
      charity_contribution_percentage: percentage
    })
    .eq('id', user.id)

  if (error) {
    throw new Error("Failed to update charity settings")
  }

  revalidatePath('/dashboard')
}
