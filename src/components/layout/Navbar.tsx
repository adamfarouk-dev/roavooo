import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu,
  X,
  Search,
  LogOut,
  User,
  Briefcase,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();
  const { lang, setLang, t } = useLanguage();
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error);
      return;
    }

    setUser(null);
    setIsOpen(false);
    window.location.href = "/";
  };

  const navLinks = [
    { name: t.nav.home, path: "/" },
    { name: t.nav.cities, path: "/search?category=all" },
    { name: "Trips", path: "/trips" },
    { name: t.nav.favorites, path: "/favorites" },
    { name: t.nav.search, path: "/search" },
  ];

  const isLinkActive = (path: string) => {
    if (path === "/trips") {
      return location === "/trips" || location.startsWith("/trips/");
    }

    if (path === "/profile") {
      return location === "/profile";
    }

    return location === path;
  };

  const displayName = user?.user_metadata?.username || user?.email || "Account";

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center shrink-0">
            <img
              src="/ROAVOOO_WHITE.png"
              alt="Roavooo"
              className="h-20 md:h-24 w-auto object-contain"
              draggable={false}
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isLinkActive(link.path) ? "text-primary" : "text-foreground/80"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="flex items-center rounded-full border border-border overflow-hidden text-xs font-semibold">
              <button
                onClick={() => setLang("en")}
                className={`px-3 py-1.5 transition-colors ${
                  lang === "en"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("fr")}
                className={`px-3 py-1.5 transition-colors ${
                  lang === "fr"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                FR
              </button>
            </div>

            {!user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Sign up
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="hidden lg:flex items-center gap-2 text-sm text-foreground/80 hover:text-primary transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[180px] truncate">{displayName}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-primary hover:border-primary transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}

            <Link
              href="/search"
              className="p-2 rounded-full hover:bg-muted text-foreground/80 transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-3">
            <div className="flex items-center rounded-full border border-border overflow-hidden text-xs font-semibold">
              <button
                onClick={() => setLang("en")}
                className={`px-2.5 py-1 transition-colors ${
                  lang === "en"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => setLang("fr")}
                className={`px-2.5 py-1 transition-colors ${
                  lang === "fr"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground"
                }`}
              >
                FR
              </button>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary focus:outline-none p-2"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-4 text-base font-medium rounded-md ${
                    isLinkActive(link.path)
                      ? "text-primary bg-primary/5"
                      : "text-foreground/80 hover:text-primary hover:bg-muted"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    {link.path === "/trips" && <Briefcase className="w-4 h-4" />}
                    {link.name}
                  </span>
                </Link>
              ))}

              {!user ? (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-4 text-base font-medium rounded-md text-foreground/80 hover:text-primary hover:bg-muted"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-4 text-base font-medium rounded-md text-foreground/80 hover:text-primary hover:bg-muted"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-4 text-base font-medium rounded-md text-foreground/80 hover:text-primary hover:bg-muted"
                  >
                    <span className="inline-flex items-center gap-2">
                      <User className="w-4 h-4" />
                      {displayName}
                    </span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-4 text-base font-medium rounded-md text-foreground/80 hover:text-primary hover:bg-muted"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}