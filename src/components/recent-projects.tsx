"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Image as ImgIcon, Loader2, Plus, Wand2, AlertCircle } from "lucide-react";
import { NewProjectDialog } from "./new-project-dialog";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  name: string;
  created_at: string;
  image_count: number;
  thumbnail_url: string | null;
}

export function RecentProjects() {
  const { user, supabase, loading: authLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasAttempted, setHasAttempted] = useState(false);

  const fetchProjects = useCallback(async () => {
    if (!user || hasAttempted) {
      setLoading(false);
      return;
    }

    setHasAttempted(true);
    setLoading(true);
    setError(null);
    
    try {
      // Simple direct query without complex auth checks
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, name, created_at, updated_at')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(5);

      if (projectsError) {
        console.error("Error fetching projects:", projectsError);
        setError("Không thể tải dự án");
        setProjects([]);
        return;
      }

      if (!projectsData || projectsData.length === 0) {
        setProjects([]);
        return;
      }

      // Process projects data without complex async operations
      const projectsWithBasicData = projectsData.map((project: any) => ({
        id: project.id,
        name: project.name,
        created_at: project.created_at,
        image_count: 0, // Will be loaded separately if needed
        thumbnail_url: null // Will be loaded separately if needed
      }));

      setProjects(projectsWithBasicData);

    } catch (error) {
      console.error("Exception in fetchProjects:", error);
      setError("Lỗi không xác định");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, [user, supabase, hasAttempted]);

  useEffect(() => {
    if (!authLoading && user && !hasAttempted) {
      fetchProjects();
    } else if (!authLoading && !user) {
      setLoading(false);
      setProjects([]);
    }
  }, [authLoading, user, fetchProjects, hasAttempted]);

  const handleProjectCreated = (project: { id: string }) => {
    router.push(`/dashboard?projectId=${project.id}`);
  };

  const handleRetry = () => {
    setHasAttempted(false);
    setError(null);
  };

  if (authLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dự án gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
            <p className="text-sm text-gray-500 mt-2">Đang xác thực...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dự án gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-500">Vui lòng đăng nhập để xem dự án</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Dự án gần đây</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/projects">
              Xem tất cả <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-4">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-blue-600" />
              <p className="text-sm text-gray-500 mt-2">Đang tải dự án...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8 border-2 border-dashed border-red-200 rounded-lg bg-red-50">
              <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />
              <h3 className="font-semibold text-red-800 mb-2">Lỗi tải dự án</h3>
              <p className="text-sm text-red-600 mb-4">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" size="sm" onClick={handleRetry}>
                  Thử lại
                </Button>
                <Button size="sm" onClick={() => router.push('/dashboard/projects')}>
                  Xem tất cả dự án
                </Button>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
              <Wand2 className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <h3 className="font-semibold text-gray-800 mb-2">Bắt đầu dự án đầu tiên của bạn</h3>
              <p className="text-sm text-gray-500 mb-4">Tạo bộ ảnh marketing hoàn chỉnh chỉ trong vài giây.</p>
              <Button onClick={() => router.push('/dashboard')}>
                <Plus className="w-4 h-4 mr-2" />
                Tạo dự án mới
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => (
                <Link key={project.id} href={`/dashboard?projectId=${project.id}`}>
                  <div className="flex items-center p-3 -m-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4 overflow-hidden">
                      <ImgIcon className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">{project.name}</p>
                      <p className="text-sm text-gray-500">{project.image_count} ảnh</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <NewProjectDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onProjectCreated={handleProjectCreated}
      />
    </>
  );
}