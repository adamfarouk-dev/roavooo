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
import { AdminLogin } from "@/pages/AdminLogin";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { AdminNewPlace } from "@/pages/AdminNewPlace";
import { AdminEditPlace } from "@/pages/AdminEditPlace";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function AppShell() {
  const [location] = useLocation();
  const isAdminRoute = location.startsWith("/admin");

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      {!isAdminRoute && <Navbar />}

      <main className="flex-grow">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/city/:slug" component={City} />
          <Route path="/place/:id" component={Place} />
          <Route path="/favorites" component={Favorites} />
          <Route path="/search" component={Search} />

          <Route path="/admin/login" component={AdminLogin} />
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/places/new" component={AdminNewPlace} />
          <Route path="/admin/places/:id/edit" component={AdminEditPlace} />
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