
import { User } from '@supabase/supabase-js';

export interface AuthUser extends User {
  role?: string;
  full_name?: string;
}

export type ProfileData = {
  full_name: string;
  role?: string;
};

export type RegisterData = {
  email: string;
  password: string;
  full_name: string;
};
