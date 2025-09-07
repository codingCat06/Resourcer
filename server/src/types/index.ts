import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    isAdmin: boolean;
    is_admin: boolean;
  };
}

export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  subscription_type: 'free' | 'pro';
  total_earnings: number;
  is_admin: boolean;
  is_active: boolean;
  created_at: Date;
  last_login?: Date;
}

export interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  resource_type: string;
  category: string;
  tags: string;
  target_url: string;
  status: 'draft' | 'published' | 'archived';
  click_count: number;
  total_earnings: number;
  created_at: Date;
  updated_at: Date;
}
