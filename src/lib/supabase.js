import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not found, using mock client')
  
  // Mock client for development/demo
  export const supabase = {
    from: () => ({
      select: () => ({ data: [], error: null }),
      insert: () => ({ data: null, error: null }),
      update: () => ({ data: null, error: null }),
      delete: () => ({ data: null, error: null })
    }),
    auth: {
      signUp: () => ({ data: null, error: null }),
      signIn: () => ({ data: null, error: null }),
      signOut: () => ({ error: null })
    }
  }
} else {
  export const supabase = createClient(supabaseUrl, supabaseKey)
}

// Database helper functions
export const createAthlete = async (athleteData) => {
  const { data, error } = await supabase
    .from('athletes')
    .insert(athleteData)
    .select()
  
  return { data, error }
}

export const getAthletes = async () => {
  const { data, error } = await supabase
    .from('athletes')
    .select('*')
    .order('created_at', { ascending: false })
  
  return { data, error }
}

export const createCommentaryReaction = async (reactionData) => {
  const { data, error } = await supabase
    .from('commentary_reactions')
    .insert(reactionData)
    .select()
  
  return { data, error }
}

export const getCommentaryReactions = async (athleteId) => {
  const { data, error } = await supabase
    .from('commentary_reactions')
    .select('*')
    .eq('athlete_id', athleteId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}