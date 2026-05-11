export type Difficulty = 'easy' | 'medium' | 'hard'
export type Confidence = 'again' | 'hard' | 'good' | 'easy'
export type FriendshipStatus = 'pending' | 'accepted'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          username?: string
          display_name?: string | null
          avatar_url?: string | null
        }
      }
      problems: {
        Row: {
          id: string
          user_id: string
          leetcode_number: number | null
          title: string
          url: string | null
          difficulty: Difficulty | null
          ease_factor: number
          current_interval_days: number
          next_review_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          leetcode_number?: number | null
          title: string
          url?: string | null
          difficulty?: Difficulty | null
          ease_factor?: number
          current_interval_days?: number
          next_review_at?: string | null
          created_at?: string
        }
        Update: {
          leetcode_number?: number | null
          title?: string
          url?: string | null
          difficulty?: Difficulty | null
          ease_factor?: number
          current_interval_days?: number
          next_review_at?: string | null
        }
      }
      attempts: {
        Row: {
          id: string
          problem_id: string
          user_id: string
          solved_at: string
          time_spent_minutes: number | null
          confidence: Confidence
          notes: string | null
          solution_code: string | null
          solution_language: string | null
        }
        Insert: {
          id?: string
          problem_id: string
          user_id: string
          solved_at?: string
          time_spent_minutes?: number | null
          confidence: Confidence
          notes?: string | null
          solution_code?: string | null
          solution_language?: string | null
        }
        Update: {
          time_spent_minutes?: number | null
          confidence?: Confidence
          notes?: string | null
          solution_code?: string | null
          solution_language?: string | null
        }
      }
      tags: {
        Row: {
          id: string
          user_id: string | null
          name: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
        }
        Update: {
          name?: string
        }
      }
      problem_tags: {
        Row: {
          problem_id: string
          tag_id: string
        }
        Insert: {
          problem_id: string
          tag_id: string
        }
        Update: Record<string, never>
      }
      friendships: {
        Row: {
          id: string
          requester_id: string
          addressee_id: string
          status: FriendshipStatus
          created_at: string
        }
        Insert: {
          id?: string
          requester_id: string
          addressee_id: string
          status?: FriendshipStatus
          created_at?: string
        }
        Update: {
          status?: FriendshipStatus
        }
      }
    }
    Views: {
      public_profile_stats: {
        Row: {
          user_id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          total_problems_solved: number
          current_streak: number
        }
      }
    }
    Enums: {
      difficulty: Difficulty
      confidence: Confidence
      friendship_status: FriendshipStatus
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Problem = Database['public']['Tables']['problems']['Row']
export type Attempt = Database['public']['Tables']['attempts']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
export type Friendship = Database['public']['Tables']['friendships']['Row']
export type PublicProfileStats = Database['public']['Views']['public_profile_stats']['Row']
