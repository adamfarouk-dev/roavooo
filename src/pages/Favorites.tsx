import { useFavorites } from '@/hooks/use-favorites';
import { PLACES } from '@/lib/data';
import { PlaceCard } from '@/components/ui/PlaceCard';
import { Heart } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export function Favorites() {
  const { favorites } = useFavorites();
  const { t } = useLanguage();

  const favoritePlaces = PLACES.filter(p => favorites.includes(p.id));

  return (
    <div className="min-h-[70vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">{t.favorites.title}</h1>
        <p className="text-xl text-muted-foreground">{t.favorites.subtitle}</p>
      </div>

      {favoritePlaces.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 px-4 bg-card rounded-3xl border border-border shadow-sm text-center">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
            <Heart className="w-10 h-10 text-muted-foreground/50" />
          </div>
          <h2 className="text-2xl font-serif font-bold mb-3">{t.favorites.emptyTitle}</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            {t.favorites.emptyMessage}
          </p>
          <Link href="/search">
            <Button size="lg" className="rounded-full px-8 text-lg font-semibold">
              {t.favorites.emptyCta}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favoritePlaces.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}
