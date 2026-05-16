import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Moon, Sun, Globe } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";
import { useLanguage } from "@/lib/language-provider";
import { Button } from "@/components/ui/button";
import logoUrl from "@assets/logo.jpg";

export function Navbar() {
  const [location] = useLocation();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

const links = [
     { href: "/", label: t.nav.home },
     { href: "/about", label: t.nav.about },
     { href: "/departments", label: t.nav.departments },
     { href: "/programs", label: t.nav.programs },
     { href: "/events", label: t.nav.events },
     { href: "/posts", label: t.nav.posts },
     { href: "/youth", label: t.nav.youth },
     { href: "/support", label: t.nav.support },
     { href: "/join", label: t.nav.join },
     { href: "/contact", label: t.nav.contact },
     { href: "/ey-register" },
     { href: "/reports", label: t.nav.reports },
   ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img
            src={logoUrl}
            alt="NTPC Logo"
            className="h-10 w-10 rounded-full object-cover"
          />
          <span className="font-serif font-bold text-lg hidden sm:block text-primary">
            NTPC
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location === link.href
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLanguage(language === "en" ? "am" : "en")}
            title="Toggle Language"
          >
            <Globe className="h-4 w-4" />
            <span className="sr-only">Toggle language</span>
            <span className="absolute -bottom-4 text-[10px] font-bold">
              {language === "en" ? "EN" : "አማ"}
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden border-b bg-background px-4 py-4 space-y-4">
          <nav className="flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-medium ${
                  location === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
