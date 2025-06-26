import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-6 lg:space-x-8">
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Home
      </Link>
      <Link
        href="/experiences"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/experiences" ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Experiences
      </Link>
      <Link
        href="/race"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/race" ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Race
      </Link>
      <Link
        href="/about"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/about" ? "text-foreground" : "text-muted-foreground"
        )}
      >
        About
      </Link>
      <Link
        href="/contact"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/contact" ? "text-foreground" : "text-muted-foreground"
        )}
      >
        Contact
      </Link>
    </nav>
  )
} 