'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function simulateDraw(formData: FormData) {
  const supabase = await createClient()
  
  // 1. Generate 5 random numbers between 1 and 45
  const winningNumbers = [];
  while(winningNumbers.length < 5){
      const r = Math.floor(Math.random() * 45) + 1;
      if(winningNumbers.indexOf(r) === -1) winningNumbers.push(r);
  }

  // 2. Calculate Total Pool
  // In a real scenario, this is based on subscriptions. We'll simulate a pool.
  const { count } = await supabase.from('subscriptions').select('*', { count: 'exact', head: true }).eq('status', 'active');
  const activeSubs = count || 1;
  const pool = activeSubs * 15 * 0.4; // 40% of $15 subscriptions goes to pool

  // 3. Create Draw record
  const { data: draw, error } = await supabase.from('draws').insert({
    draw_month: new Date().toISOString().split('T')[0], // Just today's date for simplicity
    status: 'simulated',
    winning_numbers: winningNumbers,
    total_pool: pool
  }).select().single();

  if (error || !draw) throw new Error("Failed to create draw");

  // 4. Find matches
  // A real implementation would fetch all user active scores, group them into arrays of 5 per user, and compare.
  // For simplicity in this demo, we just create the draw.
  
  revalidatePath('/admin')
}

export async function publishDraw(drawId: string) {
  const supabase = await createClient()
  
  await supabase.from('draws').update({ status: 'published' }).eq('id', drawId)
  
  revalidatePath('/admin')
}
