import { Link } from 'wouter';
import { CITIES } from '@/lib/data';
import { useLanguage } from '@/contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-secondary text-secondary-foreground mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center shrink-0">
              <img
                src="/ROAVOOO_WHITE.png"
                alt="Roavooo"
                className="h-20 md:h-24 w-auto object-contain"
                draggable={false}
              />
            </Link>
            <p className="text-secondary-foreground/70 max-w-sm mb-6 leading-relaxed">
              {t.footer.tagline}
            </p>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-white">{t.footer.destinations}</h4>
            <ul className="space-y-3">
              {CITIES.map(city => (
                <li key={city.id}>
                  <Link href={`/city/${city.slug}`} className="text-secondary-foreground/70 hover:text-primary transition-colors">
                    {city.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg font-semibold mb-4 text-white">{t.footer.explore}</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/search?category=stay" className="text-secondary-foreground/70 hover:text-primary transition-colors">
                  {t.footer.staysRiads}
                </Link>
              </li>
              <li>
                <Link href="/search?category=activity" className="text-secondary-foreground/70 hover:text-primary transition-colors">
                  {t.footer.experiences}
                </Link>
              </li>
              <li>
                <Link href="/search?category=restaurant" className="text-secondary-foreground/70 hover:text-primary transition-colors">
                  {t.footer.dining}
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-secondary-foreground/70 hover:text-primary transition-colors">
                  {t.footer.yourFavorites}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-secondary-foreground/50">
          <p>&copy; {new Date().getFullYear()} Roavooo. {t.footer.allRightsReserved}</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Instagram</a>
            <a href="#" className="hover:text-white transition-colors">Pinterest</a>
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
