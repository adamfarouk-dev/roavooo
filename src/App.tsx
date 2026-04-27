import { useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

import { Home } from "@/pages/Home";
import { City } from "@/pages/City";
import { Place } from "@/pages/Place";
import { Favorites } from "@/pages/Favorites";
import { Search } from "@/pages/Search";
import { Login } from "@/pages/LoginPage";
import { Signup } from "@/pages/SignupPage";
import { AdminLogin } from "@/pages/AdminLogin";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { AdminNewPlace } from "@/pages/AdminNewPlace";
import { AdminEditPlace } from "@/pages/AdminEditPlace";
import { AdminNewCity } from "@/pages/AdminNewCity";
import { AdminEditCity } from "@/pages/AdminEditCity";
import { Trips } from "@/pages/Trips";
import { TripDetails } from "@/pages/TripDetails";
import { Profile } from "@/pages/Profile";
import { Cities } from "@/pages/Cities";
import { Recent } from "@/pages/Recent";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location]);

  return null;
}

function AppShell() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <ScrollToTop />

      {!isAdminRoute && <Navbar />}

      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />

          <Route path="/cities" component={Cities} />
          <Route path="/city/:slug" component={City} />

          <Route path="/place/:id" component={Place} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/recent" component={Recent} />
          <Route path="/search" component={Search} />

          <Route path="/trips" component={Trips} />
          <Route path="/trips/:id" component={TripDetails} />

          <Route path="/profile" component={Profile} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={Signup} />

          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/places/new" component={AdminNewPlace} />
          <Route path="/admin/places/:id/edit" component={AdminEditPlace} />
          <Route path="/admin/cities/new" component={AdminNewCity} />
          <Route path="/admin/cities/:id/edit" component={AdminEditCity} />

          <Route component={NotFound} />
        </Switch>
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