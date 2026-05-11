import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Menu,
  X,
  LogOut,
  User,
  Briefcase,
  Home as HomeIcon,
  Map,
  Search,
  Heart,
} from "lucide-react";
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

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

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
    { name: t.nav.home, path: "/", icon: HomeIcon },
    { name: t.nav.cities, path: "/cities", icon: Map },
    { name: t.nav.trips, path: "/trips", icon: Briefcase },
    { name: t.nav.favorites, path: "/favorites", icon: Heart },
    { name: t.nav.search, path: "/search", icon: Search },
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
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/75 shadow-[0_10px_30px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:border-border lg:bg-background/90 lg:shadow-none lg:backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-24 lg:h-20 items-center">
          <Link href="/" className="flex items-center shrink-0">
            <SafeImage
              src="/ROAVOOO_WHITE.png"
              alt="Roavooo"
              className="h-20 w-auto max-w-[15rem] object-contain sm:h-24 sm:max-w-[18rem] lg:h-24 lg:max-w-none"
              draggable={false}
              loading="eager"
            />
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
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

          <div className="lg:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsOpen((prev) => !prev)}
              className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-full border border-white/15 bg-white/10 text-white hover:text-primary hover:border-primary/50 focus:outline-none transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="lg:hidden border-t border-white/10 bg-black/90 shadow-2xl backdrop-blur-xl"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 max-h-[calc(100dvh-4rem)] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  href={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3.5 text-base font-medium rounded-xl transition-colors ${
                    isLinkActive(link.path)
                      ? "text-primary bg-primary/10"
                      : "text-white/85 hover:text-primary hover:bg-white/10"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <link.icon className="w-4 h-4" />
                    {link.name}
                  </span>
                </Link>
              ))}
              </div>

              {!user ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-4 border-t border-white/10">
                  <Link
                    href="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3.5 text-base font-medium rounded-xl text-white/85 hover:text-primary hover:bg-white/10 transition-colors"
                  >
                    {t.nav.login}
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3.5 text-base font-semibold rounded-xl bg-primary text-primary-foreground hover:opacity-90 active:scale-[0.98] transition-all"
                  >
                    {t.nav.signup}
                  </Link>
                </div>
              ) : (
                <div className="space-y-2 mt-4 pt-4 border-t border-white/10">
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3.5 text-base font-medium rounded-xl transition-colors ${
                      isLinkActive("/profile")
                        ? "text-primary bg-primary/10"
                        : "text-white/85 hover:text-primary hover:bg-white/10"
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
                    className="w-full text-left px-4 py-3.5 text-base font-medium rounded-xl text-white/85 hover:text-primary hover:bg-white/10 transition-colors"
                  >
                    <span className="inline-flex items-center gap-2">
                      <LogOut className="w-4 h-4" />
                      {t.nav.logout}
                    </span>
                  </button>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-white/10">
                <div className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/5 p-2">
                  <span className="px-2 text-sm font-medium text-white/70">
                    Language
                  </span>
                  <div className="flex items-center rounded-full border border-white/15 overflow-hidden text-xs font-semibold">
                    <button
                      type="button"
                      onClick={() => setLang("en")}
                      className={`px-4 py-2 transition-colors ${
                        lang === "en"
                          ? "bg-primary text-primary-foreground"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      EN
                    </button>
                    <button
                      type="button"
                      onClick={() => setLang("fr")}
                      className={`px-4 py-2 transition-colors ${
                        lang === "fr"
                          ? "bg-primary text-primary-foreground"
                          : "text-white/70 hover:text-white"
                      }`}
                    >
                      FR
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
