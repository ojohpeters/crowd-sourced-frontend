"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Menu, X, AlertTriangle, User } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            <span className="text-xl font-bold">EmergencyResponse</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm font-medium ${
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            } transition-colors hover:text-primary`}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`text-sm font-medium ${
              pathname === "/about" ? "text-primary" : "text-muted-foreground"
            } transition-colors hover:text-primary`}
          >
            About
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-medium ${
                  pathname.startsWith("/dashboard") ? "text-primary" : "text-muted-foreground"
                } transition-colors hover:text-primary`}
              >
                Dashboard
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link href="/register">
                <Button>Register</Button>
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container flex flex-col space-y-3 py-4">
            <Link
              href="/"
              className={`px-4 py-2 text-sm font-medium ${
                pathname === "/" ? "text-primary" : "text-muted-foreground"
              } transition-colors hover:text-primary`}
            >
              Home
            </Link>
            <Link
              href="/about"
              className={`px-4 py-2 text-sm font-medium ${
                pathname === "/about" ? "text-primary" : "text-muted-foreground"
              } transition-colors hover:text-primary`}
            >
              About
            </Link>
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`px-4 py-2 text-sm font-medium ${
                    pathname.startsWith("/dashboard") ? "text-primary" : "text-muted-foreground"
                  } transition-colors hover:text-primary`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className={`px-4 py-2 text-sm font-medium ${
                    pathname === "/profile" ? "text-primary" : "text-muted-foreground"
                  } transition-colors hover:text-primary`}
                >
                  Profile
                </Link>
                <Button variant="ghost" onClick={logout} className="justify-start">
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="px-4 py-2">
                  <Button variant="ghost" className="w-full justify-start">
                    Login
                  </Button>
                </Link>
                <Link href="/register" className="px-4 py-2">
                  <Button className="w-full">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

