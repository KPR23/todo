'use client';

import { AppSidebar } from '@/components/Sidebar/app-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { useUser } from '@clerk/nextjs';
import { Separator } from '../ui/separator';
import { SidebarProvider } from '../ui/sidebar';
import { usePathname } from 'next/navigation';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useUser();
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {user && (
          <AppSidebar
            user={{
              name: user.fullName || 'Username',
              email: user.primaryEmailAddress?.emailAddress || 'E-mail address',
              avatar: user.imageUrl || 'https://github.com/shadcn.png',
            }}
          />
        )}
        <div className="flex flex-col flex-1 p-2 pt-0">
          <header className="flex h-16 shrink-0 items-center gap-2 p-4">
            {user && <SidebarTrigger className="-ml-1 cursor-pointer" />}
            {user && <Separator orientation="vertical" className="mr-2 h-4" />}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href={pathname}>
                    {(pathname.split('/').pop()?.replace(/-/g, ' ') || 'Home')
                      .charAt(0)
                      .toUpperCase() +
                      (
                        pathname.split('/').pop()?.replace(/-/g, ' ') || 'Home'
                      ).slice(1)}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage></BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          <div className="flex-1 rounded-2xl bg-muted/40 overflow-auto border border-sidebar-border">
            <SidebarInset className="h-full w-full p-4">
              {children}
            </SidebarInset>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
