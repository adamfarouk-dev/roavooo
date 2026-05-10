import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useLocation } from "wouter";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

type AdminRouteProps = {
  children: ReactNode;
};

function AdminAccessGate({ children }: AdminRouteProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkAdminRole = async () => {
      setLoading(true);

      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData.user) {
        if (!mounted) return;
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .single();

      if (!mounted) return;

      if (profileError || profile?.role !== "admin") {
        console.error("Admin role check failed:", profileError);
        toast({
          variant: "destructive",
          title: "Admin access required",
          description: "Your account does not have permission to view this page.",
        });
        setIsAdmin(false);
        setLoading(false);
        setLocation("/");
        return;
      }

      setIsAdmin(true);
      setLoading(false);
    };

    checkAdminRole();

    return () => {
      mounted = false;
    };
  }, [setLocation, toast]);

  if (loading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
}

export function AdminRoute({ children }: AdminRouteProps) {
  return (
    <ProtectedRoute>
      <AdminAccessGate>{children}</AdminAccessGate>
    </ProtectedRoute>
  );
}
