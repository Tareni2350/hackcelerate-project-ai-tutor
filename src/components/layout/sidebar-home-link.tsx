
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
      className="flex items-center gap-2 text-lg font-semibold text-accent" // Use theme's accent color for text
    >
      <BookOpenText className="h-7 w-7 text-accent" /> {/* Use theme's accent color for icon */}
      <span className="group-data-[collapsible=icon]:hidden">AI Tutor</span>
    </Link>
  );
}
