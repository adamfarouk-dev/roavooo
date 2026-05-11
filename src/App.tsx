import { lazy, Suspense, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

import { Home } from "@/pages/Home";
import { Login } from "@/pages/LoginPage";
import { Signup } from "@/pages/SignupPage";
import { Cities } from "@/pages/Cities";
import { Recent } from "@/pages/RecentPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

const City = lazy(() => import("@/pages/City").then((module) => ({ default: module.City })));
const Place = lazy(() => import("@/pages/Place").then((module) => ({ default: module.Place })));
const Favorites = lazy(() =>
  import("@/pages/Favorites").then((module) => ({ default: module.Favorites }))
);
const Search = lazy(() => import("@/pages/Search").then((module) => ({ default: module.Search })));
const Trips = lazy(() => import("@/pages/Trips").then((module) => ({ default: module.Trips })));
const TripDetails = lazy(() =>
  import("@/pages/TripDetails").then((module) => ({ default: module.TripDetails }))
);
const Profile = lazy(() =>
  import("@/pages/Profile").then((module) => ({ default: module.Profile }))
);
const AdminLogin = lazy(() =>
  import("@/pages/AdminLogin").then((module) => ({ default: module.AdminLogin }))
);
const AdminDashboard = lazy(() =>
  import("@/pages/AdminDashboard").then((module) => ({ default: module.AdminDashboard }))
);
const AdminNewPlace = lazy(() =>
  import("@/pages/AdminNewPlace").then((module) => ({ default: module.AdminNewPlace }))
);
const AdminEditPlace = lazy(() =>
  import("@/pages/AdminEditPlace").then((module) => ({ default: module.AdminEditPlace }))
);
const AdminNewCity = lazy(() =>
  import("@/pages/AdminNewCity").then((module) => ({ default: module.AdminNewCity }))
);
const AdminEditCity = lazy(() =>
  import("@/pages/AdminEditCity").then((module) => ({ default: module.AdminEditCity }))
);

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);

  return null;
}

function RouteLoadingFallback() {
  return (
    <div className="min-h-[60vh] px-4 py-10">
      <div className="max-w-6xl mx-auto">
        <div className="h-8 w-48 max-w-full rounded-lg bg-muted animate-pulse mb-4" />
        <div className="h-4 w-80 max-w-full rounded bg-muted animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              <div className="h-48 bg-muted animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-5 w-2/3 rounded bg-muted animate-pulse" />
                <div className="h-4 w-full rounded bg-muted animate-pulse" />
                <div className="h-4 w-4/5 rounded bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function AppShell() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <ScrollToTop />

      {!isAdminRoute && <Navbar />}

      <main className="flex-grow">
        <Suspense fallback={<RouteLoadingFallback />}>
          <Switch>
            <Route path="/" component={Home} />

            <Route path="/cities" component={Cities} />
            <Route path="/city/:slug" component={City} />

            <Route path="/place/:id" component={Place} />
            <Route path="/favorites">
              <ProtectedRoute>
                <Favorites />
              </ProtectedRoute>
            </Route>
            <Route path="/recent" component={Recent} />
            <Route path="/search" component={Search} />

            <Route path="/trips">
              <ProtectedRoute>
                <Trips />
              </ProtectedRoute>
            </Route>
            <Route path="/trips/:id">
              <ProtectedRoute>
                <TripDetails />
              </ProtectedRoute>
            </Route>

            <Route path="/profile">
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </Route>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />

            <Route path="/admin/login" component={AdminLogin} />
            <Route path="/admin">
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </Route>
            <Route path="/admin/new-place">
              <AdminRoute>
                <AdminNewPlace />
              </AdminRoute>
            </Route>
            <Route path="/admin/places/new">
              <AdminRoute>
                <AdminNewPlace />
              </AdminRoute>
            </Route>
            <Route path="/admin/edit-place/:id">
              <AdminRoute>
                <AdminEditPlace />
              </AdminRoute>
            </Route>
            <Route path="/admin/places/:id/edit">
              <AdminRoute>
                <AdminEditPlace />
              </AdminRoute>
            </Route>
            <Route path="/admin/new-city">
              <AdminRoute>
                <AdminNewCity />
              </AdminRoute>
            </Route>
            <Route path="/admin/cities/new">
              <AdminRoute>
                <AdminNewCity />
              </AdminRoute>
            </Route>
            <Route path="/admin/edit-city/:id">
              <AdminRoute>
                <AdminEditCity />
              </AdminRoute>
            </Route>
            <Route path="/admin/cities/:id/edit">
              <AdminRoute>
                <AdminEditCity />
              </AdminRoute>
            </Route>

            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>

      {!isAdminRoute && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppShell />
          </WouterRouter>
          <Toaster />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
