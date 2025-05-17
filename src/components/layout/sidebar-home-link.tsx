"use client";
import Link from 'next/link';
import { BookOpenText } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';

export function SidebarHomeLink() {
  const { isMobile, setOpenMobile } = useSidebar();

  const handleClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Link
      href="/"
      onClick={handleClick}
      className="flex items-center gap-2 text-lg font-semibold text-[hsl(210,100%,65%)] dark:text-[hsl(200,90%,75%)]" // Bright Blue for "AI Tutor" text
    >
      <BookOpenText className="h-7 w-7 text-[hsl(355,79%,60%)] dark:text-[hsl(350,80%,70%)]" /> {/* Bright Red for icon */}
      <span className="group-data-[collapsible=icon]:hidden">AI Tutor</span>
    </Link>
  );
}
