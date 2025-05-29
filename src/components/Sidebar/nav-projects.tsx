'use client';

import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function NavProjects({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: IconProp;
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden overflow-visible">
      <SidebarMenu className="overflow-visible">
        {projects.map((item) => (
          <SidebarMenuItem
            key={item.name}
            className="relative overflow-visible"
          >
            <SidebarMenuButton asChild>
              <Link
                href={item.url}
                className={cn(
                  'group/menu-item flex h-full items-center gap-3 p-2'
                )}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  className={cn(
                    'text-muted-foreground group-hover/menu-item:text-foreground p-0.5',
                    pathname === item.url && 'text-foreground'
                  )}
                />
                <span className="font-medium">{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
