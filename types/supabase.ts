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
      users: {
        Row: {
          id: string
          name: string
          age: number | null
          role: 'student' | 'employee' | 'freelancer' | 'business_owner' | 'retired' | 'other' | 'Athlete' | 'Actor' 
          starting_balance: number
          currency: string
          monthly_income_estimate: number | null
          monthly_expense_estimate: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          name: string
          age?: number | null
          role: 'student' | 'employed' | 'freelancer' | 'business_owner' | 'retired' | 'other'| 'Athlete' | 'Actor' 
          starting_balance?: number
          currency?: string
          monthly_income_estimate?: number | null
          monthly_expense_estimate?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          age?: number | null
          role?: 'student' | 'employed' | 'freelancer' | 'business_owner' | 'retired' | 'other'| 'Athlete' | 'Actor' 
          starting_balance?: number
          currency?: string
          monthly_income_estimate?: number | null
          monthly_expense_estimate?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          type: 'income' | 'expense' | 'Gifts'
          amount: number
          category: string
          date: string
          payment_method: string
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          type: 'income' | 'expense'
          amount: number
          category: string
          date: string
          payment_method: string
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'income' | 'expense'
          amount?: number
          category?: string
          date?: string
          payment_method?: string
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
      goals: {
        Row: {
          id: string
          user_id: string
          name: string
          category: string
          target_amount: number
          current_amount: number
          start_date: string
          end_date: string | null
          notes: string | null
          color: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          category: string
          target_amount: number
          current_amount?: number
          start_date?: string
          end_date?: string | null
          notes?: string | null
          color?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          category?: string
          target_amount?: number
          current_amount?: number
          start_date?: string
          end_date?: string | null
          notes?: string | null
          color?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}