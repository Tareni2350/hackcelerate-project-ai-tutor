
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar'; 
import { LayoutDashboard, Brain, Volume2, Lightbulb, Archive, Camera, FileText, History, type Icon } from 'lucide-react';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/rag-tutoring', label: 'RAG Tutor', icon: Brain },
  { href: '/voice-tutoring', label: 'Voice Tutor', icon: Volume2 },
  { href: '/quiz-generator', label: 'Quiz Generator', icon: Lightbulb },
  { href: '/photo-solver', label: 'Photo Solver', icon: Camera },
  { href: '/essay-checker', label: 'Essay Checker', icon: FileText },
  { href: '/history', label: 'History', icon: History },
  { href: '/offline-cache', label: 'Offline Cache', icon: Archive },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar(); 

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false); 
    }
  };

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
                onClick={handleLinkClick} 
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
