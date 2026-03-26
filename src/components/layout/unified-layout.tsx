"use client";

import { usePathname } from "next/navigation";
import { SidebarProvider } from "@/components/sidebar-provider";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSidebar } from "@/components/sidebar-provider";
import dynamic from 'next/dynamic';

// Lazy load sidebars to reduce initial bundle
const DashboardSidebar = dynamic(() => import("@/components/dashboard-sidebar").then(mod => ({ default: mod.DashboardSidebar })), {
  ssr: false
});

const AdminSidebar = dynamic(() => import("@/components/admin/admin-sidebar").then(mod => ({ default: mod.AdminSidebar })), {
  ssr: false
});

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();
  const isMobile = useIsMobile();
  
  const isAdminRoute = pathname.startsWith('/admin');
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isCommunityRoute = pathname.startsWith('/community');
  const isAuthRoute = pathname.startsWith('/auth') || pathname === '/login';
  const isSiteRoute = pathname.startsWith('/(site)') || 
                     pathname === '/' || 
                     pathname.startsWith('/food-beverage') ||
                     pathname.startsWith('/beauty-personal-care') ||
                     pathname.startsWith('/fashion-accessories') ||
                     pathname.startsWith('/mother-baby') ||
                     pathname.startsWith('/features') ||
                     pathname.startsWith('/templates') ||
                     pathname.startsWith('/faq') ||
                     pathname.startsWith('/contact') ||
                     pathname.startsWith('/privacy') ||
                     pathname.startsWith('/terms') ||
                     pathname.startsWith('/blog');

  // Only hide sidebar for auth pages and main site pages
  if (isAuthRoute || isSiteRoute) {
    return <>{children}</>;
  }

  // Show sidebar for dashboard, admin, community, and any other authenticated pages
  const shouldShowSidebar = isDashboardRoute || isAdminRoute || isCommunityRoute || pathname.includes('/dashboard');

  if (!shouldShowSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Render appropriate sidebar */}
      {isAdminRoute ? <AdminSidebar /> : <DashboardSidebar />}
      
      {/* Main content with minimal padding to maximize space */}
      <main className={cn(
        "transition-all duration-300",
        isMobile 
          ? "p-2 pt-16" // Mobile: minimal padding, account for mobile menu
          : "px-4 py-2", // Desktop: horizontal padding 16px, vertical padding 8px
        !isMobile && (isCollapsed ? "ml-20" : "ml-64")
      )}>
        {children}
      </main>
    </div>
  );
}

export function UnifiedLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <LayoutContent>
        {children}
      </LayoutContent>
    </SidebarProvider>
  );
}