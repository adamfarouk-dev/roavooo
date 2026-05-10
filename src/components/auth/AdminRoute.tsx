import type { ReactNode } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

type AdminRouteProps = {
  children: ReactNode;
};

export function AdminRoute({ children }: AdminRouteProps) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

