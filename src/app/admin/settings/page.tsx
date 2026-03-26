"use client";

import { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { 
  Settings, 
  Save, 
  Database, 
  Zap, 
  CreditCard, 
  Mail,
  Shield,
  Globe,
  Palette,
  Bell
} from 'lucide-react';

interface SystemSettings {
  // AI Configuration
  aiModel: string;
  batchCostPoints: number;
  soloCostPoints: number;
  
  // Payment Configuration
  usdVndRate: number;
  processingFeePercent: number;
  
  // System Configuration
  maxImagesPerUser: number;
  maxProjectsPerUser: number;
  enableCommunity: boolean;
  enableNotifications: boolean;
  
  // Email Configuration
  smtpHost: string;
  smtpPort: number;
  smtpUser: string;
  
  // Security
  enableRateLimit: boolean;
  maxRequestsPerMinute: number;
  enableImageModeration: boolean;
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<SystemSettings>({
    aiModel: 'gemini-2.5-flash',
    batchCostPoints: 120,
    soloCostPoints: 30,
    usdVndRate: 26400,
    processingFeePercent: 3,
    maxImagesPerUser: 1000,
    maxProjectsPerUser: 100,
    enableCommunity: true,
    enableNotifications: true,
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    enableRateLimit: true,
    maxRequestsPerMinute: 60,
    enableImageModeration: false
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // In a real app, you would save these to a settings table
      // For now, just show success message
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Cài đặt đã được lưu thành công!');
    } catch (error) {
      toast.error('Lỗi khi lưu cài đặt');
    } finally {
      setLoading(false);
    }
  };

  const resetToDefaults = () => {
    if (!confirm('Bạn có chắc muốn khôi phục cài đặt mặc định?')) return;
    
    setSettings({
      aiModel: 'gemini-2.5-flash',
      batchCostPoints: 120,
      soloCostPoints: 30,
      usdVndRate: 26400,
      processingFeePercent: 3,
      maxImagesPerUser: 1000,
      maxProjectsPerUser: 100,
      enableCommunity: true,
      enableNotifications: true,
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      enableRateLimit: true,
      maxRequestsPerMinute: 60,
      enableImageModeration: false
    });
    
    toast.success('Đã khôi phục cài đặt mặc định');
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <AdminSidebar />
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Cài đặt Hệ thống</h1>
            <p className="text-gray-600">Cấu hình các thông số và tùy chọn hệ thống.</p>
          </div>

          <div className="space-y-8">
            {/* AI Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Zap className="w-5 h-5" />
                  Cấu hình AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Model AI</label>
                    <Select 
                      value={settings.aiModel} 
                      onValueChange={(value) => setSettings({...settings, aiModel: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gemini-2.5-flash">Gemini 2.5 Flash</SelectItem>
                        <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
                        <SelectItem value="gemini-ultra">Gemini Ultra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Batch Cost (điểm)</label>
                    <Input
                      type="number"
                      value={settings.batchCostPoints}
                      onChange={(e) => setSettings({...settings, batchCostPoints: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Solo Cost (điểm)</label>
                    <Input
                      type="number"
                      value={settings.soloCostPoints}
                      onChange={(e) => setSettings({...settings, soloCostPoints: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5" />
                  Cấu hình Thanh toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tỷ giá USD/VND</label>
                    <Input
                      type="number"
                      value={settings.usdVndRate}
                      onChange={(e) => setSettings({...settings, usdVndRate: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Phí xử lý (%)</label>
                    <Input
                      type="number"
                      value={settings.processingFeePercent}
                      onChange={(e) => setSettings({...settings, processingFeePercent: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Limits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Database className="w-5 h-5" />
                  Giới hạn Hệ thống
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Max ảnh/người dùng</label>
                    <Input
                      type="number"
                      value={settings.maxImagesPerUser}
                      onChange={(e) => setSettings({...settings, maxImagesPerUser: parseInt(e.target.value) || 0})}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Max dự án/người dùng</label>
                    <Input
                      type="number"
                      value={settings.maxProjectsPerUser}
                      onChange={(e) => setSettings({...settings, maxProjectsPerUser: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Toggles */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  Tính năng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Cộng đồng</h4>
                      <p className="text-sm text-gray-600">Cho phép người dùng chia sẻ và xem ảnh công khai</p>
                    </div>
                    <Switch
                      checked={settings.enableCommunity}
                      onCheckedChange={(checked) => setSettings({...settings, enableCommunity: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Thông báo</h4>
                      <p className="text-sm text-gray-600">Gửi thông báo email cho người dùng</p>
                    </div>
                    <Switch
                      checked={settings.enableNotifications}
                      onCheckedChange={(checked) => setSettings({...settings, enableNotifications: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Rate Limiting</h4>
                      <p className="text-sm text-gray-600">Giới hạn số request để bảo vệ hệ thống</p>
                    </div>
                    <Switch
                      checked={settings.enableRateLimit}
                      onCheckedChange={(checked) => setSettings({...settings, enableRateLimit: checked})}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Kiểm duyệt ảnh</h4>
                      <p className="text-sm text-gray-600">Tự động kiểm tra nội dung ảnh</p>
                    </div>
                    <Switch
                      checked={settings.enableImageModeration}
                      onCheckedChange={(checked) => setSettings({...settings, enableImageModeration: checked})}
                    />
                  </div>
                </div>

                {settings.enableRateLimit && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Max requests/phút</label>
                    <Input
                      type="number"
                      value={settings.maxRequestsPerMinute}
                      onChange={(e) => setSettings({...settings, maxRequestsPerMinute: parseInt(e.target.value) || 0})}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Email Configuration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  Cấu hình Email
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">SMTP Host</label>
                    <Input
                      value={settings.smtpHost}
                      onChange={(e) => setSettings({...settings, smtpHost: e.target.value})}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">SMTP Port</label>
                    <Input
                      type="number"
                      value={settings.smtpPort}
                      onChange={(e) => setSettings({...settings, smtpPort: parseInt(e.target.value) || 587})}
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">SMTP User</label>
                    <Input
                      value={settings.smtpUser}
                      onChange={(e) => setSettings({...settings, smtpUser: e.target.value})}
                      placeholder="noreply@snapstudio.app"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Actions */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Lưu cài đặt</h3>
                    <p className="text-sm text-gray-600">Các thay đổi sẽ có hiệu lực ngay lập tức</p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={resetToDefaults}>
                      Khôi phục mặc định
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? 'Đang lưu...' : 'Lưu cài đặt'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}