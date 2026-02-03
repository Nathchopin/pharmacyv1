export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_recommendations_cache: {
        Row: {
          biomarker_hash: string
          created_at: string
          id: string
          recommendations: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          biomarker_hash: string
          created_at?: string
          id?: string
          recommendations: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          biomarker_hash?: string
          created_at?: string
          id?: string
          recommendations?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      biomarkers: {
        Row: {
          created_at: string
          id: string
          insight: string | null
          max_range: number | null
          min_range: number | null
          name: string
          optimal_max: number | null
          optimal_min: number | null
          recorded_at: string
          status: string
          test_date: string | null
          unit: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          id?: string
          insight?: string | null
          max_range?: number | null
          min_range?: number | null
          name: string
          optimal_max?: number | null
          optimal_min?: number | null
          recorded_at?: string
          status: string
          test_date?: string | null
          unit: string
          user_id: string
          value: number
        }
        Update: {
          created_at?: string
          id?: string
          insight?: string | null
          max_range?: number | null
          min_range?: number | null
          name?: string
          optimal_max?: number | null
          optimal_min?: number | null
          recorded_at?: string
          status?: string
          test_date?: string | null
          unit?: string
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      consultations: {
        Row: {
          assigned_pharmacist_id: string | null
          created_at: string
          decision: string | null
          decision_reason: string | null
          id: string
          patient_data: Json
          patient_id: string
          pharmacist_notes: string | null
          reviewed_at: string | null
          service_type: string
          status: string
          updated_at: string
        }
        Insert: {
          assigned_pharmacist_id?: string | null
          created_at?: string
          decision?: string | null
          decision_reason?: string | null
          id?: string
          patient_data?: Json
          patient_id: string
          pharmacist_notes?: string | null
          reviewed_at?: string | null
          service_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          assigned_pharmacist_id?: string | null
          created_at?: string
          decision?: string | null
          decision_reason?: string | null
          id?: string
          patient_data?: Json
          patient_id?: string
          pharmacist_notes?: string | null
          reviewed_at?: string | null
          service_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      health_data: {
        Row: {
          created_at: string
          data_type: string
          id: string
          recorded_at: string
          user_id: string
          value: Json
        }
        Insert: {
          created_at?: string
          data_type: string
          id?: string
          recorded_at?: string
          user_id: string
          value: Json
        }
        Update: {
          created_at?: string
          data_type?: string
          id?: string
          recorded_at?: string
          user_id?: string
          value?: Json
        }
        Relationships: []
      }
      lab_uploads: {
        Row: {
          biomarker_count: number | null
          created_at: string
          file_name: string
          file_path: string
          id: string
          test_date: string
          user_id: string
        }
        Insert: {
          biomarker_count?: number | null
          created_at?: string
          file_name: string
          file_path: string
          id?: string
          test_date?: string
          user_id: string
        }
        Update: {
          biomarker_count?: number | null
          created_at?: string
          file_name?: string
          file_path?: string
          id?: string
          test_date?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string
          id: string
          is_read: boolean | null
          sender_type: string | null
          subject: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          sender_type?: string | null
          subject: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          is_read?: boolean | null
          sender_type?: string | null
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      pharmacist_queue: {
        Row: {
          assigned_to: string | null
          completed_at: string | null
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          notes: string | null
          patient_id: string
          priority: string
          status: string
          task_type: string
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          patient_id: string
          priority?: string
          status?: string
          task_type: string
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          completed_at?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          notes?: string | null
          patient_id?: string
          priority?: string
          status?: string
          task_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          activity_level: string | null
          address: string | null
          avatar_url: string | null
          created_at: string
          current_weight_kg: number | null
          date_of_birth: string | null
          first_name: string | null
          health_score: number | null
          height_cm: number | null
          id: string
          last_name: string | null
          nhs_number: string | null
          notification_app: boolean | null
          notification_email: boolean | null
          notification_sms: boolean | null
          onboarding_completed: boolean | null
          phone: string | null
          postcode: string | null
          role: string
          target_weight_kg: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          activity_level?: string | null
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          current_weight_kg?: number | null
          date_of_birth?: string | null
          first_name?: string | null
          health_score?: number | null
          height_cm?: number | null
          id?: string
          last_name?: string | null
          nhs_number?: string | null
          notification_app?: boolean | null
          notification_email?: boolean | null
          notification_sms?: boolean | null
          onboarding_completed?: boolean | null
          phone?: string | null
          postcode?: string | null
          role?: string
          target_weight_kg?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          activity_level?: string | null
          address?: string | null
          avatar_url?: string | null
          created_at?: string
          current_weight_kg?: number | null
          date_of_birth?: string | null
          first_name?: string | null
          health_score?: number | null
          height_cm?: number | null
          id?: string
          last_name?: string | null
          nhs_number?: string | null
          notification_app?: boolean | null
          notification_email?: boolean | null
          notification_sms?: boolean | null
          onboarding_completed?: boolean | null
          phone?: string | null
          postcode?: string | null
          role?: string
          target_weight_kg?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      treatment_checkins: {
        Row: {
          checked_in: boolean
          checkin_date: string
          created_at: string
          id: string
          notes: string | null
          treatment_type: string
          user_id: string
        }
        Insert: {
          checked_in?: boolean
          checkin_date?: string
          created_at?: string
          id?: string
          notes?: string | null
          treatment_type: string
          user_id: string
        }
        Update: {
          checked_in?: boolean
          checkin_date?: string
          created_at?: string
          id?: string
          notes?: string | null
          treatment_type?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_health_score: { Args: { p_user_id: string }; Returns: number }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
