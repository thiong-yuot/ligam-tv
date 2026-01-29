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
      affiliate_earnings: {
        Row: {
          affiliate_id: string
          amount: number
          commission_rate: number
          created_at: string
          id: string
          referral_id: string
          status: string
          subscription_month: number
        }
        Insert: {
          affiliate_id: string
          amount: number
          commission_rate: number
          created_at?: string
          id?: string
          referral_id: string
          status?: string
          subscription_month: number
        }
        Update: {
          affiliate_id?: string
          amount?: number
          commission_rate?: number
          created_at?: string
          id?: string
          referral_id?: string
          status?: string
          subscription_month?: number
        }
        Relationships: [
          {
            foreignKeyName: "affiliate_earnings_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "affiliate_earnings_referral_id_fkey"
            columns: ["referral_id"]
            isOneToOne: false
            referencedRelation: "referrals"
            referencedColumns: ["id"]
          },
        ]
      }
      affiliates: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          pending_earnings: number | null
          referral_code: string
          total_earnings: number | null
          total_referrals: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          pending_earnings?: number | null
          referral_code: string
          total_earnings?: number | null
          total_referrals?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          pending_earnings?: number | null
          referral_code?: string
          total_earnings?: number | null
          total_referrals?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      bookings: {
        Row: {
          course_id: string | null
          created_at: string | null
          creator_id: string
          description: string | null
          duration_minutes: number | null
          id: string
          learner_id: string
          meeting_url: string | null
          notes: string | null
          price: number | null
          scheduled_at: string
          status: string | null
          stripe_payment_intent_id: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          creator_id: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          learner_id: string
          meeting_url?: string | null
          notes?: string | null
          price?: number | null
          scheduled_at: string
          status?: string | null
          stripe_payment_intent_id?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          creator_id?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          learner_id?: string
          meeting_url?: string | null
          notes?: string | null
          price?: number | null
          scheduled_at?: string
          status?: string | null
          stripe_payment_intent_id?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bookings_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_featured: boolean | null
          name: string
          slug: string
          sort_order: number | null
          tags: string[] | null
          viewer_count: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
          tags?: string[] | null
          viewer_count?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_featured?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
          tags?: string[] | null
          viewer_count?: number | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          created_at: string | null
          id: string
          is_deleted: boolean | null
          message: string
          stream_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          message: string
          stream_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          message?: string
          stream_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
        ]
      }
      cms_pages: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          is_published: boolean | null
          meta_description: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          is_published?: boolean | null
          meta_description?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string | null
          email: string
          id: string
          message: string
          name: string
          status: string | null
          subject: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          message: string
          name: string
          status?: string | null
          subject: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          message?: string
          name?: string
          status?: string | null
          subject?: string
        }
        Relationships: []
      }
      course_lessons: {
        Row: {
          content_type: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_preview: boolean | null
          resources: Json | null
          section_id: string
          sort_order: number | null
          title: string
          video_url: string | null
        }
        Insert: {
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean | null
          resources?: Json | null
          section_id: string
          sort_order?: number | null
          title: string
          video_url?: string | null
        }
        Update: {
          content_type?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_preview?: boolean | null
          resources?: Json | null
          section_id?: string
          sort_order?: number | null
          title?: string
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "course_sections"
            referencedColumns: ["id"]
          },
        ]
      }
      course_reviews: {
        Row: {
          course_id: string
          created_at: string | null
          id: string
          is_verified: boolean | null
          rating: number
          review_text: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating: number
          review_text?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          id?: string
          is_verified?: boolean | null
          rating?: number
          review_text?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_reviews_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_sections: {
        Row: {
          course_id: string
          created_at: string | null
          description: string | null
          id: string
          sort_order: number | null
          title: string
        }
        Insert: {
          course_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          sort_order?: number | null
          title: string
        }
        Update: {
          course_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          sort_order?: number | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "course_sections_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          average_rating: number | null
          category: string | null
          created_at: string | null
          creator_id: string
          description: string | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          language: string | null
          level: string | null
          preview_video_url: string | null
          price: number
          short_description: string | null
          thumbnail_url: string | null
          title: string
          total_duration_minutes: number | null
          total_enrollments: number | null
          total_lessons: number | null
          total_reviews: number | null
          updated_at: string | null
        }
        Insert: {
          average_rating?: number | null
          category?: string | null
          created_at?: string | null
          creator_id: string
          description?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          language?: string | null
          level?: string | null
          preview_video_url?: string | null
          price?: number
          short_description?: string | null
          thumbnail_url?: string | null
          title: string
          total_duration_minutes?: number | null
          total_enrollments?: number | null
          total_lessons?: number | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Update: {
          average_rating?: number | null
          category?: string | null
          created_at?: string | null
          creator_id?: string
          description?: string | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          language?: string | null
          level?: string | null
          preview_video_url?: string | null
          price?: number
          short_description?: string | null
          thumbnail_url?: string | null
          title?: string
          total_duration_minutes?: number | null
          total_enrollments?: number | null
          total_lessons?: number | null
          total_reviews?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      creator_availability: {
        Row: {
          created_at: string | null
          creator_id: string
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean | null
          start_time: string
        }
        Insert: {
          created_at?: string | null
          creator_id: string
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean | null
          start_time: string
        }
        Update: {
          created_at?: string | null
          creator_id?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean | null
          start_time?: string
        }
        Relationships: []
      }
      discovery_content: {
        Row: {
          content: string | null
          content_type: string
          created_at: string | null
          duration_minutes: number | null
          id: string
          is_featured: boolean | null
          is_published: boolean | null
          published_at: string | null
          source_count: number | null
          source_name: string | null
          summary: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string | null
          view_count: number | null
        }
        Insert: {
          content?: string | null
          content_type?: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          source_count?: number | null
          source_name?: string | null
          summary?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Update: {
          content?: string | null
          content_type?: string
          created_at?: string | null
          duration_minutes?: number | null
          id?: string
          is_featured?: boolean | null
          is_published?: boolean | null
          published_at?: string | null
          source_count?: number | null
          source_name?: string | null
          summary?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      earnings: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          source_id: string | null
          status: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          id?: string
          source_id?: string | null
          status?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          source_id?: string | null
          status?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      eelai_conversations: {
        Row: {
          created_at: string | null
          id: string
          title: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          title?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      eelai_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "eelai_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "eelai_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          amount_paid: number | null
          completed_at: string | null
          completed_lessons: string[] | null
          course_id: string
          enrolled_at: string | null
          id: string
          is_completed: boolean | null
          last_accessed_at: string | null
          progress_percentage: number | null
          stripe_payment_intent_id: string | null
          user_id: string
        }
        Insert: {
          amount_paid?: number | null
          completed_at?: string | null
          completed_lessons?: string[] | null
          course_id: string
          enrolled_at?: string | null
          id?: string
          is_completed?: boolean | null
          last_accessed_at?: string | null
          progress_percentage?: number | null
          stripe_payment_intent_id?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number | null
          completed_at?: string | null
          completed_lessons?: string[] | null
          course_id?: string
          enrolled_at?: string | null
          id?: string
          is_completed?: boolean | null
          last_accessed_at?: string | null
          progress_percentage?: number | null
          stripe_payment_intent_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          category: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          question: string
          sort_order: number | null
        }
        Insert: {
          answer: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          question: string
          sort_order?: number | null
        }
        Update: {
          answer?: string
          category?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          question?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      followers: {
        Row: {
          created_at: string | null
          follower_id: string
          following_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          follower_id: string
          following_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          follower_id?: string
          following_id?: string
          id?: string
        }
        Relationships: []
      }
      freelance_services: {
        Row: {
          category: string | null
          created_at: string | null
          delivery_days: number | null
          description: string | null
          freelancer_id: string
          id: string
          is_active: boolean | null
          price: number
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          delivery_days?: number | null
          description?: string | null
          freelancer_id: string
          id?: string
          is_active?: boolean | null
          price: number
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          delivery_days?: number | null
          description?: string | null
          freelancer_id?: string
          id?: string
          is_active?: boolean | null
          price?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "freelance_services_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "freelancers"
            referencedColumns: ["id"]
          },
        ]
      }
      freelancer_orders: {
        Row: {
          client_id: string
          completed_at: string | null
          created_at: string
          deliverables: string[] | null
          due_date: string | null
          freelancer_id: string | null
          id: string
          package_id: string | null
          requirements: string | null
          status: string
          stripe_payment_intent_id: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          client_id: string
          completed_at?: string | null
          created_at?: string
          deliverables?: string[] | null
          due_date?: string | null
          freelancer_id?: string | null
          id?: string
          package_id?: string | null
          requirements?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          client_id?: string
          completed_at?: string | null
          created_at?: string
          deliverables?: string[] | null
          due_date?: string | null
          freelancer_id?: string | null
          id?: string
          package_id?: string | null
          requirements?: string | null
          status?: string
          stripe_payment_intent_id?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "freelancer_orders_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "freelancers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "freelancer_orders_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "freelancer_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      freelancer_packages: {
        Row: {
          created_at: string
          delivery_days: number
          description: string | null
          features: string[] | null
          freelancer_id: string | null
          id: string
          is_popular: boolean | null
          name: string
          price: number
          revisions: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          delivery_days?: number
          description?: string | null
          features?: string[] | null
          freelancer_id?: string | null
          id?: string
          is_popular?: boolean | null
          name: string
          price: number
          revisions?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          delivery_days?: number
          description?: string | null
          features?: string[] | null
          freelancer_id?: string | null
          id?: string
          is_popular?: boolean | null
          name?: string
          price?: number
          revisions?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "freelancer_packages_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "freelancers"
            referencedColumns: ["id"]
          },
        ]
      }
      freelancers: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          hourly_rate: number | null
          id: string
          is_available: boolean | null
          is_verified: boolean | null
          name: string
          portfolio_images: string[] | null
          portfolio_url: string | null
          rating: number | null
          skills: string[] | null
          thumbnail_url: string | null
          title: string
          total_jobs: number | null
          user_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          hourly_rate?: number | null
          id?: string
          is_available?: boolean | null
          is_verified?: boolean | null
          name: string
          portfolio_images?: string[] | null
          portfolio_url?: string | null
          rating?: number | null
          skills?: string[] | null
          thumbnail_url?: string | null
          title: string
          total_jobs?: number | null
          user_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          hourly_rate?: number | null
          id?: string
          is_available?: boolean | null
          is_verified?: boolean | null
          name?: string
          portfolio_images?: string[] | null
          portfolio_url?: string | null
          rating?: number | null
          skills?: string[] | null
          thumbnail_url?: string | null
          title?: string
          total_jobs?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      gift_transactions: {
        Row: {
          amount: number
          created_at: string | null
          gift_id: string
          id: string
          message: string | null
          recipient_id: string
          sender_id: string
          stream_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          gift_id: string
          id?: string
          message?: string | null
          recipient_id: string
          sender_id: string
          stream_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          gift_id?: string
          id?: string
          message?: string | null
          recipient_id?: string
          sender_id?: string
          stream_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "gift_transactions_gift_id_fkey"
            columns: ["gift_id"]
            isOneToOne: false
            referencedRelation: "virtual_gifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "gift_transactions_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
        ]
      }
      help_articles: {
        Row: {
          category_id: string | null
          content: string
          created_at: string | null
          id: string
          is_popular: boolean | null
          is_published: boolean | null
          sort_order: number | null
          summary: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          category_id?: string | null
          content: string
          created_at?: string | null
          id?: string
          is_popular?: boolean | null
          is_published?: boolean | null
          sort_order?: number | null
          summary?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          category_id?: string | null
          content?: string
          created_at?: string | null
          id?: string
          is_popular?: boolean | null
          is_published?: boolean | null
          sort_order?: number | null
          summary?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "help_articles_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "help_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      help_categories: {
        Row: {
          article_count: number | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          slug: string
          sort_order: number | null
        }
        Insert: {
          article_count?: number | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          slug: string
          sort_order?: number | null
        }
        Update: {
          article_count?: number | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          slug?: string
          sort_order?: number | null
        }
        Relationships: []
      }
      identity_verifications: {
        Row: {
          address: string | null
          country: string
          created_at: string
          date_of_birth: string
          full_name: string
          id: string
          id_document_url: string | null
          id_type: string
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          selfie_url: string | null
          status: Database["public"]["Enums"]["verification_status"]
          submitted_at: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          country: string
          created_at?: string
          date_of_birth: string
          full_name: string
          id?: string
          id_document_url?: string | null
          id_type: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          selfie_url?: string | null
          status?: Database["public"]["Enums"]["verification_status"]
          submitted_at?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          country?: string
          created_at?: string
          date_of_birth?: string
          full_name?: string
          id?: string
          id_document_url?: string | null
          id_type?: string
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          selfie_url?: string | null
          status?: Database["public"]["Enums"]["verification_status"]
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      job_applications: {
        Row: {
          cover_letter: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          phone: string | null
          position: string
          resume_url: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          cover_letter?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id?: string
          phone?: string | null
          position: string
          resume_url?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          cover_letter?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          position?: string
          resume_url?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      jobs: {
        Row: {
          created_at: string | null
          department: string
          description: string
          id: string
          is_active: boolean | null
          location: string
          requirements: string[] | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          department: string
          description: string
          id?: string
          is_active?: boolean | null
          location: string
          requirements?: string[] | null
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          department?: string
          description?: string
          id?: string
          is_active?: boolean | null
          location?: string
          requirements?: string[] | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          attachments: Json | null
          content: string
          created_at: string
          freelancer_id: string | null
          id: string
          is_read: boolean | null
          is_system_message: boolean | null
          message_type: string | null
          order_id: string | null
          recipient_id: string
          sender_id: string
          subject: string | null
        }
        Insert: {
          attachments?: Json | null
          content: string
          created_at?: string
          freelancer_id?: string | null
          id?: string
          is_read?: boolean | null
          is_system_message?: boolean | null
          message_type?: string | null
          order_id?: string | null
          recipient_id: string
          sender_id: string
          subject?: string | null
        }
        Update: {
          attachments?: Json | null
          content?: string
          created_at?: string
          freelancer_id?: string | null
          id?: string
          is_read?: boolean | null
          is_system_message?: boolean | null
          message_type?: string | null
          order_id?: string | null
          recipient_id?: string
          sender_id?: string
          subject?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_freelancer_id_fkey"
            columns: ["freelancer_id"]
            isOneToOne: false
            referencedRelation: "freelancers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "freelancer_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          link: string | null
          message: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          price: number
          product_id: string
          quantity: number
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          price?: number
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string | null
          id: string
          product_id: string | null
          quantity: number | null
          shipping_address: Json | null
          status: string | null
          stripe_payment_intent_id: string | null
          total_amount: number
          tracking_number: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number | null
          shipping_address?: Json | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          total_amount: number
          tracking_number?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          product_id?: string | null
          quantity?: number | null
          shipping_address?: Json | null
          status?: string | null
          stripe_payment_intent_id?: string | null
          total_amount?: number
          tracking_number?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      press_releases: {
        Row: {
          content: string
          created_at: string | null
          id: string
          image_url: string | null
          is_published: boolean | null
          published_at: string | null
          summary: string | null
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_at?: string | null
          summary?: string | null
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_published?: boolean | null
          published_at?: string | null
          summary?: string | null
          title?: string
        }
        Relationships: []
      }
      pricing_plans: {
        Row: {
          billing_period: string | null
          created_at: string | null
          features: string[] | null
          id: string
          is_active: boolean | null
          is_featured: boolean | null
          name: string
          price: number
          sort_order: number | null
        }
        Insert: {
          billing_period?: string | null
          created_at?: string | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name: string
          price: number
          sort_order?: number | null
        }
        Update: {
          billing_period?: string | null
          created_at?: string | null
          features?: string[] | null
          id?: string
          is_active?: boolean | null
          is_featured?: boolean | null
          name?: string
          price?: number
          sort_order?: number | null
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          name: string
          price: number
          sale_price: number | null
          seller_id: string | null
          stock_quantity: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name: string
          price: number
          sale_price?: number | null
          seller_id?: string | null
          stock_quantity?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          name?: string
          price?: number
          sale_price?: number | null
          seller_id?: string | null
          stock_quantity?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          follower_count: number | null
          following_count: number | null
          id: string
          is_verified: boolean | null
          total_views: number | null
          updated_at: string | null
          user_id: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          follower_count?: number | null
          following_count?: number | null
          id?: string
          is_verified?: boolean | null
          total_views?: number | null
          updated_at?: string | null
          user_id: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          follower_count?: number | null
          following_count?: number | null
          id?: string
          is_verified?: boolean | null
          total_views?: number | null
          updated_at?: string | null
          user_id?: string
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      rate_limits: {
        Row: {
          action: string
          count: number
          created_at: string
          id: string
          user_id: string
          window_start: string
        }
        Insert: {
          action: string
          count?: number
          created_at?: string
          id?: string
          user_id: string
          window_start?: string
        }
        Update: {
          action?: string
          count?: number
          created_at?: string
          id?: string
          user_id?: string
          window_start?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          affiliate_id: string
          commission_rate: number
          converted_at: string | null
          created_at: string
          id: string
          months_active: number | null
          referred_user_id: string
          status: string
          subscription_id: string | null
          total_commission_earned: number | null
        }
        Insert: {
          affiliate_id: string
          commission_rate?: number
          converted_at?: string | null
          created_at?: string
          id?: string
          months_active?: number | null
          referred_user_id: string
          status?: string
          subscription_id?: string | null
          total_commission_earned?: number | null
        }
        Update: {
          affiliate_id?: string
          commission_rate?: number
          converted_at?: string | null
          created_at?: string
          id?: string
          months_active?: number | null
          referred_user_id?: string
          status?: string
          subscription_id?: string | null
          total_commission_earned?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "referrals_affiliate_id_fkey"
            columns: ["affiliate_id"]
            isOneToOne: false
            referencedRelation: "affiliates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      stream_access: {
        Row: {
          amount_paid: number
          created_at: string
          expires_at: string | null
          id: string
          platform_fee: number
          stream_id: string
          streamer_earnings: number
          stripe_payment_intent_id: string | null
          user_id: string
        }
        Insert: {
          amount_paid: number
          created_at?: string
          expires_at?: string | null
          id?: string
          platform_fee: number
          stream_id: string
          streamer_earnings: number
          stripe_payment_intent_id?: string | null
          user_id: string
        }
        Update: {
          amount_paid?: number
          created_at?: string
          expires_at?: string | null
          id?: string
          platform_fee?: number
          stream_id?: string
          streamer_earnings?: number
          stripe_payment_intent_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "stream_access_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: false
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
        ]
      }
      stream_credentials: {
        Row: {
          created_at: string | null
          id: string
          rtmp_url: string
          stream_id: string
          stream_key: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          rtmp_url?: string
          stream_id: string
          stream_key?: string
        }
        Update: {
          created_at?: string | null
          id?: string
          rtmp_url?: string
          stream_id?: string
          stream_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "stream_credentials_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: true
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
        ]
      }
      stream_earnings: {
        Row: {
          access_count: number
          created_at: string
          id: string
          platform_fees: number
          stream_id: string
          streamer_id: string
          total_earnings: number
          updated_at: string
        }
        Insert: {
          access_count?: number
          created_at?: string
          id?: string
          platform_fees?: number
          stream_id: string
          streamer_id: string
          total_earnings?: number
          updated_at?: string
        }
        Update: {
          access_count?: number
          created_at?: string
          id?: string
          platform_fees?: number
          stream_id?: string
          streamer_id?: string
          total_earnings?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "stream_earnings_stream_id_fkey"
            columns: ["stream_id"]
            isOneToOne: true
            referencedRelation: "streams"
            referencedColumns: ["id"]
          },
        ]
      }
      streams: {
        Row: {
          access_price: number | null
          category_id: string | null
          created_at: string | null
          description: string | null
          duration_seconds: number | null
          ended_at: string | null
          hls_url: string | null
          id: string
          is_featured: boolean | null
          is_live: boolean | null
          is_paid: boolean | null
          mux_playback_id: string | null
          mux_stream_id: string | null
          peak_viewers: number | null
          preview_video_url: string | null
          started_at: string | null
          stream_type: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          total_views: number | null
          updated_at: string | null
          user_id: string
          viewer_count: number | null
        }
        Insert: {
          access_price?: number | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          hls_url?: string | null
          id?: string
          is_featured?: boolean | null
          is_live?: boolean | null
          is_paid?: boolean | null
          mux_playback_id?: string | null
          mux_stream_id?: string | null
          peak_viewers?: number | null
          preview_video_url?: string | null
          started_at?: string | null
          stream_type?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          total_views?: number | null
          updated_at?: string | null
          user_id: string
          viewer_count?: number | null
        }
        Update: {
          access_price?: number | null
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          duration_seconds?: number | null
          ended_at?: string | null
          hls_url?: string | null
          id?: string
          is_featured?: boolean | null
          is_live?: boolean | null
          is_paid?: boolean | null
          mux_playback_id?: string | null
          mux_stream_id?: string | null
          peak_viewers?: number | null
          preview_video_url?: string | null
          started_at?: string | null
          stream_type?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          total_views?: number | null
          updated_at?: string | null
          user_id?: string
          viewer_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "streams_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          amount: number | null
          created_at: string | null
          creator_id: string
          expires_at: string | null
          id: string
          is_active: boolean | null
          started_at: string | null
          subscriber_id: string
          tier: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          creator_id: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          started_at?: string | null
          subscriber_id: string
          tier?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          creator_id?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          started_at?: string | null
          subscriber_id?: string
          tier?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      virtual_gifts: {
        Row: {
          animation_url: string | null
          created_at: string | null
          icon: string
          id: string
          is_active: boolean | null
          name: string
          price: number
        }
        Insert: {
          animation_url?: string | null
          created_at?: string | null
          icon: string
          id?: string
          is_active?: boolean | null
          name: string
          price: number
        }
        Update: {
          animation_url?: string | null
          created_at?: string | null
          icon?: string
          id?: string
          is_active?: boolean | null
          name?: string
          price?: number
        }
        Relationships: []
      }
      withdrawal_methods: {
        Row: {
          created_at: string
          details: Json
          id: string
          is_default: boolean | null
          is_verified: boolean | null
          method_type: string
          nickname: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          details: Json
          id?: string
          is_default?: boolean | null
          is_verified?: boolean | null
          method_type: string
          nickname?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          details?: Json
          id?: string
          is_default?: boolean | null
          is_verified?: boolean | null
          method_type?: string
          nickname?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          amount: number
          created_at: string
          fee: number | null
          id: string
          net_amount: number
          notes: string | null
          processed_at: string | null
          processed_by: string | null
          status: Database["public"]["Enums"]["withdrawal_status"]
          transaction_id: string | null
          user_id: string
          withdrawal_method_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          fee?: number | null
          id?: string
          net_amount: number
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: Database["public"]["Enums"]["withdrawal_status"]
          transaction_id?: string | null
          user_id: string
          withdrawal_method_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          fee?: number | null
          id?: string
          net_amount?: number
          notes?: string | null
          processed_at?: string | null
          processed_by?: string | null
          status?: Database["public"]["Enums"]["withdrawal_status"]
          transaction_id?: string | null
          user_id?: string
          withdrawal_method_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "withdrawals_withdrawal_method_id_fkey"
            columns: ["withdrawal_method_id"]
            isOneToOne: false
            referencedRelation: "withdrawal_methods"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      decrement_viewer_count: {
        Args: { stream_id: string }
        Returns: undefined
      }
      generate_referral_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_course_enrollments: {
        Args: { course_id_param: string }
        Returns: undefined
      }
      increment_viewer_count: {
        Args: { stream_id: string }
        Returns: undefined
      }
      is_verified_for_withdrawal: {
        Args: { user_uuid: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user" | "creator"
      verification_status: "pending" | "submitted" | "approved" | "rejected"
      withdrawal_status: "pending" | "processing" | "completed" | "rejected"
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
      app_role: ["admin", "moderator", "user", "creator"],
      verification_status: ["pending", "submitted", "approved", "rejected"],
      withdrawal_status: ["pending", "processing", "completed", "rejected"],
    },
  },
} as const
