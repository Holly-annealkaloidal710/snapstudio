"use client";

import { useState, useEffect } from 'react';
import { TemplatesTab } from '@/app/admin/components/TemplatesTab';
import { createSupabaseBrowserClient } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { Template } from '../types';

const supabase = createSupabaseBrowserClient();

export default function TemplatesPage() {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState<Template[]>([]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('prompt_templates')
        .select('*')
        .order('category', { ascending: true })
        .order('name', { ascending: true });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      toast.error('Lỗi khi tải templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Prompt Templates</h1>
        <p className="text-gray-600">Tạo, chỉnh sửa và quản lý các prompt template cho việc tạo ảnh.</p>
      </div>
      
      {loading ? (
        <p>Đang tải templates...</p>
      ) : (
        <TemplatesTab templates={templates} onDataChange={loadTemplates} />
      )}
    </div>
  );
}