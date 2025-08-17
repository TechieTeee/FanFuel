interface Athlete {
  id: string;
  name: string;
  sport: string;
  university?: string;
  position?: string;
  year?: string;
  background: string;
  achievements?: string[];
  total_earnings?: number;
  fan_count?: number;
  monthly_from_purchases?: number;
  recent_performance?: string;
  recent_game?: string;
}

interface Commentary {
  id: string;
  text: string;
  athlete_id: string;
  source: string;
  created_at: string;
  intensity?: number;
  virality_score?: number;
  sentiment?: string;
  suggested_reaction?: number;
}

interface FanHistory {
  totalSpent: number;
  reactions: number;
}

export async function getReactionSuggestion(athlete: Athlete, commentary: Commentary, fanHistory: FanHistory) {
  try {
    const response = await fetch('/api/ai-reaction-suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ athlete, commentary, fanHistory }),
    });
    const suggestion = await response.json();
    return suggestion;
  } catch (error) {
    console.error("Error getting reaction suggestion:", error);
    // Return a default suggestion in case of an error
    return 5;
  }
}