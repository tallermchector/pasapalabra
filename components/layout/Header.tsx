'use client'

import Link from 'next/link'
import { Icons } from '@/components/icons'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Icons.crown className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">Rosco</span>
        </Link>

        <nav className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/">
              <Icons.home className="h-4 w-4 mr-2" />
              Inicio
            </Link>
          </Button>
          
          <Button variant="ghost" asChild>
            <Link href="/admin/generator">
              <Icons.settings className="h-4 w-4 mr-2" />
              Admin
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}