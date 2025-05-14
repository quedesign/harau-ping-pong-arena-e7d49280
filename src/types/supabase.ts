
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      athlete_profiles: {
        Row: {
          bio: string | null
          city: string
          country: string
          created_at: string
          handedness: string
          height: number | null
          level: string
          losses: number
          state: string
          updated_at: string
          user_id: string
          weight: number | null
          wins: number
          years_playing: number | null
        }
        Insert: {
          bio?: string | null
          city: string
          country?: string
          created_at?: string
          handedness: string
          height?: number | null
          level: string
          losses?: number
          state: string
          updated_at?: string
          user_id: string
          weight?: number | null
          wins?: number
          years_playing?: number | null
        }
        Update: {
          bio?: string | null
          city?: string
          country?: string
          created_at?: string
          handedness?: string
          height?: number | null
          level?: string
          losses?: number
          state?: string
          updated_at?: string
          user_id?: string
          weight?: number | null
          wins?: number
          years_playing?: number | null
        }
      }
      athlete_followers: {
        Row: {
          id: string
          follower_id: string
          athlete_id: string
          created_at: string
        }
        Insert: {
          id?: string
          follower_id: string
          athlete_id: string
          created_at?: string
        }
        Update: {
          id?: string
          follower_id?: string
          athlete_id?: string
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          created_at: string
        }
        Insert: {
          id?: string
          created_at?: string
        }
        Update: {
          id?: string
          created_at?: string
        }
      }
      conversation_participants: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          created_at?: string
        }
      }
      login: {
        Row: {
          email: string | null
          id: number
          senha: string | null
        }
        Insert: {
          email?: string | null
          id?: number
          senha?: string | null
        }
        Update: {
          email?: string | null
          id?: number
          senha?: string | null
        }
      }
      match_scores: {
        Row: {
          created_at: string
          id: string
          match_id: string
          player_one_score: number
          player_two_score: number
          set_number: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          match_id: string
          player_one_score: number
          player_two_score: number
          set_number: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          match_id?: string
          player_one_score?: number
          player_two_score?: number
          set_number?: number
          updated_at?: string
        }
      }
      matches: {
        Row: {
          created_at: string
          id: string
          location: string | null
          match_number: number | null
          player_one_id: string
          player_two_id: string
          round_number: number | null
          scheduled_time: string
          status: string
          tournament_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          match_number?: number | null
          player_one_id: string
          player_two_id: string
          round_number?: number | null
          scheduled_time: string
          status: string
          tournament_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          match_number?: number | null
          player_one_id?: string
          player_two_id?: string
          round_number?: number | null
          scheduled_time?: string
          status?: string
          tournament_id?: string | null
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          read: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          read?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          read?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          profile_image: string | null
          role: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          name: string
          profile_image?: string | null
          role: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          profile_image?: string | null
          role?: string
        }
      }
      tournament_participants: {
        Row: {
          approved: boolean
          athlete_id: string
          created_at: string
          id: string
          seed_position: number | null
          tournament_id: string
        }
        Insert: {
          approved?: boolean
          athlete_id: string
          created_at?: string
          id?: string
          seed_position?: number | null
          tournament_id: string
        }
        Update: {
          approved?: boolean
          athlete_id?: string
          created_at?: string
          id?: string
          seed_position?: number | null
          tournament_id?: string
        }
      }
      tournaments: {
        Row: {
          banner_image: string | null
          created_at: string
          created_by: string
          description: string
          end_date: string
          entry_fee: number
          format: string
          id: string
          location: string
          max_participants: number
          name: string
          pix_key: string | null
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          banner_image?: string | null
          created_at?: string
          created_by: string
          description: string
          end_date: string
          entry_fee?: number
          format: string
          id?: string
          location: string
          max_participants: number
          name: string
          pix_key?: string | null
          start_date: string
          status: string
          updated_at?: string
        }
        Update: {
          banner_image?: string | null
          created_at?: string
          created_by?: string
          description?: string
          end_date?: string
          entry_fee?: number
          format?: string
          id?: string
          location?: string
          max_participants?: number
          name?: string
          pix_key?: string | null
          start_date?: string
          status?: string
          updated_at?: string
        }
      }
    }
    Views: {}
    Functions: {
      get_user_profile: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: {
          id: string
          name: string
          email: string
          role: string
          profile_image: string
          created_at: string
        }[]
      }
      get_athlete_followers: {
        Args: { user_id: string }
        Returns: {
          id: string
          follower_id: string
          athlete_id: string
          created_at: string
        }[]
      }
      follow_athlete: {
        Args: { follower_user_id: string, athlete_user_id: string }
        Returns: boolean
      }
      unfollow_athlete: {
        Args: { follower_user_id: string, athlete_user_id: string }
        Returns: boolean
      }
      is_following_athlete: {
        Args: { follower_user_id: string, athlete_user_id: string }
        Returns: boolean
      }
      get_or_create_conversation: {
        Args: { user1_id: string, user2_id: string }
        Returns: string
      }
      send_message: {
        Args: { sender_id: string, recipient_id: string, message_content: string }
        Returns: string
      }
    }
  }
}
