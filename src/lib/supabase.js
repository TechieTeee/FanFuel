import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client or mock for demo
export const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  : {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
        eq: () => ({
          select: () => Promise.resolve({ data: [], error: null }),
          update: () => Promise.resolve({ data: null, error: null }),
          delete: () => Promise.resolve({ data: null, error: null })
        })
      }),
      auth: {
        signUp: () => Promise.resolve({ data: null, error: null }),
        signIn: () => Promise.resolve({ data: null, error: null }),
        signOut: () => Promise.resolve({ error: null })
      }
    }

// Demo functions for athlete data
export async function getAthletes() {
  const { data, error } = await supabase
    .from('athletes')
    .select('*')

  if (error) {
    console.error('Error fetching athletes:', error)
    return []
  }

  return data || []
}

export async function getAthleteById(id) {
  const { data, error } = await supabase
    .from('athletes')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching athlete:', error)
    return null
  }

  return data
}

export async function updateAthleteEarnings(id, earnings) {
  const { data, error } = await supabase
    .from('athletes')
    .update({ total_earnings: earnings })
    .eq('id', id)

  if (error) {
    console.error('Error updating athlete earnings:', error)
    return false
  }

  return true
}