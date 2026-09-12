export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "super_admin" | "admin" | "editor";
export type ProjectStatus = "planning" | "in_development" | "active" | "completed" | "archived";
export type LabStatus = "coming_soon" | "available" | "in_development" | "archived";
export type ContactSubmissionStatus = "new" | "read" | "replied" | "archived";
export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "publish"
  | "unpublish"
  | "login"
  | "logout"
  | "role_change"
  | "media_upload"
  | "media_delete";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          role: UserRole;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: UserRole;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      site_settings: {
        Row: {
          id: string;
          site_name: string;
          tagline: string;
          short_description: string | null;
          long_description: string | null;
          logo_url: string | null;
          favicon_url: string | null;
          footer_text: string | null;
          copyright_text: string | null;
          primary_accent: string;
          secondary_accent: string;
          owner_name: string | null;
          owner_title: string | null;
          owner_description: string | null;
          created_at: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          site_name?: string;
          tagline?: string;
          short_description?: string | null;
          long_description?: string | null;
          logo_url?: string | null;
          favicon_url?: string | null;
          footer_text?: string | null;
          copyright_text?: string | null;
          primary_accent?: string;
          secondary_accent?: string;
          owner_name?: string | null;
          owner_title?: string | null;
          owner_description?: string | null;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          site_name?: string;
          tagline?: string;
          short_description?: string | null;
          long_description?: string | null;
          logo_url?: string | null;
          favicon_url?: string | null;
          footer_text?: string | null;
          copyright_text?: string | null;
          primary_accent?: string;
          secondary_accent?: string;
          owner_name?: string | null;
          owner_title?: string | null;
          owner_description?: string | null;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      contact_information: {
        Row: {
          id: string;
          display_name: string | null;
          email: string | null;
          phone: string | null;
          whatsapp: string | null;
          location: string | null;
          website: string | null;
          description: string | null;
          contact_modal_description: string | null;
          created_at: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          display_name?: string | null;
          email?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          location?: string | null;
          website?: string | null;
          description?: string | null;
          contact_modal_description?: string | null;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          email?: string | null;
          phone?: string | null;
          whatsapp?: string | null;
          location?: string | null;
          website?: string | null;
          description?: string | null;
          contact_modal_description?: string | null;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      contact_submissions: {
        Row: {
          id: string;
          name: string | null;
          email: string;
          subject: string | null;
          message: string;
          status: ContactSubmissionStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          name?: string | null;
          email: string;
          subject?: string | null;
          message: string;
          status?: ContactSubmissionStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          email?: string;
          subject?: string | null;
          message?: string;
          status?: ContactSubmissionStatus;
          created_at?: string;
        };
        Relationships: [];
      };
      social_links: {
        Row: {
          id: string;
          platform: string;
          label: string;
          url: string;
          icon: string | null;
          description: string | null;
          enabled: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          platform: string;
          label: string;
          url: string;
          icon?: string | null;
          description?: string | null;
          enabled?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          platform?: string;
          label?: string;
          url?: string;
          icon?: string | null;
          description?: string | null;
          enabled?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      navigation_items: {
        Row: {
          id: string;
          location: "navbar" | "footer";
          label: string;
          url: string;
          is_external: boolean;
          enabled: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          location: "navbar" | "footer";
          label: string;
          url: string;
          is_external?: boolean;
          enabled?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          location?: "navbar" | "footer";
          label?: string;
          url?: string;
          is_external?: boolean;
          enabled?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      technologies: {
        Row: {
          id: string;
          name: string;
          category: string;
          description: string | null;
          icon: string | null;
          website_url: string | null;
          github_url: string | null;
          enabled: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          category: string;
          description?: string | null;
          icon?: string | null;
          website_url?: string | null;
          github_url?: string | null;
          enabled?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          category?: string;
          description?: string | null;
          icon?: string | null;
          website_url?: string | null;
          github_url?: string | null;
          enabled?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          short_description: string;
          full_description: string | null;
          category: string | null;
          status: ProjectStatus;
          featured: boolean;
          published: boolean;
          project_url: string | null;
          github_url: string | null;
          documentation_url: string | null;
          demo_url: string | null;
          image_url: string | null;
          icon: string | null;
          accent_color: string | null;
          year: string | null;
          display_order: number;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          short_description: string;
          full_description?: string | null;
          category?: string | null;
          status?: ProjectStatus;
          featured?: boolean;
          published?: boolean;
          project_url?: string | null;
          github_url?: string | null;
          documentation_url?: string | null;
          demo_url?: string | null;
          image_url?: string | null;
          icon?: string | null;
          accent_color?: string | null;
          year?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          short_description?: string;
          full_description?: string | null;
          category?: string | null;
          status?: ProjectStatus;
          featured?: boolean;
          published?: boolean;
          project_url?: string | null;
          github_url?: string | null;
          documentation_url?: string | null;
          demo_url?: string | null;
          image_url?: string | null;
          icon?: string | null;
          accent_color?: string | null;
          year?: string | null;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      project_technologies: {
        Row: {
          id: string;
          project_id: string;
          technology_id: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          technology_id: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          technology_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_technologies_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_technologies_technology_id_fkey";
            columns: ["technology_id"];
            isOneToOne: false;
            referencedRelation: "technologies";
            referencedColumns: ["id"];
          }
        ];
      };
      project_tags: {
        Row: {
          id: string;
          project_id: string;
          tag: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          tag: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          tag?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_tags_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          }
        ];
      };
      research_articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string;
          content: string | null;
          author: string | null;
          publication_date: string | null;
          category: string | null;
          cover_image_url: string | null;
          external_url: string | null;
          reading_time: string | null;
          featured: boolean;
          published: boolean;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          excerpt: string;
          content?: string | null;
          author?: string | null;
          publication_date?: string | null;
          category?: string | null;
          cover_image_url?: string | null;
          external_url?: string | null;
          reading_time?: string | null;
          featured?: boolean;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          excerpt?: string;
          content?: string | null;
          author?: string | null;
          publication_date?: string | null;
          category?: string | null;
          cover_image_url?: string | null;
          external_url?: string | null;
          reading_time?: string | null;
          featured?: boolean;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      research_tags: {
        Row: {
          id: string;
          article_id: string;
          tag: string;
        };
        Insert: {
          id?: string;
          article_id: string;
          tag: string;
        };
        Update: {
          id?: string;
          article_id?: string;
          tag?: string;
        };
        Relationships: [
          {
            foreignKeyName: "research_tags_article_id_fkey";
            columns: ["article_id"];
            isOneToOne: false;
            referencedRelation: "research_articles";
            referencedColumns: ["id"];
          }
        ];
      };
      labs: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          status: LabStatus;
          difficulty: string | null;
          category: string | null;
          url: string | null;
          github_url: string | null;
          documentation_url: string | null;
          image_url: string | null;
          icon: string | null;
          featured: boolean;
          published: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          status?: LabStatus;
          difficulty?: string | null;
          category?: string | null;
          url?: string | null;
          github_url?: string | null;
          documentation_url?: string | null;
          image_url?: string | null;
          icon?: string | null;
          featured?: boolean;
          published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          status?: LabStatus;
          difficulty?: string | null;
          category?: string | null;
          url?: string | null;
          github_url?: string | null;
          documentation_url?: string | null;
          image_url?: string | null;
          icon?: string | null;
          featured?: boolean;
          published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      exploration_items: {
        Row: {
          id: string;
          title: string;
          description: string;
          icon: string;
          accent: string | null;
          link: string | null;
          published: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          icon: string;
          accent?: string | null;
          link?: string | null;
          published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          icon?: string;
          accent?: string | null;
          link?: string | null;
          published?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      seo_settings: {
        Row: {
          id: string;
          meta_title: string | null;
          meta_description: string | null;
          keywords: string[] | null;
          og_title: string | null;
          og_description: string | null;
          og_image_url: string | null;
          twitter_title: string | null;
          twitter_description: string | null;
          canonical_url: string | null;
          robots_index: boolean;
          robots_follow: boolean;
          created_at: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          meta_title?: string | null;
          meta_description?: string | null;
          keywords?: string[] | null;
          og_title?: string | null;
          og_description?: string | null;
          og_image_url?: string | null;
          twitter_title?: string | null;
          twitter_description?: string | null;
          canonical_url?: string | null;
          robots_index?: boolean;
          robots_follow?: boolean;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          meta_title?: string | null;
          meta_description?: string | null;
          keywords?: string[] | null;
          og_title?: string | null;
          og_description?: string | null;
          og_image_url?: string | null;
          twitter_title?: string | null;
          twitter_description?: string | null;
          canonical_url?: string | null;
          robots_index?: boolean;
          robots_follow?: boolean;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      appearance_settings: {
        Row: {
          id: string;
          primary_accent: string;
          secondary_accent: string;
          background_color: string;
          text_color: string;
          card_background: string;
          border_color: string;
          glow_intensity: string;
          border_radius: string;
          created_at: string;
          updated_at: string;
          updated_by: string | null;
        };
        Insert: {
          id?: string;
          primary_accent?: string;
          secondary_accent?: string;
          background_color?: string;
          text_color?: string;
          card_background?: string;
          border_color?: string;
          glow_intensity?: string;
          border_radius?: string;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Update: {
          id?: string;
          primary_accent?: string;
          secondary_accent?: string;
          background_color?: string;
          text_color?: string;
          card_background?: string;
          border_color?: string;
          glow_intensity?: string;
          border_radius?: string;
          created_at?: string;
          updated_at?: string;
          updated_by?: string | null;
        };
        Relationships: [];
      };
      media: {
        Row: {
          id: string;
          file_name: string;
          storage_path: string;
          public_url: string;
          mime_type: string;
          file_size: number;
          alt_text: string | null;
          description: string | null;
          usage: string | null;
          uploaded_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          file_name: string;
          storage_path: string;
          public_url: string;
          mime_type: string;
          file_size: number;
          alt_text?: string | null;
          description?: string | null;
          usage?: string | null;
          uploaded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          file_name?: string;
          storage_path?: string;
          public_url?: string;
          mime_type?: string;
          file_size?: number;
          alt_text?: string | null;
          description?: string | null;
          usage?: string | null;
          uploaded_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          action: AuditAction;
          entity_type: string;
          entity_id: string | null;
          entity_name: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          action: AuditAction;
          entity_type: string;
          entity_id?: string | null;
          entity_name?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          action?: AuditAction;
          entity_type?: string;
          entity_id?: string | null;
          entity_name?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
