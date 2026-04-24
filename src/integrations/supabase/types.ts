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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string
          date_of_birth: string | null
          district: string | null
          first_name: string
          gender: string | null
          id: string
          is_online: boolean
          mandal: string | null
          phone: string
          reference_id: string | null
          state: string | null
          updated_at: string
          user_id: string
          village: string | null
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          district?: string | null
          first_name: string
          gender?: string | null
          id?: string
          is_online?: boolean
          mandal?: string | null
          phone: string
          reference_id?: string | null
          state?: string | null
          updated_at?: string
          user_id: string
          village?: string | null
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          district?: string | null
          first_name?: string
          gender?: string | null
          id?: string
          is_online?: boolean
          mandal?: string | null
          phone?: string
          reference_id?: string | null
          state?: string | null
          updated_at?: string
          user_id?: string
          village?: string | null
        }
        Relationships: []
      }
      referral_earnings: {
        Row: {
          amount: number
          created_at: string
          id: string
          reason: string
          referred_user_id: string
          referrer_user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          id?: string
          reason?: string
          referred_user_id: string
          referrer_user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          reason?: string
          referred_user_id?: string
          referrer_user_id?: string
        }
        Relationships: []
      }
      service_applications: {
        Row: {
          aadhaar_back_url: string | null
          aadhaar_front_url: string | null
          aadhaar_pan: string | null
          address: string | null
          age: number | null
          availability: string | null
          category: string | null
          city: string | null
          country: string | null
          created_at: string
          district: string | null
          driving_license_number: string | null
          email: string | null
          equipment_owned: string | null
          expected_wage: number | null
          experience_years: number | null
          farm_location: string | null
          farm_size: string | null
          first_name: string
          gender: string | null
          group_count: number | null
          id: string
          last_name: string | null
          license_back_url: string | null
          license_front_url: string | null
          mandal: string | null
          phone: string
          preferred_location: string | null
          profile_photo_url: string | null
          rc_image_url: string | null
          registration_number: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          skills: string[] | null
          state: string | null
          status: string
          updated_at: string
          user_id: string
          vehicle_image_urls: string[] | null
          vehicle_make: string | null
          vehicle_model: string | null
          vehicle_number: string | null
          vehicle_type: string | null
          vehicle_year: string | null
          village: string | null
          wage_type: string | null
          work_duration: string | null
        }
        Insert: {
          aadhaar_back_url?: string | null
          aadhaar_front_url?: string | null
          aadhaar_pan?: string | null
          address?: string | null
          age?: number | null
          availability?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          district?: string | null
          driving_license_number?: string | null
          email?: string | null
          equipment_owned?: string | null
          expected_wage?: number | null
          experience_years?: number | null
          farm_location?: string | null
          farm_size?: string | null
          first_name: string
          gender?: string | null
          group_count?: number | null
          id?: string
          last_name?: string | null
          license_back_url?: string | null
          license_front_url?: string | null
          mandal?: string | null
          phone: string
          preferred_location?: string | null
          profile_photo_url?: string | null
          rc_image_url?: string | null
          registration_number?: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          skills?: string[] | null
          state?: string | null
          status?: string
          updated_at?: string
          user_id: string
          vehicle_image_urls?: string[] | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_number?: string | null
          vehicle_type?: string | null
          vehicle_year?: string | null
          village?: string | null
          wage_type?: string | null
          work_duration?: string | null
        }
        Update: {
          aadhaar_back_url?: string | null
          aadhaar_front_url?: string | null
          aadhaar_pan?: string | null
          address?: string | null
          age?: number | null
          availability?: string | null
          category?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          district?: string | null
          driving_license_number?: string | null
          email?: string | null
          equipment_owned?: string | null
          expected_wage?: number | null
          experience_years?: number | null
          farm_location?: string | null
          farm_size?: string | null
          first_name?: string
          gender?: string | null
          group_count?: number | null
          id?: string
          last_name?: string | null
          license_back_url?: string | null
          license_front_url?: string | null
          mandal?: string | null
          phone?: string
          preferred_location?: string | null
          profile_photo_url?: string | null
          rc_image_url?: string | null
          registration_number?: string | null
          service_type?: Database["public"]["Enums"]["service_type"]
          skills?: string[] | null
          state?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          vehicle_image_urls?: string[] | null
          vehicle_make?: string | null
          vehicle_model?: string | null
          vehicle_number?: string | null
          vehicle_type?: string | null
          vehicle_year?: string | null
          village?: string | null
          wage_type?: string | null
          work_duration?: string | null
        }
        Relationships: []
      }
      vehicle_registrations: {
        Row: {
          aadhaar_back_url: string | null
          aadhaar_front_url: string | null
          aadhaar_pan: string
          age: number | null
          country: string
          created_at: string
          district: string | null
          driving_license_number: string
          full_name: string
          gender: string | null
          id: string
          license_back_url: string | null
          license_front_url: string | null
          mandal: string | null
          mobile: string
          profile_photo_url: string | null
          rc_image_url: string | null
          state: string | null
          status: string
          updated_at: string
          user_id: string
          vehicle_image_urls: string[] | null
          vehicle_number: string
          vehicle_usage_type: string
          village: string | null
        }
        Insert: {
          aadhaar_back_url?: string | null
          aadhaar_front_url?: string | null
          aadhaar_pan: string
          age?: number | null
          country?: string
          created_at?: string
          district?: string | null
          driving_license_number: string
          full_name: string
          gender?: string | null
          id?: string
          license_back_url?: string | null
          license_front_url?: string | null
          mandal?: string | null
          mobile: string
          profile_photo_url?: string | null
          rc_image_url?: string | null
          state?: string | null
          status?: string
          updated_at?: string
          user_id: string
          vehicle_image_urls?: string[] | null
          vehicle_number: string
          vehicle_usage_type: string
          village?: string | null
        }
        Update: {
          aadhaar_back_url?: string | null
          aadhaar_front_url?: string | null
          aadhaar_pan?: string
          age?: number | null
          country?: string
          created_at?: string
          district?: string | null
          driving_license_number?: string
          full_name?: string
          gender?: string | null
          id?: string
          license_back_url?: string | null
          license_front_url?: string | null
          mandal?: string | null
          mobile?: string
          profile_photo_url?: string | null
          rc_image_url?: string | null
          state?: string | null
          status?: string
          updated_at?: string
          user_id?: string
          vehicle_image_urls?: string[] | null
          vehicle_number?: string
          vehicle_usage_type?: string
          village?: string | null
        }
        Relationships: []
      }
      withdrawal_requests: {
        Row: {
          amount: number
          bank_account: string | null
          bank_ifsc: string | null
          bank_name: string | null
          created_at: string
          id: string
          processed_at: string | null
          status: string
          upi_id: string | null
          user_id: string
        }
        Insert: {
          amount: number
          bank_account?: string | null
          bank_ifsc?: string | null
          bank_name?: string | null
          created_at?: string
          id?: string
          processed_at?: string | null
          status?: string
          upi_id?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          bank_account?: string | null
          bank_ifsc?: string | null
          bank_name?: string | null
          created_at?: string
          id?: string
          processed_at?: string | null
          status?: string
          upi_id?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      credit_referral: {
        Args: { _referred_user_id: string; _referrer_user_id: string }
        Returns: undefined
      }
      notify_agrizin_sync: {
        Args: { _kind: string; _row: Json }
        Returns: undefined
      }
    }
    Enums: {
      service_type: "rent_vehicle" | "farm_maker" | "agrizin_driver"
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
    Enums: {
      service_type: ["rent_vehicle", "farm_maker", "agrizin_driver"],
    },
  },
} as const
