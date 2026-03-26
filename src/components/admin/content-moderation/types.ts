export interface ModerationItem {
  id: string;
  type: 'image' | 'comment' | 'user_report';
  content_id: string;
  user_id: string;
  content_preview: string;
  image_url?: string;
  ai_score: number;
  ai_flags: string[];
  human_reports: number;
  status: 'pending' | 'approved' | 'rejected' | 'auto_approved';
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  notes?: string;
}

export interface ModerationRule {
  id: string;
  name: string;
  type: 'ai_threshold' | 'keyword_filter' | 'user_behavior';
  criteria: any;
  action: 'auto_approve' | 'auto_reject' | 'flag_for_review';
  is_active: boolean;
  triggered_count: number;
  created_at?: string;
  updated_at?: string;
}

export interface ContentReport {
  id: string;
  reported_content_id: string;
  reported_by: string;
  reason: string;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'dismissed';
  created_at: string;
  resolved_at?: string;
  resolved_by?: string;
  resolution_notes?: string;
}

export interface ModerationStats {
  totalItems: number;
  pendingReview: number;
  autoApproved: number;
  flaggedContent: number;
  activeRules: number;
  avgReviewTime: number;
  autoApprovalRate: number;
  falsePositiveRate: number;
}