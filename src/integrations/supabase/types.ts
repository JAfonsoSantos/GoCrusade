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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      ad_unit: {
        Row: {
          business_id: string
          created_at: string
          external_ref: string | null
          height: number
          iab_standard: boolean
          id: string
          name: string
          property_id: string
          updated_at: string
          width: number
        }
        Insert: {
          business_id: string
          created_at?: string
          external_ref?: string | null
          height: number
          iab_standard?: boolean
          id?: string
          name: string
          property_id: string
          updated_at?: string
          width: number
        }
        Update: {
          business_id?: string
          created_at?: string
          external_ref?: string | null
          height?: number
          iab_standard?: boolean
          id?: string
          name?: string
          property_id?: string
          updated_at?: string
          width?: number
        }
        Relationships: [
          {
            foreignKeyName: "ad_unit_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_unit_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property"
            referencedColumns: ["id"]
          },
        ]
      }
      advertiser: {
        Row: {
          business_id: string
          created_at: string
          id: string
          kevel_id: string | null
          name: string
          parent_name: string | null
          sf_id: string | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          kevel_id?: string | null
          name: string
          parent_name?: string | null
          sf_id?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          kevel_id?: string | null
          name?: string
          parent_name?: string | null
          sf_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "advertiser_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
        ]
      }
      brand: {
        Row: {
          advertiser_id: string
          business_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          advertiser_id: string
          business_id: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          advertiser_id?: string
          business_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "brand_advertiser_id_fkey"
            columns: ["advertiser_id"]
            isOneToOne: false
            referencedRelation: "advertiser"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brand_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
        ]
      }
      business: {
        Row: {
          created_at: string
          id: string
          name: string
          region: string
          settings_json: Json | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          region?: string
          settings_json?: Json | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          region?: string
          settings_json?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      campaign: {
        Row: {
          advertiser_id: string
          budget: number | null
          business_id: string
          created_at: string
          id: string
          kevel_id: string | null
          name: string
          owner: string | null
          property_id: string
          sf_id: string | null
          status: Database["public"]["Enums"]["campaign_status"]
          updated_at: string
        }
        Insert: {
          advertiser_id: string
          budget?: number | null
          business_id: string
          created_at?: string
          id?: string
          kevel_id?: string | null
          name: string
          owner?: string | null
          property_id: string
          sf_id?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          updated_at?: string
        }
        Update: {
          advertiser_id?: string
          budget?: number | null
          business_id?: string
          created_at?: string
          id?: string
          kevel_id?: string | null
          name?: string
          owner?: string | null
          property_id?: string
          sf_id?: string | null
          status?: Database["public"]["Enums"]["campaign_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_advertiser_id_fkey"
            columns: ["advertiser_id"]
            isOneToOne: false
            referencedRelation: "advertiser"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "property"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_opportunity: {
        Row: {
          campaign_id: string
          opportunity_id: string
        }
        Insert: {
          campaign_id: string
          opportunity_id: string
        }
        Update: {
          campaign_id?: string
          opportunity_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_opportunity_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_opportunity_opportunity_id_fkey"
            columns: ["opportunity_id"]
            isOneToOne: false
            referencedRelation: "opportunity"
            referencedColumns: ["id"]
          },
        ]
      }
      contact: {
        Row: {
          advertiser_id: string | null
          business_id: string
          created_at: string
          email: string
          id: string
          name: string
          sf_id: string | null
          title: string | null
          updated_at: string
        }
        Insert: {
          advertiser_id?: string | null
          business_id: string
          created_at?: string
          email: string
          id?: string
          name: string
          sf_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Update: {
          advertiser_id?: string | null
          business_id?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          sf_id?: string | null
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "contact_advertiser_id_fkey"
            columns: ["advertiser_id"]
            isOneToOne: false
            referencedRelation: "advertiser"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contact_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
        ]
      }
      creative: {
        Row: {
          campaign_id: string
          created_at: string
          height: number | null
          id: string
          kevel_ad_id: string | null
          name: string
          type: string
          updated_at: string
          url: string
          width: number | null
        }
        Insert: {
          campaign_id: string
          created_at?: string
          height?: number | null
          id?: string
          kevel_ad_id?: string | null
          name: string
          type: string
          updated_at?: string
          url: string
          width?: number | null
        }
        Update: {
          campaign_id?: string
          created_at?: string
          height?: number | null
          id?: string
          kevel_ad_id?: string | null
          name?: string
          type?: string
          updated_at?: string
          url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "creative_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_flight_daily: {
        Row: {
          clicks: number
          convs: number
          date: string
          flight_id: string
          id: string
          imps: number
          spend: number
        }
        Insert: {
          clicks?: number
          convs?: number
          date: string
          flight_id: string
          id?: string
          imps?: number
          spend?: number
        }
        Update: {
          clicks?: number
          convs?: number
          date?: string
          flight_id?: string
          id?: string
          imps?: number
          spend?: number
        }
        Relationships: [
          {
            foreignKeyName: "delivery_flight_daily_flight_id_fkey"
            columns: ["flight_id"]
            isOneToOne: false
            referencedRelation: "flight"
            referencedColumns: ["id"]
          },
        ]
      }
      flight: {
        Row: {
          ad_unit_id: string
          always_on: boolean
          campaign_id: string
          created_at: string
          end_at: string | null
          freq_cap_json: Json | null
          goal_amount: number | null
          goal_type: Database["public"]["Enums"]["goal_type"] | null
          id: string
          kevel_id: string | null
          name: string
          pricing_model: Database["public"]["Enums"]["pricing_model"]
          priority: Database["public"]["Enums"]["priority"]
          rate: number
          start_at: string | null
          timezone: string
          updated_at: string
        }
        Insert: {
          ad_unit_id: string
          always_on?: boolean
          campaign_id: string
          created_at?: string
          end_at?: string | null
          freq_cap_json?: Json | null
          goal_amount?: number | null
          goal_type?: Database["public"]["Enums"]["goal_type"] | null
          id?: string
          kevel_id?: string | null
          name: string
          pricing_model: Database["public"]["Enums"]["pricing_model"]
          priority?: Database["public"]["Enums"]["priority"]
          rate: number
          start_at?: string | null
          timezone?: string
          updated_at?: string
        }
        Update: {
          ad_unit_id?: string
          always_on?: boolean
          campaign_id?: string
          created_at?: string
          end_at?: string | null
          freq_cap_json?: Json | null
          goal_amount?: number | null
          goal_type?: Database["public"]["Enums"]["goal_type"] | null
          id?: string
          kevel_id?: string | null
          name?: string
          pricing_model?: Database["public"]["Enums"]["pricing_model"]
          priority?: Database["public"]["Enums"]["priority"]
          rate?: number
          start_at?: string | null
          timezone?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "flight_ad_unit_id_fkey"
            columns: ["ad_unit_id"]
            isOneToOne: false
            referencedRelation: "ad_unit"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flight_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaign"
            referencedColumns: ["id"]
          },
        ]
      }
      integration_config: {
        Row: {
          business_id: string
          created_at: string
          kevel_json: Json | null
          salesforce_json: Json | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          kevel_json?: Json | null
          salesforce_json?: Json | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          kevel_json?: Json | null
          salesforce_json?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integration_config_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: true
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
        ]
      }
      mapping_rule: {
        Row: {
          business_id: string
          created_at: string
          dest_field: string
          dest_object: string
          direction: string
          id: string
          object: string
          rules_json: Json | null
          source: Database["public"]["Enums"]["sync_source"]
          source_field: string
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          dest_field: string
          dest_object: string
          direction: string
          id?: string
          object: string
          rules_json?: Json | null
          source: Database["public"]["Enums"]["sync_source"]
          source_field: string
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          dest_field?: string
          dest_object?: string
          direction?: string
          id?: string
          object?: string
          rules_json?: Json | null
          source?: Database["public"]["Enums"]["sync_source"]
          source_field?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mapping_rule_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
        ]
      }
      opportunity: {
        Row: {
          advertiser_id: string
          amount: number | null
          business_id: string
          close_date: string | null
          created_at: string
          id: string
          name: string
          owner: string | null
          sf_id: string | null
          stage: Database["public"]["Enums"]["opportunity_stage"]
          updated_at: string
        }
        Insert: {
          advertiser_id: string
          amount?: number | null
          business_id: string
          close_date?: string | null
          created_at?: string
          id?: string
          name: string
          owner?: string | null
          sf_id?: string | null
          stage?: Database["public"]["Enums"]["opportunity_stage"]
          updated_at?: string
        }
        Update: {
          advertiser_id?: string
          amount?: number | null
          business_id?: string
          close_date?: string | null
          created_at?: string
          id?: string
          name?: string
          owner?: string | null
          sf_id?: string | null
          stage?: Database["public"]["Enums"]["opportunity_stage"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "opportunity_advertiser_id_fkey"
            columns: ["advertiser_id"]
            isOneToOne: false
            referencedRelation: "advertiser"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "opportunity_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          business_id: string | null
          created_at: string
          email: string
          id: string
          name: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          business_id?: string | null
          created_at?: string
          email: string
          id: string
          name?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          business_id?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
        ]
      }
      property: {
        Row: {
          app_id: string | null
          business_id: string
          created_at: string
          domain: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          app_id?: string | null
          business_id: string
          created_at?: string
          domain?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          app_id?: string | null
          business_id?: string
          created_at?: string
          domain?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "property_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_job: {
        Row: {
          business_id: string
          finished_at: string | null
          id: string
          source: Database["public"]["Enums"]["sync_source"]
          started_at: string
          stats_json: Json | null
          status: Database["public"]["Enums"]["sync_status"]
        }
        Insert: {
          business_id: string
          finished_at?: string | null
          id?: string
          source: Database["public"]["Enums"]["sync_source"]
          started_at?: string
          stats_json?: Json | null
          status?: Database["public"]["Enums"]["sync_status"]
        }
        Update: {
          business_id?: string
          finished_at?: string | null
          id?: string
          source?: Database["public"]["Enums"]["sync_source"]
          started_at?: string
          stats_json?: Json | null
          status?: Database["public"]["Enums"]["sync_status"]
        }
        Relationships: [
          {
            foreignKeyName: "sync_job_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "business"
            referencedColumns: ["id"]
          },
        ]
      }
      sync_log: {
        Row: {
          created_at: string
          id: string
          job_id: string
          level: Database["public"]["Enums"]["log_level"]
          message: string
          object: string
          payload_json: Json | null
          record_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          job_id: string
          level: Database["public"]["Enums"]["log_level"]
          message: string
          object: string
          payload_json?: Json | null
          record_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          job_id?: string
          level?: Database["public"]["Enums"]["log_level"]
          message?: string
          object?: string
          payload_json?: Json | null
          record_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sync_log_job_id_fkey"
            columns: ["job_id"]
            isOneToOne: false
            referencedRelation: "sync_job"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_business_id: {
        Args: { _user_id: string }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role:
        | "platform_owner"
        | "business_admin"
        | "sales"
        | "ad_ops"
        | "analyst"
      campaign_status:
        | "draft"
        | "reserved"
        | "ready"
        | "live"
        | "paused"
        | "completed"
        | "archived"
      goal_type: "IMPRESSIONS" | "CLICKS" | "CONVERSIONS" | "SPEND"
      log_level: "info" | "warning" | "error"
      opportunity_stage:
        | "Prospecting"
        | "Qualification"
        | "Proposal"
        | "Negotiation"
        | "Closed Won"
        | "Closed Lost"
      pricing_model: "CPM" | "CPC" | "CPA" | "FLAT"
      priority: "house" | "standard" | "sponsorship"
      sync_source: "salesforce" | "kevel"
      sync_status: "running" | "success" | "failed"
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
      app_role: [
        "platform_owner",
        "business_admin",
        "sales",
        "ad_ops",
        "analyst",
      ],
      campaign_status: [
        "draft",
        "reserved",
        "ready",
        "live",
        "paused",
        "completed",
        "archived",
      ],
      goal_type: ["IMPRESSIONS", "CLICKS", "CONVERSIONS", "SPEND"],
      log_level: ["info", "warning", "error"],
      opportunity_stage: [
        "Prospecting",
        "Qualification",
        "Proposal",
        "Negotiation",
        "Closed Won",
        "Closed Lost",
      ],
      pricing_model: ["CPM", "CPC", "CPA", "FLAT"],
      priority: ["house", "standard", "sponsorship"],
      sync_source: ["salesforce", "kevel"],
      sync_status: ["running", "success", "failed"],
    },
  },
} as const
