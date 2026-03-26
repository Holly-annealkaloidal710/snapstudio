"use client";

import { useState, useEffect } from 'react';
import { UsersTab } from '@/app/admin/components/UsersTab';
import { createSupabaseBrowserClient } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { User } from '../types';

const supabase = createSupabaseBrowserClient();

export default function UsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers((data as User[]) || []);
    } catch (error) {
      toast.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Người dùng</h1>
        <p className="text-gray-600">Xem và quản lý thông tin, gói cước và điểm của người dùng.</p>
      </div>
      
      {loading ? (
        <p>Đang tải người dùng...</p>
      ) : (
        <UsersTab users={users} onDataChange={loadUsers} />
      )}
    </div>
  );
}