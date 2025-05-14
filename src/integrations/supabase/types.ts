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
      products: {
        Row: {
          id: string
          name: string
          code: string
          price: number
          stock: number
          tenant_id: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          code: string
          price: number
          stock: number
          tenant_id: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string
          price?: number
          stock?: number
          tenant_id?: string
          created_at?: string
        }
      }
    }
  }
}