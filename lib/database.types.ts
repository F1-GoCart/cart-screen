export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      product_details: {
        Row: {
          aisle: string | null
          category: string | null
          created_at: string
          id: number
          image: string | null
          is_sale: boolean | null
          name: string | null
          price: number | null
          promo_price: number | null
          size: string | null
          stock: number | null
        }
        Insert: {
          aisle?: string | null
          category?: string | null
          created_at?: string
          id?: number
          image?: string | null
          is_sale?: boolean | null
          name?: string | null
          price?: number | null
          promo_price?: number | null
          size?: string | null
          stock?: number | null
        }
        Update: {
          aisle?: string | null
          category?: string | null
          created_at?: string
          id?: number
          image?: string | null
          is_sale?: boolean | null
          name?: string | null
          price?: number | null
          promo_price?: number | null
          size?: string | null
          stock?: number | null
        }
        Relationships: []
      }
      purchase_history: {
        Row: {
          billing: Json | null
          cart_id: number | null
          change: number | null
          created_at: string
          datetime: string | null
          id: string
          mode_of_payment: string | null
          purchased_items: Json | null
          total_price: number | null
          user_id: string | null
        }
        Insert: {
          billing?: Json | null
          cart_id?: number | null
          change?: number | null
          created_at?: string
          datetime?: string | null
          id: string
          mode_of_payment?: string | null
          purchased_items?: Json | null
          total_price?: number | null
          user_id?: string | null
        }
        Update: {
          billing?: Json | null
          cart_id?: number | null
          change?: number | null
          created_at?: string
          datetime?: string | null
          id?: string
          mode_of_payment?: string | null
          purchased_items?: Json | null
          total_price?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_history_cart_id_fkey"
            columns: ["cart_id"]
            isOneToOne: false
            referencedRelation: "shopping_carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      scanned_items: {
        Row: {
          id: number
          item_id: number | null
          status: boolean | null
        }
        Insert: {
          id?: number
          item_id?: number | null
          status?: boolean | null
        }
        Update: {
          id?: number
          item_id?: number | null
          status?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "scanned_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "product_details"
            referencedColumns: ["id"]
          },
        ]
      }
      shopping_carts: {
        Row: {
          cart_id: string | null
          id: number
          status: string | null
        }
        Insert: {
          cart_id?: string | null
          id?: number
          status?: string | null
        }
        Update: {
          cart_id?: string | null
          id?: number
          status?: string | null
        }
        Relationships: []
      }
      shopping_list: {
        Row: {
          created_at: string
          id: number
          is_deleted: boolean | null
          item_id: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_deleted?: boolean | null
          item_id?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_deleted?: boolean | null
          item_id?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "shopping_list_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "product_details"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shopping_list_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string
        }
        Insert: {
          avatar_url?: string | null
          created_at: string
          email: string
          id: string
          name: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
