import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { toast } from '@/hooks/use-toast';

export function useFavorites() {
  const [, setLocation] = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async (currentUser: User | null) => {
    if (!currentUser) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('favorites')
      .select('place_id')
      .eq('user_id', currentUser.id);

    if (error) {
      console.error('Error loading favorites:', error);
      toast({
        variant: 'destructive',
        title: 'Could not load favorites',
        description: 'Please refresh the page and try again.',
      });
      setFavorites([]);
      setLoading(false);
      return;
    }

    setFavorites((data || []).map((row) => row.place_id));
    setLoading(false);
  };

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.error('Error fetching user:', error);
      }

      if (!mounted) return;

      const currentUser = data.user ?? null;
      setUser(currentUser);
      await loadFavorites(currentUser);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      setLoading(true);
      await loadFavorites(currentUser);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const toggleFavorite = async (placeId: string) => {
    if (!user) {
      setLocation('/login');
      return;
    }

    const alreadyFavorite = favorites.includes(placeId);

    if (alreadyFavorite) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('place_id', placeId);

      if (error) {
        console.error('Error removing favorite:', error);
        toast({
          variant: 'destructive',
          title: 'Could not remove favorite',
          description: error.message,
        });
        return;
      }

      setFavorites((prev) => prev.filter((id) => id !== placeId));
      toast({
        title: 'Removed from favorites',
        description: 'This place was removed from your saved favorites.',
      });
      return;
    }

    const { error } = await supabase.from('favorites').insert({
      user_id: user.id,
      place_id: placeId,
    });

    if (error) {
      console.error('Error adding favorite:', error);
      toast({
        variant: 'destructive',
        title: 'Could not save favorite',
        description: error.message,
      });
      return;
    }

    setFavorites((prev) => [...prev, placeId]);
    toast({
      title: 'Saved to favorites',
      description: 'This place was added to your favorites.',
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  return {
    user,
    favorites,
    loading,
    toggleFavorite,
    isFavorite,
  };
}
