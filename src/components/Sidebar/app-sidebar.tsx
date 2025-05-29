'use client';

import { faStar } from '@fortawesome/free-solid-svg-icons';
import { usePathname } from 'next/navigation';
import * as React from 'react';

import { NavProjects } from '@/components/Sidebar/nav-projects';
import { NavSecondary } from '@/components/Sidebar/nav-secondary';
import { NavUser } from '@/components/Sidebar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { navSecondary, projects } from '@/lib/navigation-links';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const data = {
  projects,
  navSecondary,
};
interface User {
  name: string;
  email: string;
  avatar: string;
}
export function AppSidebar({
  user,
  ...props
}: React.ComponentProps<typeof Sidebar> & { user: User }) {
  const pathname = usePathname();
  const activeProject = data.projects.find(
    (project) => project.url === pathname
  );

  return (
    <Sidebar variant="inset" {...props} className="relative">
      {activeProject && (
        <div
          className="fixed left-0 w-0.5 bg-foreground z-50 pointer-events-none transition-all duration-300 rounded-full"
          style={{
            height: '20px',
            top: `${
              88 + data.projects.findIndex((p) => p.url === pathname) * 40
            }px`,
          }}
        />
      )}

      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary flex aspect-square size-8 items-center justify-center rounded-lg">
                  <FontAwesomeIcon icon={faStar} className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user.name?.split(' ')[0] || 'User'}&apos;s tasks
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    Personal
                  </span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
