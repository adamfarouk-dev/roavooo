import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Search as SearchIcon } from 'lucide-react';
import { PLACES, CITIES, Category } from '@/lib/data';
import { PlaceCard } from '@/components/ui/PlaceCard';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export function Search() {
  const [location] = useLocation();
  const { t } = useLanguage();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('q')) setSearchQuery(params.get('q') || '');
    if (params.has('category')) setCategoryFilter(params.get('category') || 'all');
    if (params.has('city')) setCityFilter(params.get('city') || 'all');
  }, [location]);

  const filteredPlaces = PLACES.filter(place => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      place.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = categoryFilter === 'all' || place.category === categoryFilter;
    const matchesCity = cityFilter === 'all' || place.cityId === cityFilter;

    return matchesSearch && matchesCategory && matchesCity;
  });

  const resultLabel = filteredPlaces.length === 1 ? t.search.result : t.search.results;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">{t.search.title}</h1>
        <p className="text-xl text-muted-foreground">{t.search.subtitle}</p>
      </div>

      <div className="bg-card p-6 rounded-2xl border border-border shadow-sm mb-12 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder={t.search.placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 py-6 rounded-xl text-lg bg-muted/50 border-none focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <Select value={cityFilter} onValueChange={setCityFilter}>
            <SelectTrigger className="w-full md:w-[200px] py-6 rounded-xl bg-muted/50 border-none">
              <SelectValue placeholder={t.search.allCities} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.search.allCities}</SelectItem>
              {CITIES.map(city => (
                <SelectItem key={city.id} value={city.id}>{city.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full md:w-[200px] py-6 rounded-xl bg-muted/50 border-none">
              <SelectValue placeholder={t.search.allTypes} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.search.allTypes}</SelectItem>
              <SelectItem value="stay">{t.search.staysLabel}</SelectItem>
              <SelectItem value="activity">{t.search.experiencesLabel}</SelectItem>
              <SelectItem value="restaurant">{t.search.diningLabel}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-serif font-semibold">
          {filteredPlaces.length} {resultLabel} {t.search.found}
        </h2>
      </div>

      {filteredPlaces.length === 0 ? (
        <div className="text-center py-24 bg-muted/20 rounded-2xl border border-dashed border-border">
          <h3 className="text-2xl font-serif font-semibold mb-2">{t.search.noResultsTitle}</h3>
          <p className="text-muted-foreground mb-6">{t.search.noResultsMsg}</p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery('');
              setCategoryFilter('all');
              setCityFilter('all');
            }}
          >
            {t.search.clearFilters}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPlaces.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      )}
    </div>
  );
}
