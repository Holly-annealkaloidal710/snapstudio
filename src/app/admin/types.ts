export type IndustryType = 'f_b' | 'beauty' | 'fashion' | 'mother_baby' | 'other';
export type CategoryType = 'display' | 'model' | 'social' | 'seeding';
export type SubscriptionPlan = 'free' | 'starter' | 'pro' | 'business' | 'enterprise' | 'admin';
export type OrderStatus = 'pending' | 'completed' | 'failed' | 'rejected';

export interface User {
  id: string;
  email: string | null;
  full_name: string | null;
  subscription_plan: SubscriptionPlan;
  points_balance: number;
  images_generated: number;
  images_limit: number;
  created_at: string;
  updated_at: string;
}

export interface Template {
  id: string;
  category: CategoryType;
  name: string;
  prompt_template: string;
  description: string | null;
  is_active: boolean;
  industry: IndustryType;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  amount: number;
  currency: string;
  item_id: string;
  payment_method: string | null;
  payment_id: string | null;
  created_at: string;
  updated_at: string;
  referred_by_code?: string | null;
  metadata?: {
    plan_name?: string;
    plan_id?: string;
    billing_period?: 'monthly' | 'yearly';
    points?: number;
    price_usd?: number;
  } | null;
  profiles?: {
    email: string | null;
    full_name: string | null;
  } | null;
}

export interface Stats {
  totalUsers: number;
  totalImages: number;
  totalOrders: number;
  pendingOrders: number;
  revenue: number;
  activeTemplates: number;
}

export interface TemplateForm {
  category: CategoryType;
  name: string;
  prompt_template: string;
  description: string;
  industry: IndustryType;
}

export interface SystemMetric {
  name: string;
  value: number;
  status: 'healthy' | 'warning' | 'critical';
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}