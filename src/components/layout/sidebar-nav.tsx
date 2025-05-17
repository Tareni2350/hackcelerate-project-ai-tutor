"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { LayoutDashboard, Brain, Volume2, Lightbulb, Archive, Icon } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/rag-tutoring', label: 'RAG Tutor', icon: Brain },
  { href: '/voice-tutoring', label: 'Voice Tutor', icon: Volume2 },
  { href: '/quiz-generator', label: 'Quiz Generator', icon: Lightbulb },
  { href: '/offline-cache', label: 'Offline Cache', icon: Archive },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => {
        const IconComponent = item.icon as Icon;
        return (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} legacyBehavior passHref>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label, className: "bg-card text-card-foreground border-border shadow-sm" }}
              >
                <a>
                  <IconComponent className="h-5 w-5" />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );
}
