import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { useLocation } from "wouter";
import { supabase } from "@/lib/supabase";

type ProtectedRouteProps = {
  children: ReactNode;
};

function getCurrentPath() {
  return `${window.location.pathname}${window.location.search}${window.location.hash}`;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [location, setLocation] = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Failed to check auth session:", error);
      }

      if (!mounted) return;

      setSession(data.session);
      setLoading(false);
    };

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (loading || session) return;

    localStorage.setItem("redirectAfterLogin", getCurrentPath());
    setLocation("/login");
  }, [loading, location, session, setLocation]);

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}

