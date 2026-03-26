"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const supabase = createSupabaseBrowserClient();

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onProjectCreated: (project: { id: string }) => void;
}

export function NewProjectDialog({
  open,
  onOpenChange,
  onProjectCreated,
}: NewProjectDialogProps) {
  const { user } = useAuth();
  const [projectName, setProjectName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateProject = async () => {
    if (!projectName.trim() || !user) {
      toast.error("Vui lòng nhập tên dự án");
      return;
    }

    setIsCreating(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .insert({
          user_id: user.id,
          name: projectName.trim(),
          status: "draft",
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Đã tạo dự án mới!");
      onProjectCreated(data);
      onOpenChange(false);
      setProjectName("");
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Lỗi khi tạo dự án");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo dự án mới</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Label htmlFor="project-name">Tên dự án</Label>
          <Input
            id="project-name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="VD: Bộ ảnh Tết 2025"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Hủy</Button>
          </DialogClose>
          <Button onClick={handleCreateProject} disabled={isCreating}>
            {isCreating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Tạo dự án
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}