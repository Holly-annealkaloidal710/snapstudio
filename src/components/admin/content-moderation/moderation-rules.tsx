"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { 
  Shield, 
  Settings, 
  Plus,
  Edit,
  Trash2,
  Zap
} from 'lucide-react';

interface ModerationRule {
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

interface ModerationRulesProps {
  rules: ModerationRule[];
  onToggleRule: (ruleId: string, isActive: boolean) => void;
  onCreateRule: (rule: Partial<ModerationRule>) => void;
  onUpdateRule: (ruleId: string, updates: Partial<ModerationRule>) => void;
  onDeleteRule: (ruleId: string) => void;
}

export function ModerationRules({
  rules,
  onToggleRule,
  onCreateRule,
  onUpdateRule,
  onDeleteRule
}: ModerationRulesProps) {
  const [newRuleDialog, setNewRuleDialog] = useState(false);
  const [editingRule, setEditingRule] = useState<ModerationRule | null>(null);
  const [ruleForm, setRuleForm] = useState({
    name: '',
    description: '',
    type: 'ai_threshold' as 'ai_threshold' | 'keyword_filter' | 'user_behavior',
    action: 'flag_for_review' as 'auto_approve' | 'auto_reject' | 'flag_for_review',
    criteria: '',
    is_active: true
  });

  const handleCreateRule = () => {
    if (!ruleForm.name.trim()) {
      return;
    }

    const newRule: Partial<ModerationRule> = {
      name: ruleForm.name,
      type: ruleForm.type,
      action: ruleForm.action,
      criteria: JSON.parse(ruleForm.criteria || '{}'),
      is_active: ruleForm.is_active,
      triggered_count: 0
    };

    onCreateRule(newRule);
    setNewRuleDialog(false);
    resetForm();
  };

  const resetForm = () => {
    setRuleForm({
      name: '',
      description: '',
      type: 'ai_threshold',
      action: 'flag_for_review',
      criteria: '',
      is_active: true
    });
    setEditingRule(null);
  };

  const startEdit = (rule: ModerationRule) => {
    setEditingRule(rule);
    setRuleForm({
      name: rule.name,
      description: '',
      type: rule.type,
      action: rule.action,
      criteria: JSON.stringify(rule.criteria, null, 2),
      is_active: rule.is_active
    });
    setNewRuleDialog(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900">Automated Moderation Rules</h3>
            <p className="text-gray-600">Configure AI-powered content screening rules</p>
          </div>
          <Button onClick={() => setNewRuleDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Rule
          </Button>
        </div>

        {/* Rules List */}
        <div className="space-y-4">
          {rules.map((rule) => (
            <Card key={rule.id} className="border-l-4 border-blue-500">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">{rule.name}</h4>
                      <Badge className={rule.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {rule.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge variant="outline">
                        {rule.triggered_count} triggers
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Type:</span> {rule.type}
                      </div>
                      <div>
                        <span className="font-medium">Action:</span> {rule.action}
                      </div>
                      <div>
                        <span className="font-medium">Criteria:</span> {JSON.stringify(rule.criteria)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.is_active}
                      onCheckedChange={() => onToggleRule(rule.id, rule.is_active)}
                    />
                    <Button size="sm" variant="outline" onClick={() => startEdit(rule)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onDeleteRule(rule.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Create/Edit Rule Dialog */}
      <Dialog open={newRuleDialog} onOpenChange={(open) => {
        setNewRuleDialog(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-blue-600" />
              {editingRule ? 'Edit Rule' : 'Create New Rule'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div>
              <Label htmlFor="rule-name">Rule Name *</Label>
              <Input
                id="rule-name"
                value={ruleForm.name}
                onChange={(e) => setRuleForm({...ruleForm, name: e.target.value})}
                placeholder="e.g., AI Content Filter"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rule-type">Rule Type</Label>
                <Select value={ruleForm.type} onValueChange={(value: any) => setRuleForm({...ruleForm, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ai_threshold">AI Threshold</SelectItem>
                    <SelectItem value="keyword_filter">Keyword Filter</SelectItem>
                    <SelectItem value="user_behavior">User Behavior</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="rule-action">Action</Label>
                <Select value={ruleForm.action} onValueChange={(value: any) => setRuleForm({...ruleForm, action: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto_approve">Auto Approve</SelectItem>
                    <SelectItem value="auto_reject">Auto Reject</SelectItem>
                    <SelectItem value="flag_for_review">Flag for Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="rule-criteria">Criteria (JSON)</Label>
              <Textarea
                id="rule-criteria"
                value={ruleForm.criteria}
                onChange={(e) => setRuleForm({...ruleForm, criteria: e.target.value})}
                placeholder='{"ai_score": {"gte": 80}}'
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                Define the conditions that trigger this rule in JSON format
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="rule-active">Rule Status</Label>
                <p className="text-sm text-gray-600">Enable this rule immediately</p>
              </div>
              <Switch
                id="rule-active"
                checked={ruleForm.is_active}
                onCheckedChange={(checked) => setRuleForm({...ruleForm, is_active: checked})}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setNewRuleDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleCreateRule} className="flex-1">
                <Zap className="w-4 h-4 mr-2" />
                {editingRule ? 'Update Rule' : 'Create Rule'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}