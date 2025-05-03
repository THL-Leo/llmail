"use client";

import Link from "next/link";
import { MailIcon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="flex items-center space-x-2">
          <MailIcon className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl">Smart Email</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Button variant="secondary" size="sm" asChild>
            <Link href="/api/env-test">Environment</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}