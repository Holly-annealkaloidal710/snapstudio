"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { createSupabaseBrowserClient } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Bot, 
  Plus, 
  Edit, 
  Trash2,
  Play,
  History,
  Zap
} from 'lucide-react';

const supabase = createSupabaseBrowserClient();

interface AutomationRule {
  id: string;
  name: string;
  trigger: 'order_completed' | 'user_signup' | 'image_generated';
  action: 'grant_points' | 'send_email' | 'change_plan';
  config: any;
  is_active: boolean;
  run_count: number;
  last_run_at: string | null;
}

export function OrderAutomation() {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);

  useEffect(() => {
    // Mock loading rules. In a real app, this would fetch from a DB.
    const mockRules: AutomationRule[] = [
      { id: '1', name: 'Cộng điểm khi mua gói Pro', trigger: 'order_completed', action: 'grant_points', config: { plan_id: 'pro', points: 1000 }, is_active: true, run_count: 152, last_run_at: new Date().toISOString() },
      { id: '2', name: 'Email chào mừng user mới', trigger: 'user_signup', action: 'send_email', config: { template_id: 'welcome_email' }, is_active: true, run_count: 1230, last_run_at: new Date().toISOString() },
      { id: '3', name: 'Nâng cấp plan khi mua gói Enterprise', trigger: 'order_completed', action: 'change_plan', config: { plan_id: 'enterprise', new_plan: 'enterprise' }, is_active: false, run_count: 12, last_run_at: null },
    ];
    setRules(mockRules);
    setLoading(false);
  }, []);

  const handleSaveRule = () => {
    // In a real app, this would save to the database
    if (editingRule) {
      setRules(rules.map(r => r.id === editingRule.id ? editingRule : r));
      toast.success('Đã cập nhật rule');
    } else {
      // Create new rule logic
      toast.success('Đã tạo rule mới');
    }
    setIsDialogOpen(false);
    setEditingRule(null);
  };

  const openEditDialog = (rule: AutomationRule) => {
    setEditingRule(rule);
    setIsDialogOpen(true);
  };

  const openNewDialog = () => {
    setEditingRule(null); // Create a blank form
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Tự động hóa (Automation)</CardTitle>
        <Button onClick={openNewDialog}>
          <Plus className="w-4 h-4 mr-2" />
          Tạo Rule mới
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <div className="space-y-4">
            {rules.map(rule => (
              <div key={rule.id} className="border p-4 rounded-lg flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{rule.name}</h4>
                    <Badge variant={rule.is_active ? 'default' : 'secondary'}>
                      {rule.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    Trigger: <span className="font-mono text-xs bg-gray-100 p-1 rounded">{rule.trigger}</span> → 
                    Action: <span className="font-mono text-xs bg-gray-100 p-1 rounded">{rule.action}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Đã chạy: {rule.run_count} lần. Lần cuối: {rule.last_run_at ? new Date(rule.last_run_at).toLocaleString('vi-VN') : 'Chưa chạy'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => openEditDialog(rule)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingRule ? 'Chỉnh sửa Rule' : 'Tạo Rule mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium mb-1">Tên Rule</label>
              <Input placeholder="VD: Cộng điểm cho user mới" defaultValue={editingRule?.name} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Trigger (Khi)</label>
                <Select defaultValue={editingRule?.trigger}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="order_completed">Đơn hàng hoàn thành</SelectItem>
                    <SelectItem value="user_signup">User đăng ký</SelectItem>
                    <SelectItem value="image_generated">Ảnh được tạo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Action (Thì)</label>
                <Select defaultValue={editingRule?.action}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grant_points">Cộng điểm</SelectItem>
                    <SelectItem value="send_email">Gửi email</SelectItem>
                    <SelectItem value="change_plan">Đổi gói cước</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Cấu hình (JSON)</label>
              <Textarea 
                placeholder='{ "plan_id": "pro", "points": 1000 }' 
                defaultValue={JSON.stringify(editingRule?.config, null, 2)}
                rows={4}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="is-active" defaultChecked={editingRule?.is_active ?? true} />
              <label htmlFor="is-active">Kích hoạt</label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Hủy</Button>
            <Button onClick={handleSaveRule}>Lưu</Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}