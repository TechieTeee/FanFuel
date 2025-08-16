import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Create Supabase client or mock for development
export const supabase = supabaseUrl && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey)
  : {
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: null }),
        update: () => Promise.resolve({ data: null, error: null }),
        delete: () => Promise.resolve({ data: null, error: null }),
        eq: () => ({
          select: () => Promise.resolve({ data: [], error: null }),
          single: () => Promise.resolve({ data: null, error: null })
        })
      }),
      auth: {
        signUp: () => Promise.resolve({ data: null, error: null }),
        signIn: () => Promise.resolve({ data: null, error: null }),
        signOut: () => Promise.resolve({ error: null })
      }
    } as any

interface AthleteData {
  name: string
  sport: string
  university?: string
  position?: string
  year?: string
  background?: string
}

interface ReactionData {
  athlete_id: string
  reaction_type: string
  amount: number
}

// Database helper functions
export const createAthlete = async (athleteData: AthleteData) => {
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

export const createCommentaryReaction = async (reactionData: ReactionData) => {
  const { data, error } = await supabase
    .from('commentary_reactions')
    .insert(reactionData)
    .select()
  
  return { data, error }
}

export const getCommentaryReactions = async (athleteId: string) => {
  const { data, error } = await supabase
    .from('commentary_reactions')
    .select('*')
    .eq('athlete_id', athleteId)
    .order('created_at', { ascending: false })
  
  return { data, error }
}