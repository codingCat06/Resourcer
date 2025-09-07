export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  is_admin: boolean;
  subscription_type: 'free' | 'pro';
  total_earnings: number;
  created_at: string;
}

export interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  summary?: string;
  tags: string[];
  apis_modules: string[];
  work_environment: string[];
  status: 'draft' | 'published' | 'archived';
  click_count: number;
  total_earnings: number;
  created_at: string;
  updated_at: string;
}

export interface SearchQuery {
  query: string;
  workEnvironment: string[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}