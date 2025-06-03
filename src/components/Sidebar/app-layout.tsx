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
import {
  SidebarInset,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { api } from '../../../convex/_generated/api';
import { Doc } from '../../../convex/_generated/dataModel';
import { Input } from '../ui/input';
import { Separator } from '../ui/separator';
import { SidebarProvider } from '../ui/sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const user = useQuery(api.users.getCurrentUser);
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <AppLayoutContent user={user as Doc<'users'>} pathname={pathname}>
        {children}
      </AppLayoutContent>
    </SidebarProvider>
  );
}

function AppLayoutContent({
  children,
  user,
  pathname,
}: {
  children: React.ReactNode;
  user: Doc<'users'>;
  pathname: string;
}) {
  const { state } = useSidebar();
  const { user: clerkUser } = useUser();
  const imageUrl = clerkUser?.imageUrl;
  return (
    <div className="flex min-h-screen w-full">
      {user && (
        <AppSidebar
          user={{
            name: user.name || 'Username',
            email: user.email || 'E-mail address',
            avatar: imageUrl || 'https://github.com/shadcn.png',
          }}
        />
      )}

      <div
        className={`flex flex-col flex-1 p-2 pt-0 ${
          state === 'expanded' ? 'pl-0' : ''
        }`}
      >
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
          <div className="flex items-center relative ml-12 ">
            <Input
              type="text"
              placeholder="Search"
              className="w-[500px] pl-9"
            />
            <Search className="ml-2 size-4.5 absolute left-1 text-muted-foreground" />
          </div>
        </header>

        <div className="flex-1 rounded-2xl bg-muted/40 overflow-auto border border-sidebar-border">
          <SidebarInset className="h-full w-full p-4">{children}</SidebarInset>
        </div>
      </div>
    </div>
  );
}
