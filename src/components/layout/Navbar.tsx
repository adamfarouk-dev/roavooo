import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, LogOut, User, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/lib/supabase";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { SafeImage } from "@/components/ui/safe-image";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useLocation();
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
    setLocation("/");
  };

  const navLinks = [
    { name: t.nav.home, path: "/" },
    { name: t.nav.cities, path: "/cities" },
    { name: t.nav.trips, path: "/trips" },
    { name: t.nav.favorites, path: "/favorites" },
    { name: t.nav.search, path: "/search" },
  ];

  const isLinkActive = (path: string) => {
    if (path === "/trips") return location === "/trips" || location.startsWith("/trips/");
    if (path === "/cities") return location === "/cities" || location.startsWith("/city/");
    if (path === "/profile") return location === "/profile";
    return location === path;
  };

  const displayName =
    user?.user_metadata?.username || user?.email || t.nav.account;

  return (
    <nav className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center shrink-0">
            <SafeImage
              src="/ROAVOOO_WHITE.png"
              alt="Roavooo"
              className="h-20 md:h-24 w-auto object-contain"
              draggable={false}
              loading="eager"
            />
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isLinkActive(link.path)
                    ? "text-primary"
                    : "text-foreground/80"
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className="flex items-center rounded-full border border-border overflow-hidden text-xs font-semibold">
              <button
                type="button"
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
                type="button"
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
                  {t.nav.login}
                </Link>

                <Link
                  href="/signup"
                  className="rounded-full bg-primary text-primary-foreground px-4 py-2 text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  {t.nav.signup}
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className={`hidden lg:flex items-center gap-2 text-sm transition-colors ${
                    isLinkActive("/profile")
                      ? "text-primary"
                      : "text-foreground/80 hover:text-primary"
                  }`}
                >
                  <User className="w-4 h-4" />
                  <span className="max-w-[180px] truncate">{displayName}</span>
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground/80 hover:text-primary hover:border-primary active:scale-[0.98] transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  {t.nav.logout}
                </button>
              </div>
            )}

          
          </div>

          <div className="md:hidden flex items-center gap-3">
            <div className="flex items-center rounded-full border border-border overflow-hidden text-xs font-semibold">
              <button
                type="button"
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
                type="button"
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
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="text-foreground hover:text-primary focus:outline-none p-2"
              aria-label="Toggle menu"
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
                    {t.nav.login}
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-4 text-base font-medium rounded-md text-foreground/80 hover:text-primary hover:bg-muted"
                  >
                    {t.nav.signup}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className={`block px-3 py-4 text-base font-medium rounded-md ${
                      isLinkActive("/profile")
                        ? "text-primary bg-primary/5"
                        : "text-foreground/80 hover:text-primary hover:bg-muted"
                    }`}
                  >
                    <span className="inline-flex items-center gap-2 max-w-full">
                      <User className="w-4 h-4 shrink-0" />
                      <span className="truncate">{displayName}</span>
                    </span>
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-4 text-base font-medium rounded-md text-foreground/80 hover:text-primary hover:bg-muted"
                  >
                    {t.nav.logout}
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
