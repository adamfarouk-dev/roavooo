import { useEffect, useState } from "react";
import { Link } from "wouter";
import {
  User,
  Mail,
  Heart,
  Briefcase,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

type ProfileStats = {
  tripsCount: number;
  favoritesCount: number;
};

export function Profile() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<ProfileStats>({
    tripsCount: 0,
    favoritesCount: 0,
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);

      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("Failed to fetch user:", userError);
        setLoading(false);
        return;
      }

      const currentUser = userData.user;

      if (!currentUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      setUser(currentUser);

      const [tripsRes, favoritesRes] = await Promise.all([
        supabase.from("trips").select("id").eq("user_id", currentUser.id),
        supabase.from("favorites").select("id").eq("user_id", currentUser.id),
      ]);

      if (tripsRes.error) {
        console.error("Failed to fetch trips count:", tripsRes.error);
      }

      if (favoritesRes.error) {
        console.error("Failed to fetch favorites count:", favoritesRes.error);
      }

      setStats({
        tripsCount: tripsRes.data?.length || 0,
        favoritesCount: favoritesRes.data?.length || 0,
      });

      setLoading(false);
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <div className="p-6 max-w-5xl mx-auto">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="rounded-3xl border border-border bg-card p-8 md:p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
            <User className="w-8 h-8 text-muted-foreground" />
          </div>

          <h1 className="text-3xl font-bold mb-3">Your profile</h1>
          <p className="text-muted-foreground mb-8">
            Log in to view your profile, trips, and favorites.
          </p>

          <div className="flex items-center justify-center gap-3">
            <Link href="/login">
              <Button>Log in</Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline">Sign up</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const displayName =
    user.user_metadata?.username || user.email?.split("@")[0] || "Traveler";

  const joinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString()
    : "Unknown";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="rounded-3xl border border-border bg-card p-6">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-5">
              <User className="w-10 h-10 text-primary" />
            </div>

            <h1 className="text-2xl font-bold mb-1">{displayName}</h1>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Mail className="w-4 h-4" />
              <span className="break-all">{user.email}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="w-4 h-4" />
              <span>Joined {joinedDate}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold mb-5">Overview</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-background p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Trips</span>
                </div>
                <div className="text-3xl font-bold">{stats.tripsCount}</div>
              </div>

              <div className="rounded-2xl border border-border bg-background p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Heart className="w-5 h-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Favorites</span>
                </div>
                <div className="text-3xl font-bold">{stats.favoritesCount}</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <h2 className="text-xl font-semibold mb-5">Quick access</h2>

            <div className="space-y-3">
              <Link
                href="/trips"
                className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-4 hover:border-primary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-primary" />
                  <span>My Trips</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>

              <Link
                href="/favorites"
                className="flex items-center justify-between rounded-2xl border border-border bg-background px-4 py-4 hover:border-primary transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-5 h-5 text-primary" />
                  <span>My Favorites</span>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}