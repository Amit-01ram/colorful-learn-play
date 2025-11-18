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
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      ad_placements: {
        Row: {
          ad_id: string | null
          created_at: string
          id: string
          is_active: boolean | null
          position: string
          post_id: string | null
          updated_at: string
        }
        Insert: {
          ad_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          position: string
          post_id?: string | null
          updated_at?: string
        }
        Update: {
          ad_id?: string | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          position?: string
          post_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "ad_placements_ad_id_fkey"
            columns: ["ad_id"]
            isOneToOne: false
            referencedRelation: "ads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ad_placements_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      ads: {
        Row: {
          code: string
          created_at: string
          id: string
          is_active: boolean | null
          name: string
          position: Database["public"]["Enums"]["ad_position"]
          updated_at: string
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
          position: Database["public"]["Enums"]["ad_position"]
          updated_at?: string
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
          position?: Database["public"]["Enums"]["ad_position"]
          updated_at?: string
        }
        Relationships: []
      }
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      media_files: {
        Row: {
          created_at: string
          file_path: string
          file_size: number | null
          filename: string
          id: string
          mime_type: string | null
          original_filename: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          file_path: string
          file_size?: number | null
          filename: string
          id?: string
          mime_type?: string | null
          original_filename: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          file_path?: string
          file_size?: number | null
          filename?: string
          id?: string
          mime_type?: string | null
          original_filename?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "media_files_uploaded_by_fkey"
            columns: ["uploaded_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          author_id: string
          category_id: string | null
          consent_text: string | null
          content: string
          created_at: string
          excerpt: string | null
          id: string
          post_type: Database["public"]["Enums"]["post_type"] | null
          published_at: string | null
          requires_consent: boolean | null
          seo_description: string | null
          seo_keywords: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["post_status"] | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          video_duration: number | null
          video_transcript: string | null
          video_type: string | null
          video_url: string | null
          view_count: number | null
        }
        Insert: {
          author_id: string
          category_id?: string | null
          consent_text?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          id?: string
          post_type?: Database["public"]["Enums"]["post_type"] | null
          published_at?: string | null
          requires_consent?: boolean | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["post_status"] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          video_duration?: number | null
          video_transcript?: string | null
          video_type?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Update: {
          author_id?: string
          category_id?: string | null
          consent_text?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          id?: string
          post_type?: Database["public"]["Enums"]["post_type"] | null
          published_at?: string | null
          requires_consent?: boolean | null
          seo_description?: string | null
          seo_keywords?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["post_status"] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          video_duration?: number | null
          video_transcript?: string | null
          video_type?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          is_admin: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          key: string
          type: string | null
          updated_at: string
          value: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          key: string
          type?: string | null
          updated_at?: string
          value?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          key?: string
          type?: string | null
          updated_at?: string
          value?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      tools: {
        Row: {
          category: Database["public"]["Enums"]["tool_category"] | null
          created_at: string
          description: string | null
          embed_code: string | null
          homepage_position: number | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          thumbnail_url: string | null
          updated_at: string
          url: string | null
        }
        Insert: {
          category?: Database["public"]["Enums"]["tool_category"] | null
          created_at?: string
          description?: string | null
          embed_code?: string | null
          homepage_position?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          thumbnail_url?: string | null
          updated_at?: string
          url?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["tool_category"] | null
          created_at?: string
          description?: string | null
          embed_code?: string | null
          homepage_position?: number | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          thumbnail_url?: string | null
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      video_analytics: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          post_id: string | null
          timestamp_seconds: number | null
          user_session: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          post_id?: string | null
          timestamp_seconds?: number | null
          user_session?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          post_id?: string | null
          timestamp_seconds?: number | null
          user_session?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "video_analytics_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
      video_consent_logs: {
        Row: {
          consent_given: boolean
          consent_type: string[] | null
          created_at: string
          id: string
          ip_address: string | null
          post_id: string | null
          user_agent: string | null
          user_session: string
        }
        Insert: {
          consent_given: boolean
          consent_type?: string[] | null
          created_at?: string
          id?: string
          ip_address?: string | null
          post_id?: string | null
          user_agent?: string | null
          user_session: string
        }
        Update: {
          consent_given?: boolean
          consent_type?: string[] | null
          created_at?: string
          id?: string
          ip_address?: string | null
          post_id?: string | null
          user_agent?: string | null
          user_session?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_consent_logs_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_post_views: { Args: { post_slug: string }; Returns: undefined }
      is_admin_user: { Args: { user_uuid: string }; Returns: boolean }
      make_user_admin: { Args: { user_email: string }; Returns: undefined }
    }
    Enums: {
      ad_position:
        | "homepage_top"
        | "homepage_middle"
        | "homepage_bottom"
        | "post_before"
        | "post_inside"
        | "post_after"
        | "video_banner_300x250"
        | "video_banner_728x90"
        | "video_popunder"
        | "video_smartlink"
        | "video_social_bar"
        | "video_native_banner"
      post_status: "draft" | "published" | "archived"
      post_type: "article" | "video" | "tool"
      tool_category:
        | "productivity"
        | "design"
        | "development"
        | "marketing"
        | "analytics"
        | "other"
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
      ad_position: [
        "homepage_top",
        "homepage_middle",
        "homepage_bottom",
        "post_before",
        "post_inside",
        "post_after",
        "video_banner_300x250",
        "video_banner_728x90",
        "video_popunder",
        "video_smartlink",
        "video_social_bar",
        "video_native_banner",
      ],
      post_status: ["draft", "published", "archived"],
      post_type: ["article", "video", "tool"],
      tool_category: [
        "productivity",
        "design",
        "development",
        "marketing",
        "analytics",
        "other",
      ],
    },
  },
} as const
