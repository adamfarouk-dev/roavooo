import { useEffect, useState } from 'react';
import { useParams, Link } from 'wouter';
import { motion } from 'framer-motion';
import { ArrowLeft, Info, Coffee, Bed, Activity as ActivityIcon } from 'lucide-react';
import { PlaceCard } from '@/components/ui/PlaceCard';
import NotFound from './not-found';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabase';

type DbCity = {
  id: string;
  slug: string;
  name: string;
  image_url: string;
  tagline_en: string;
  tagline_fr: string;
  description_en: string;
  description_fr: string;
  tip_best_time_en: string;
  tip_best_time_fr: string;
  tip_packing_en: string;
  tip_packing_fr: string;
  tip_etiquette_en: string;
  tip_etiquette_fr: string;
  tip_transport_en: string;
  tip_transport_fr: string;
  tip_phrases_en: string;
  tip_phrases_fr: string;
};

type DbPlace = {
  id: string;
  city_id: string;
  name: string;
  category: 'stay' | 'activity' | 'restaurant';
  description_en: string;
  description_fr: string;
  image_url: string;
  location: string | null;
  rating: number;
  price_per_night: number | null;
  price_range: string | null;
  cuisine: string | null;
};

export function City() {
  const { slug } = useParams();
  const { t, language } = useLanguage();
  const [cities, setCities] = useState<DbCity[]>([]);
  const [places, setPlaces] = useState<DbPlace[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from('cities').select('*').order('id', { ascending: true }),
      supabase.from('places').select('*').order('id', { ascending: true }),
    ]).then(([citiesRes, placesRes]) => {
      if (citiesRes.error) {
        console.error('Failed to fetch cities:', citiesRes.error);
      } else {
        setCities((citiesRes.data as DbCity[]) || []);
      }

      if (placesRes.error) {
        console.error('Failed to fetch places:', placesRes.error);
      } else {
        setPlaces((placesRes.data as DbPlace[]) || []);
      }

      setLoading(false);
    });
  }, []);

  const city = cities.find((c) => c.slug === slug);

  if (loading) {
    return <div className="w-full min-h-screen bg-background" />;
  }

  if (!city) return <NotFound />;

  const mappedPlaces = places.map((place) => ({
    id: place.id,
    cityId: place.city_id,
    name: place.name,
    category: place.category,
    description: language === 'fr' ? place.description_fr : place.description_en,
    imageUrl: place.image_url,
    location: place.location ?? undefined,
    rating: place.rating,
    pricePerNight: place.price_per_night ?? undefined,
    priceRange: place.price_range ?? undefined,
    cuisine: place.cuisine ?? undefined,
  }));

  const cityPlaces = mappedPlaces.filter((p) => p.cityId === city.id);
  const stays = cityPlaces.filter((p) => p.category === 'stay');
  const activities = cityPlaces.filter((p) => p.category === 'activity');
  const restaurants = cityPlaces.filter((p) => p.category === 'restaurant');

  const tagline = language === 'fr' ? city.tagline_fr : city.tagline_en;
  const description = language === 'fr' ? city.description_fr : city.description_en;

  const tips = {
    bestTime: language === 'fr' ? city.tip_best_time_fr : city.tip_best_time_en,
    packing: language === 'fr' ? city.tip_packing_fr : city.tip_packing_en,
    etiquette: language === 'fr' ? city.tip_etiquette_fr : city.tip_etiquette_en,
    transport: language === 'fr' ? city.tip_transport_fr : city.tip_transport_en,
    phrases: language === 'fr' ? city.tip_phrases_fr : city.tip_phrases_en,
  };

  return (
    <div className="w-full bg-background pb-24">
      <div className="relative h-[60vh] min-h-[400px]">
        <div className="absolute inset-0">
          <img src={city.image_url} alt={city.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex flex-col justify-end pb-16">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 w-fit transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> {t.city.backToHome}
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold text-white mb-4"
          >
            {city.name}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-white/90 max-w-2xl font-light"
          >
            {tagline}
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="bg-card rounded-2xl p-8 shadow-xl border border-border mb-16">
          <h2 className="text-2xl font-serif font-bold mb-4">
            {t.city.about} {city.name}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">{description}</p>
        </div>

        <Tabs defaultValue="stays" className="w-full">
          <TabsList className="mb-8 bg-muted/50 p-1 w-full justify-start">
            <TabsTrigger
              value="stays"
              className="px-8 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Bed className="w-4 h-4 mr-2" /> {t.city.tabs.stays}
            </TabsTrigger>

            <TabsTrigger
              value="activities"
              className="px-8 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <ActivityIcon className="w-4 h-4 mr-2" /> {t.city.tabs.experiences}
            </TabsTrigger>

            <TabsTrigger
              value="restaurants"
              className="px-8 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Coffee className="w-4 h-4 mr-2" /> {t.city.tabs.dining}
            </TabsTrigger>

            <TabsTrigger
              value="tips"
              className="px-8 py-3 rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
            >
              <Info className="w-4 h-4 mr-2" /> {t.city.tabs.travelTips}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stays" className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {stays.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activities" className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activities.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="restaurants" className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {restaurants.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tips" className="animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-muted/30 p-8 rounded-2xl border border-border">
                <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
                  <Info className="text-primary" /> {t.city.tips.bestTime}
                </h3>
                <p className="text-muted-foreground">{tips.bestTime}</p>
              </div>

              <div className="bg-muted/30 p-8 rounded-2xl border border-border">
                <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
                  <Info className="text-primary" /> {t.city.tips.packing}
                </h3>
                <p className="text-muted-foreground">{tips.packing}</p>
              </div>

              <div className="bg-muted/30 p-8 rounded-2xl border border-border">
                <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
                  <Info className="text-primary" /> {t.city.tips.etiquette}
                </h3>
                <p className="text-muted-foreground">{tips.etiquette}</p>
              </div>

              <div className="bg-muted/30 p-8 rounded-2xl border border-border">
                <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
                  <Info className="text-primary" /> {t.city.tips.transport}
                </h3>
                <p className="text-muted-foreground">{tips.transport}</p>
              </div>

              <div className="bg-muted/30 p-8 rounded-2xl border border-border md:col-span-2">
                <h3 className="font-serif text-xl font-bold mb-4 flex items-center gap-2">
                  <Info className="text-primary" /> {t.city.tips.phrases}
                </h3>
                <p className="text-muted-foreground">{tips.phrases}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}