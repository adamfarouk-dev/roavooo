export type Lang = 'en' | 'fr';

const en = {
  nav: {
    home: 'Home',
    cities: 'Cities',
    favorites: 'Favorites',
    search: 'Search',
  },
  hero: {
    eyebrow: 'Morocco Travel, Curated',
    headline1: 'Everything Morocco,',
    headline2: 'In One Place.',
    subheadline: "Find where to stay, what to do, and where to eat — curated across Morocco's most iconic cities.",
    tabs: { stays: 'Stays', experiences: 'Experiences', dining: 'Dining' },
    placeholder: {
      stay: 'Search riads, hotels...',
      activity: 'Search experiences, tours...',
      restaurant: 'Search restaurants, cafés...',
    },
    searchBtn: 'Search',
  },
  home: {
    destinations: {
      eyebrow: 'Destinations',
      title: 'Iconic Moroccan Cities',
      exploreCity: 'Explore city',
    },
    stays: {
      eyebrow: 'Where to Sleep',
      title: 'Exceptional Stays',
      subtitle: 'From atmospheric riads to desert camps and five-star palaces.',
      viewAll: 'View all',
      viewAllMobile: 'View all stays',
    },
    experiences: {
      eyebrow: 'Things To Do',
      title: 'Unforgettable Experiences',
      subtitle: 'Hammams, souk tours, cooking classes, and desert adventures.',
      viewAll: 'View all',
    },
    dining: {
      eyebrow: 'Where to Eat',
      title: 'Dining Highlights',
      subtitle: 'Rooftop restaurants, medina street food, and palace dining experiences.',
      viewAll: 'View all',
      viewAllMobile: 'View all dining',
    },
  },
  city: {
    backToHome: 'Back to Home',
    about: 'About',
    tabs: {
      stays: 'Stays',
      experiences: 'Experiences',
      dining: 'Dining',
      travelTips: 'Travel Tips',
    },
    tips: {
      bestTime: 'Best Time to Visit',
      packing: 'What to Pack',
      etiquette: 'Etiquette',
      transport: 'Getting Around',
      phrases: 'Useful Phrases',
    },
    content: {
      casablanca: {
        tagline: 'Modernity Meets Tradition on the Atlantic Coast',
        description:
          "Morocco's economic heart blends Mauresque architecture with a cosmopolitan lifestyle. Discover Art Deco gems, the majestic Hassan II Mosque, and a vibrant coastal energy.",
        tips: {
          bestTime: 'March to May for pleasant coastal breezes.',
          packing: 'Smart casual wear; modest clothing for mosque visits.',
          etiquette: 'Respect prayer times and ask before photographing people.',
          transport: 'Use the tramway for easy coastal and downtown transit.',
          phrases: 'Salam (Hello), Choukran (Thank you).',
        },
      },
      rabat: {
        tagline: 'The Quiet Capital of Gardens and Medinas',
        description:
          "Rabat offers a relaxed pace with its pristine gardens, historic Kasbah of the Udayas, and tree-lined boulevards overlooking the Atlantic.",
        tips: {
          bestTime: 'April to June when gardens are in full bloom.',
          packing: 'Comfortable walking shoes and light layers.',
          etiquette: 'Public displays of affection should be kept minimal.',
          transport: 'Petit taxis (blue in Rabat) are cheap and metered.',
          phrases: 'Bslama (Goodbye), Afak (Please).',
        },
      },
      marrakech: {
        tagline: 'The Red City of Endless Discovery',
        description:
          'Lose yourself in the labyrinthine souks, vibrant squares, and tranquil riads of Marrakech. A sensory overload of spices, colors, and sounds.',
        tips: {
          bestTime: 'September to November to avoid intense summer heat.',
          packing: 'Light, breathable fabrics; a scarf for dust and sun.',
          etiquette: 'Haggling is expected in souks — do it with a smile.',
          transport: 'Walk the Medina; take a taxi for further distances.',
          phrases: 'La choukran (No thank you — useful in souks).',
        },
      },
    },
  },
  place: {
    backTo: 'Back to',
    perNight: '/ night',
    priceRange: 'Price Range',
    cuisine: 'Cuisine',
    checkAvailability: 'Check Availability',
    bookExperience: 'Book Experience',
    noCharge: "You won't be charged yet",
    highlights: 'Highlights',
    highlightsList: [
      'Authentic Moroccan Experience',
      'Premium Service',
      'Central Location',
    ] as string[],
    moreIn: 'More',
    inCity: 'in',
    categoryPlural: {
      stay: 'stays',
      activity: 'experiences',
      restaurant: 'restaurants',
    },
    categoryLabel: {
      stay: 'Stay',
      activity: 'Experience',
      restaurant: 'Dining',
    },
    content: {
      s1: {
        description: 'A beautifully restored Art Deco mansion offering luxurious suites and a world-class spa in the heart of Casablanca.',
        details: [
          'Set in one of Casablanca’s most elegant districts, Hôtel particulier Le Doge blends historic architecture with refined hospitality.',
          'Guests can enjoy spacious suites, artistic interiors, and a calm atmosphere that feels both intimate and luxurious.'
        ] as string[],
      },
      s2: {
        description: 'Oceanfront luxury with breathtaking Atlantic views, private beach access, and impeccable five-star service.',
        details: [
          'Four Seasons Casablanca offers a polished seaside experience with premium comfort, attentive service, and sweeping ocean scenery.',
          'Its location on the Corniche makes it ideal for travelers who want both relaxation and easy access to the city.'
        ] as string[],
      },
      s3: {
        description: 'A rare authentic riad experience hidden in the heart of modern Casablanca, with a peaceful inner courtyard.',
        details: [
          'Riad Jnane Sherazade delivers a more intimate and traditional stay for travelers seeking Moroccan character in a modern city.',
          'The peaceful courtyard and classic decor create a warm escape from Casablanca’s busy rhythm.'
        ] as string[],
      },
      s4: {
        description: 'Boutique hotel where each suite is uniquely dedicated to a famous artist, blending culture and comfort.',
        details: [
          'Art Palace Suites stands out for its creative concept and elegant interiors inspired by art and cinema.',
          'It is a strong choice for visitors looking for a boutique stay with personality and comfort.'
        ] as string[],
      },

      a1: {
        description: "Guided tour of one of the world's largest mosques, built dramatically over the Atlantic Ocean.",
        details: [
          'The Hassan II Mosque is one of Morocco’s most iconic landmarks and an essential stop in Casablanca.',
          'Its oceanfront setting, monumental scale, and intricate craftsmanship make the experience unforgettable.'
        ] as string[],
      },
      a2: {
        description: "Explore the downtown core's stunning 1930s Mauresque and Art Deco buildings with an expert local guide.",
        details: [
          'Casablanca’s architecture reveals a fascinating blend of European Art Deco and Moroccan decorative influence.',
          'This walk is ideal for travelers who want to understand the city beyond its modern image.'
        ] as string[],
      },
      a3: {
        description: "Catch consistent Atlantic waves with experienced local surf instructors on Casablanca's beach.",
        details: [
          'A surf session in Casablanca offers a fun mix of sport, ocean energy, and local beach culture.',
          'Whether you are a beginner or improving your technique, the Atlantic coastline provides a lively setting.'
        ] as string[],
      },
      a4: {
        description: "Wander the picturesque 'New Medina' to shop for traditional crafts, pastries, and local spices.",
        details: [
          'The Habous Quarter is one of Casablanca’s most charming areas, known for its ordered streets and local craftsmanship.',
          'It is perfect for a relaxed cultural walk with shopping, bakeries, and classic Moroccan atmosphere.'
        ] as string[],
      },

      r1: {
        description: 'Iconic Casablanca bar inspired by the classic film, serving Moroccan and international cuisine with live jazz.',
        details: [
          'Rick’s Café is famous for its cinematic mood, elegant setting, and evening ambiance.',
          'It is a popular address for travelers looking for a memorable dinner with a touch of old-world glamour.'
        ] as string[],
      },
      r2: {
        description: 'Set inside a historic fortress, celebrated for lavish Moroccan breakfasts and traditional tagines.',
        details: [
          'La Sqala combines heritage architecture with comforting Moroccan cuisine in a beautiful garden-like setting.',
          'It is especially loved for breakfast and for introducing visitors to classic local flavors.'
        ] as string[],
      },
      r3: {
        description: 'Chic oceanfront dining on the Corniche with stunning sunset views and the freshest Atlantic seafood.',
        details: [
          'Le Cabestan offers one of the most stylish dining experiences in Casablanca, right by the sea.',
          'It is ideal for sunset meals, refined seafood dishes, and a modern upscale atmosphere.'
        ] as string[],
      },
      r4: {
        description: 'Authentic local stalls serving fresh msemen, grilled kefta, harira soup, and sweet mint tea.',
        details: [
          'Derb Sultan street food is all about everyday Casablanca flavors served quickly, generously, and with character.',
          'It is a great choice for travelers who want something local, affordable, and full of energy.'
        ] as string[],
      },

      s5: {
        description: 'An award-winning riad in the Medina blending modern luxury with traditional Moroccan craftsmanship.',
        details: [
          'Euphoriad is known for combining refined design with medina authenticity in a peaceful setting.',
          'Its thoughtful details and calm atmosphere make it one of Rabat’s standout boutique stays.'
        ] as string[],
      },
      s6: {
        description: 'A serene oasis of calm set within five acres of citrus groves and lush gardens in the Souissi district.',
        details: [
          'Villa Mandarine feels like a retreat hidden inside the capital, surrounded by greenery and tranquility.',
          'It is especially appealing for travelers who prioritize quiet comfort and elegant garden surroundings.'
        ] as string[],
      },
      s7: {
        description: 'Elegant 19th-century riad with intricate zellige tilework, a rooftop pool, and sweeping medina views.',
        details: [
          'Riad Kalaa offers a balance of heritage charm and modern comfort with strong visual character.',
          'Its rooftop and architecture make it a memorable base for exploring Rabat’s old city.'
        ] as string[],
      },
      s8: {
        description: "Five-star grandeur set within 17 acres of manicured Andalusian gardens in Rabat's most prestigious district.",
        details: [
          'Sofitel Jardin des Roses is one of Rabat’s most luxurious stays, known for its scale, service, and landscaped grounds.',
          'It suits travelers looking for a premium hotel experience with calm surroundings and polished comfort.'
        ] as string[],
      },

      a5: {
        description: 'Stroll through the iconic blue-and-white alleys of this ancient Atlantic-facing fortress and its Andalusian gardens.',
        details: [
          'The Kasbah of the Udayas is one of Rabat’s most photogenic and historically rich places.',
          'Its blue lanes, ocean views, and peaceful gardens make it a must-see for first-time visitors.'
        ] as string[],
      },
      a6: {
        description: 'Explore the hauntingly beautiful Roman and Merinid ruins, home to resident storks and citrus trees.',
        details: [
          'Chellah offers a unique atmosphere where archaeology, greenery, and silence come together.',
          'It is ideal for travelers interested in history, ruins, and a slower reflective visit.'
        ] as string[],
      },
      a7: {
        description: "Unwind in Rabat's terraced botanical gardens, filled with orange trees, rose bushes, and quiet fountains.",
        details: [
          'The Andalusian Gardens are perfect for a calm break between city visits and monuments.',
          'They provide shade, beauty, and a softer side of Rabat’s coastal elegance.'
        ] as string[],
      },
      a8: {
        description: 'A calmer, pressure-free alternative to Marrakech — perfect for browsing rugs, ceramics, and leather goods.',
        details: [
          'Rabat’s medina offers a gentler shopping and walking experience than many larger tourist centers.',
          'It is a great place to explore artisan products without the intensity of more crowded markets.'
        ] as string[],
      },

      r5: {
        description: 'A beloved Rabat institution for authentic slow-cooked tagines, fluffy couscous, and warm Moroccan hospitality.',
        details: [
          'Dar Naji is appreciated for its generous portions, traditional recipes, and welcoming setting.',
          'It is a strong choice for travelers wanting a classic Moroccan meal in Rabat.'
        ] as string[],
      },
      r6: {
        description: 'Dine aboard a beautiful replica wooden ship moored on the Bou Regreg river, with views of the Kasbah.',
        details: [
          'Le Dhow offers one of Rabat’s most distinctive dining settings, floating between city and river views.',
          'It combines atmosphere, seafood, and a memorable evening experience.'
        ] as string[],
      },
      r7: {
        description: "A charming courtyard café beloved by Rabat's creative crowd, ideal for brunch and relaxed afternoon lunches.",
        details: [
          'Ty Potes is known for its relaxed mood and café style, making it perfect for slower daytime meals.',
          'It attracts both locals and visitors who want a comfortable, social setting.'
        ] as string[],
      },
      r8: {
        description: "Grab fresh makouda fritters, snails in broth, and honey-soaked sfenj doughnuts from Rabat's local vendors.",
        details: [
          'Rabat’s food stalls offer quick and flavorful bites rooted in everyday local food culture.',
          'They are ideal for curious travelers who want authentic street flavors at a low price.'
        ] as string[],
      },

      s9: {
        description: 'The legendary palace hotel — a Marrakech icon since 1923 — offering unrivalled opulence, vast gardens, and timeless grandeur.',
        details: [
          'La Mamounia is one of Morocco’s most famous hotels, celebrated for luxury, prestige, and historic elegance.',
          'Its gardens, service, and architecture create an unforgettable Marrakech experience.'
        ] as string[],
      },
      s10: {
        description: 'A vibrant boutique riad filled with contemporary Moroccan art, a rooftop pool, and sweeping medina panoramas.',
        details: [
          'El Fenn blends bold style with boutique intimacy, offering a highly visual and fashionable stay.',
          'Its rooftop spaces and curated interiors make it especially memorable.'
        ] as string[],
      },
      s11: {
        description: 'Instagram-famous for its stunning emerald plunge pool and lush flower-draped courtyard in the ancient medina.',
        details: [
          'Riad Yasmine is loved for its photogenic design and intimate atmosphere inside the medina.',
          'It is ideal for travelers seeking a beautiful and character-rich Marrakech stay.'
        ] as string[],
      },
      s12: {
        description: 'Sleep under a sky blazing with stars in a luxury Bedouin-style tent in the raw stone desert near Marrakech.',
        details: [
          'Agafay Desert Camp offers a desert escape close to Marrakech without going deep into the Sahara.',
          'It is perfect for travelers wanting silence, stars, and a memorable outdoor luxury experience.'
        ] as string[],
      },

      a9: {
        description: "Wander through Yves Saint Laurent's iconic cobalt-blue botanical garden, home to rare cacti and a Berber museum.",
        details: [
          'Jardin Majorelle is one of Marrakech’s most famous cultural and visual landmarks.',
          'Its colors, plant collections, and artistic heritage make it a must for design and garden lovers.'
        ] as string[],
      },
      a10: {
        description: 'Navigate the medina’s labyrinthine markets with a knowledgeable guide — spices, lanterns, leather, and silver.',
        details: [
          'A souk tour helps visitors understand the layers, rhythms, and craftsmanship of Marrakech’s medina.',
          'It is a rich sensory experience and a great way to discover hidden corners with confidence.'
        ] as string[],
      },
      a11: {
        description: 'Surrender to the ancient ritual of a hammam — steam, black soap scrub, and argan oil massage in a palace setting.',
        details: [
          'A traditional hammam is one of the most iconic wellness experiences in Morocco.',
          'This activity combines relaxation, cleansing rituals, and a deeper connection with local traditions.'
        ] as string[],
      },
      a12: {
        description: 'Shop the souks at dawn, then learn to craft perfect tagine, pastilla, and mint tea with a local family chef.',
        details: [
          'A Moroccan cooking class is both cultural and practical, taking travelers from ingredients to final dish.',
          'It is a rewarding way to experience hospitality, food traditions, and everyday culinary technique.'
        ] as string[],
      },

      r9: {
        description: 'A chic multi-level rooftop restaurant reimagining Moroccan classics with contemporary flair and medina rooftop views.',
        details: [
          'Nomad is one of Marrakech’s best-known modern dining spots, balancing tradition and contemporary style.',
          'Its rooftop setting and updated Moroccan flavors make it especially popular with travelers.'
        ] as string[],
      },
      r10: {
        description: 'A lush secret garden restaurant inside a 16th-century riad, shaded by banana trees and resident tortoises.',
        details: [
          'Le Jardin offers a calm green escape from the busy medina with a highly atmospheric courtyard.',
          'It is perfect for a relaxed lunch or dinner surrounded by plants and historic architecture.'
        ] as string[],
      },
      r11: {
        description: "Morocco's greatest open-air dining theatre — hundreds of smoke-filled stalls serving everything from snails to lamb brochettes.",
        details: [
          'Jemaa el-Fnaa at night is one of the most energetic food scenes in Morocco, filled with smoke, voices, and aromas.',
          'It is ideal for travelers wanting a raw, lively, and unforgettable street-food experience.'
        ] as string[],
      },
      r12: {
        description: 'A legendary palace-restaurant experience — six courses of traditional Moroccan cuisine served in a candlelit riad.',
        details: [
          'Dar Yacout is known for spectacle, hospitality, and a richly theatrical Moroccan dining experience.',
          'It is best for travelers seeking a memorable, high-end evening in an ornate traditional setting.'
        ] as string[],
      },
    },
  },
  favorites: {
    title: 'Your Saved Curations',
    subtitle: 'A personal collection of your favorite Moroccan destinations.',
    emptyTitle: 'No favorites yet',
    emptyMessage: "Start exploring and tap the heart icon to save places you'd love to visit.",
    emptyCta: 'Explore Destinations',
  },
  search: {
    title: 'Discover Morocco',
    subtitle: "Find exactly what you're looking for.",
    placeholder: 'Search by name or keyword...',
    allCities: 'All Cities',
    allTypes: 'All Types',
    staysLabel: 'Stays & Riads',
    experiencesLabel: 'Experiences',
    diningLabel: 'Dining',
    result: 'Result',
    results: 'Results',
    found: 'found',
    noResultsTitle: 'No places found',
    noResultsMsg: 'Try adjusting your filters or search terms.',
    clearFilters: 'Clear Filters',
  },
  card: {
    freeToExplore: 'Free to explore',
    details: 'Details',
    perNight: '/ night',
    category: {
      stay: 'Stay',
      activity: 'Experience',
      restaurant: 'Dining',
    },
  },
  footer: {
    tagline:
      'Your premium guide to the wonders of Morocco. Discover curated stays, authentic activities, and unforgettable dining experiences.',
    destinations: 'Destinations',
    explore: 'Explore',
    staysRiads: 'Stays & Riads',
    experiences: 'Experiences',
    dining: 'Dining',
    yourFavorites: 'Your Favorites',
    allRightsReserved: 'All rights reserved.',
  },
};

const fr: typeof en = {
  nav: {
    home: 'Accueil',
    cities: 'Villes',
    favorites: 'Favoris',
    search: 'Recherche',
  },
  hero: {
    eyebrow: 'Maroc Voyage, Sélectionné',
    headline1: 'Tout le Maroc,',
    headline2: 'En Un Seul Endroit.',
    subheadline:
      'Trouvez où séjourner, quoi faire et où manger — sélectionné dans les villes les plus emblématiques du Maroc.',
    tabs: { stays: 'Séjours', experiences: 'Expériences', dining: 'Gastronomie' },
    placeholder: {
      stay: 'Rechercher des riads, hôtels...',
      activity: 'Rechercher des expériences, visites...',
      restaurant: 'Rechercher des restaurants, cafés...',
    },
    searchBtn: 'Rechercher',
  },
  home: {
    destinations: {
      eyebrow: 'Destinations',
      title: 'Villes Emblématiques du Maroc',
      exploreCity: 'Explorer la ville',
    },
    stays: {
      eyebrow: 'Où Dormir',
      title: 'Séjours Exceptionnels',
      subtitle: 'Des riads atmosphériques aux camps du désert et aux palaces cinq étoiles.',
      viewAll: 'Voir tout',
      viewAllMobile: 'Voir tous les séjours',
    },
    experiences: {
      eyebrow: 'À Faire',
      title: 'Expériences Inoubliables',
      subtitle: 'Hammams, visites des souks, cours de cuisine et aventures dans le désert.',
      viewAll: 'Voir tout',
    },
    dining: {
      eyebrow: 'Où Manger',
      title: 'Meilleures Tables',
      subtitle: 'Restaurants en terrasse, street food de la médina et dîners dans les palais.',
      viewAll: 'Voir tout',
      viewAllMobile: 'Voir toute la gastronomie',
    },
  },
  city: {
    backToHome: "Retour à l'accueil",
    about: 'À propos de',
    tabs: {
      stays: 'Séjours',
      experiences: 'Expériences',
      dining: 'Gastronomie',
      travelTips: 'Conseils Voyage',
    },
    tips: {
      bestTime: 'Meilleure Période',
      packing: 'Quoi Emporter',
      etiquette: 'Étiquette',
      transport: 'Se Déplacer',
      phrases: 'Expressions Utiles',
    },
    content: {
      casablanca: {
        tagline: "Modernité et tradition sur la côte atlantique",
        description:
          'Le cœur économique du Maroc mêle architecture mauresque et style de vie cosmopolite. Découvrez les joyaux Art déco, la majestueuse mosquée Hassan II et une énergie côtière vibrante.',
        tips: {
          bestTime: 'De mars à mai pour profiter de la douceur côtière.',
          packing: 'Tenue chic décontractée ; vêtements modestes pour les visites de mosquées.',
          etiquette: 'Respectez les heures de prière et demandez avant de photographier les gens.',
          transport: 'Utilisez le tramway pour circuler facilement entre le centre-ville et la côte.',
          phrases: 'Salam (Bonjour), Choukran (Merci).',
        },
      },
      rabat: {
        tagline: 'La capitale paisible des jardins et médinas',
        description:
          "Rabat offre un rythme détendu avec ses jardins soignés, la Kasbah des Oudayas chargée d'histoire et ses boulevards bordés d'arbres face à l'Atlantique.",
        tips: {
          bestTime: 'D’avril à juin quand les jardins sont en pleine floraison.',
          packing: 'Chaussures confortables pour marcher et vêtements légers en couches.',
          etiquette: "Les démonstrations d'affection en public doivent rester discrètes.",
          transport: 'Les petits taxis (bleus à Rabat) sont abordables et utilisent le compteur.',
          phrases: 'Bslama (Au revoir), Afak (S’il vous plaît).',
        },
      },
      marrakech: {
        tagline: 'La ville rouge aux découvertes infinies',
        description:
          'Perdez-vous dans les souks labyrinthiques, les places animées et les riads paisibles de Marrakech. Un déluge sensoriel d’épices, de couleurs et de sons.',
        tips: {
          bestTime: 'De septembre à novembre pour éviter la chaleur intense de l’été.',
          packing: 'Vêtements légers et respirants ; un foulard contre la poussière et le soleil.',
          etiquette: 'Le marchandage est attendu dans les souks — faites-le avec le sourire.',
          transport: 'Marchez dans la médina ; prenez un taxi pour les distances plus longues.',
          phrases: 'La choukran (Non merci — utile dans les souks).',
        },
      },
    },
  },
  place: {
    backTo: 'Retour à',
    perNight: '/ nuit',
    priceRange: 'Gamme de Prix',
    cuisine: 'Cuisine',
    checkAvailability: 'Vérifier Disponibilité',
    bookExperience: 'Réserver',
    noCharge: "Aucun frais pour l'instant",
    highlights: 'Points Forts',
    highlightsList: [
      'Expérience Marocaine Authentique',
      'Service Premium',
      'Emplacement Central',
    ] as string[],
    moreIn: 'Plus de',
    inCity: 'à',
    categoryPlural: {
      stay: 'séjours',
      activity: 'expériences',
      restaurant: 'restaurants',
    },
    categoryLabel: {
      stay: 'Séjour',
      activity: 'Expérience',
      restaurant: 'Gastronomie',
    },
    content: {
      s1: {
        description: "Une magnifique demeure Art déco restaurée, avec des suites luxueuses et un spa haut de gamme au cœur de Casablanca.",
        details: [
          "Situé dans l’un des quartiers les plus élégants de Casablanca, Hôtel particulier Le Doge mêle patrimoine architectural et hospitalité raffinée.",
          "Les voyageurs y trouvent des suites spacieuses, des intérieurs artistiques et une atmosphère intime et luxueuse."
        ] as string[],
      },
      s2: {
        description: "Un luxe en bord d’océan avec vue imprenable sur l’Atlantique, accès plage privé et service cinq étoiles irréprochable.",
        details: [
          "Four Seasons Casablanca offre une expérience balnéaire haut de gamme avec un grand confort, un service attentif et de superbes vues sur la mer.",
          "Sa situation sur la Corniche est idéale pour allier détente et accès facile à la ville."
        ] as string[],
      },
      s3: {
        description: "Une rare expérience authentique de riad au cœur de la Casablanca moderne, avec une cour intérieure paisible.",
        details: [
          "Riad Jnane Sherazade propose un séjour plus intime et plus traditionnel pour les voyageurs en quête de charme marocain dans une grande ville moderne.",
          "Sa cour paisible et son décor classique offrent une belle parenthèse face au rythme animé de Casablanca."
        ] as string[],
      },
      s4: {
        description: "Un hôtel-boutique où chaque suite rend hommage à un artiste célèbre, mêlant culture et confort.",
        details: [
          "Art Palace Suites se distingue par son concept créatif et ses intérieurs élégants inspirés du monde de l’art et du cinéma.",
          "C’est un excellent choix pour ceux qui recherchent un séjour boutique avec du caractère."
        ] as string[],
      },

      a1: {
        description: "Visite guidée de l’une des plus grandes mosquées du monde, construite de façon spectaculaire au-dessus de l’Atlantique.",
        details: [
          "La mosquée Hassan II est l’un des monuments les plus emblématiques du Maroc et une visite incontournable à Casablanca.",
          "Son emplacement face à l’océan, son échelle monumentale et la finesse de son artisanat rendent l’expérience inoubliable."
        ] as string[],
      },
      a2: {
        description: "Découvrez les superbes bâtiments mauresques et Art déco du centre-ville avec un guide local expert.",
        details: [
          "L’architecture de Casablanca révèle un mélange fascinant d’Art déco européen et d’influences décoratives marocaines.",
          "Cette promenade est idéale pour découvrir la ville au-delà de son image moderne."
        ] as string[],
      },
      a3: {
        description: "Profitez des vagues atlantiques régulières avec des instructeurs locaux expérimentés sur la plage de Casablanca.",
        details: [
          "Une session de surf à Casablanca mélange sport, énergie océanique et culture locale du bord de mer.",
          "Que vous soyez débutant ou en progression, la côte atlantique offre un cadre vivant et agréable."
        ] as string[],
      },
      a4: {
        description: "Promenez-vous dans la pittoresque 'Nouvelle Médina' pour acheter artisanat, pâtisseries et épices locales.",
        details: [
          "Le quartier Habous est l’un des endroits les plus charmants de Casablanca, connu pour ses rues ordonnées et son artisanat local.",
          "C’est l’endroit parfait pour une balade culturelle détendue entre boutiques, boulangeries et ambiance marocaine."
        ] as string[],
      },

      r1: {
        description: "Bar emblématique de Casablanca inspiré du film culte, proposant cuisine marocaine et internationale avec jazz live.",
        details: [
          "Rick’s Café est célèbre pour son atmosphère cinématographique, son cadre élégant et son ambiance du soir.",
          "C’est une adresse prisée pour un dîner mémorable avec une touche de glamour ancien."
        ] as string[],
      },
      r2: {
        description: "Installé dans une forteresse historique, réputé pour ses somptueux petits-déjeuners marocains et ses tagines traditionnels.",
        details: [
          "La Sqala associe patrimoine architectural et cuisine marocaine réconfortante dans un cadre verdoyant.",
          "L’adresse est particulièrement appréciée pour le petit-déjeuner et pour découvrir des saveurs locales classiques."
        ] as string[],
      },
      r3: {
        description: "Restaurant chic en bord de mer sur la Corniche, avec superbes couchers de soleil et fruits de mer atlantiques très frais.",
        details: [
          "Le Cabestan offre l’une des expériences gastronomiques les plus élégantes de Casablanca, directement face à l’océan.",
          "C’est l’endroit idéal pour un dîner au coucher du soleil dans une ambiance moderne et raffinée."
        ] as string[],
      },
      r4: {
        description: "Des stands locaux authentiques servant msemen frais, kefta grillée, harira et thé à la menthe sucré.",
        details: [
          "La street food de Derb Sultan met en avant les saveurs populaires de Casablanca, servies rapidement et généreusement.",
          "C’est un excellent choix pour manger local, abordable et plein de caractère."
        ] as string[],
      },

      s5: {
        description: "Un riad primé dans la médina, mêlant luxe moderne et artisanat marocain traditionnel.",
        details: [
          "Euphoriad est reconnu pour associer design raffiné et authenticité de médina dans une atmosphère apaisante.",
          "Ses détails soignés et son ambiance calme en font l’un des meilleurs séjours boutique de Rabat."
        ] as string[],
      },
      s6: {
        description: "Un havre de paix niché dans cinq acres d’agrumes et de jardins luxuriants dans le quartier de Souissi.",
        details: [
          "Villa Mandarine donne l’impression d’un refuge caché au cœur de la capitale, entouré de verdure et de tranquillité.",
          "L’endroit est particulièrement adapté aux voyageurs en quête de calme et de confort élégant."
        ] as string[],
      },
      s7: {
        description: "Un élégant riad du XIXe siècle avec zellige raffiné, piscine sur le toit et vues superbes sur la médina.",
        details: [
          "Riad Kalaa offre un bel équilibre entre charme patrimonial et confort moderne avec une forte identité visuelle.",
          "Son toit-terrasse et son architecture en font une base mémorable pour découvrir l’ancienne ville."
        ] as string[],
      },
      s8: {
        description: "Un grand hôtel cinq étoiles au milieu de 17 acres de jardins andalous impeccables dans le quartier le plus prestigieux de Rabat.",
        details: [
          "Sofitel Jardin des Roses est l’un des hôtels les plus luxueux de Rabat, apprécié pour son ampleur, son service et ses jardins.",
          "Il convient parfaitement aux voyageurs recherchant une expérience haut de gamme dans un cadre paisible."
        ] as string[],
      },

      a5: {
        description: "Promenez-vous dans les ruelles bleu et blanc de cette ancienne forteresse tournée vers l’Atlantique et ses jardins andalous.",
        details: [
          "La Kasbah des Oudayas est l’un des lieux les plus photogéniques et historiques de Rabat.",
          "Ses ruelles bleues, ses vues sur l’océan et ses jardins tranquilles en font un incontournable."
        ] as string[],
      },
      a6: {
        description: "Explorez les magnifiques ruines romaines et mérinides, habitées par des cigognes et entourées d’agrumes.",
        details: [
          "Chellah offre une atmosphère unique où se rencontrent archéologie, végétation et silence.",
          "C’est une visite idéale pour les voyageurs attirés par l’histoire et les lieux contemplatifs."
        ] as string[],
      },
      a7: {
        description: "Détendez-vous dans les jardins andalous en terrasses de Rabat, remplis d’orangers, de roses et de fontaines paisibles.",
        details: [
          "Les jardins andalous sont parfaits pour une pause calme entre deux visites de la ville.",
          "Ils révèlent une facette plus douce et élégante de Rabat."
        ] as string[],
      },
      a8: {
        description: "Une alternative plus calme à Marrakech — parfaite pour découvrir tapis, céramiques et maroquinerie sans pression.",
        details: [
          "La médina de Rabat offre une expérience de promenade et de shopping plus détendue que d’autres grands centres touristiques.",
          "C’est un excellent endroit pour découvrir l’artisanat sans l’intensité des souks les plus fréquentés."
        ] as string[],
      },

      r5: {
        description: "Une institution très appréciée à Rabat pour ses tagines mijotés, son couscous léger et son accueil marocain chaleureux.",
        details: [
          "Dar Naji est apprécié pour ses portions généreuses, ses recettes traditionnelles et son cadre accueillant.",
          "C’est une très bonne adresse pour savourer un repas marocain classique à Rabat."
        ] as string[],
      },
      r6: {
        description: "Dînez à bord d’un superbe bateau en bois amarré sur le Bou Regreg, avec vue sur la Kasbah.",
        details: [
          "Le Dhow propose l’un des cadres les plus originaux de Rabat, entre ville et rivière.",
          "Il associe ambiance, fruits de mer et expérience du soir mémorable."
        ] as string[],
      },
      r7: {
        description: "Un charmant café de cour prisé par la scène créative de Rabat, idéal pour le brunch et les déjeuners tranquilles.",
        details: [
          "Ty Potes est connu pour son ambiance détendue et son style café, parfait pour un repas de journée tranquille.",
          "L’endroit attire aussi bien les habitants que les visiteurs."
        ] as string[],
      },
      r8: {
        description: "Goûtez makouda, escargots en bouillon et sfenj au miel chez les vendeurs locaux de Rabat.",
        details: [
          "Les stands de nourriture de Rabat offrent des bouchées rapides et savoureuses ancrées dans la culture culinaire du quotidien.",
          "Ils sont parfaits pour les voyageurs curieux en quête de saveurs authentiques à petit prix."
        ] as string[],
      },

      s9: {
        description: "Le palace légendaire de Marrakech — une icône depuis 1923 — offrant opulence, vastes jardins et grandeur intemporelle.",
        details: [
          "La Mamounia est l’un des hôtels les plus célèbres du Maroc, symbole de luxe, de prestige et d’élégance historique.",
          "Ses jardins, son service et son architecture créent une expérience marrakchie inoubliable."
        ] as string[],
      },
      s10: {
        description: "Un riad-boutique vibrant rempli d’art marocain contemporain, avec piscine sur le toit et superbes vues sur la médina.",
        details: [
          "El Fenn associe style audacieux et intimité boutique pour une expérience très visuelle et élégante.",
          "Ses toits-terrasses et ses intérieurs soigneusement conçus le rendent particulièrement marquant."
        ] as string[],
      },
      s11: {
        description: "Célèbre pour son bassin émeraude et sa cour fleurie luxuriante au cœur de l’ancienne médina.",
        details: [
          "Riad Yasmine est apprécié pour son design très photogénique et son atmosphère intime au sein de la médina.",
          "C’est un excellent choix pour un séjour plein de charme à Marrakech."
        ] as string[],
      },
      s12: {
        description: "Dormez sous un ciel étoilé dans une tente de luxe de style bédouin dans le désert minéral près de Marrakech.",
        details: [
          "Agafay Desert Camp permet de vivre une échappée désertique près de Marrakech sans aller jusqu’au Sahara.",
          "C’est idéal pour ceux qui recherchent silence, étoiles et confort en pleine nature."
        ] as string[],
      },

      a9: {
        description: "Promenez-vous dans le célèbre jardin botanique bleu cobalt d’Yves Saint Laurent, avec cactus rares et musée berbère.",
        details: [
          "Le Jardin Majorelle est l’un des lieux culturels et visuels les plus emblématiques de Marrakech.",
          "Ses couleurs, ses collections végétales et son héritage artistique en font une visite incontournable."
        ] as string[],
      },
      a10: {
        description: "Explorez les souks labyrinthiques de la médina avec un guide expérimenté — épices, lanternes, cuir et argent.",
        details: [
          "Une visite guidée des souks aide à comprendre les rythmes, les savoir-faire et les secrets de la médina de Marrakech.",
          "C’est une expérience sensorielle riche et une belle manière de découvrir les lieux avec confiance."
        ] as string[],
      },
      a11: {
        description: "Abandonnez-vous au rituel ancestral du hammam — vapeur, savon noir et massage à l’huile d’argan dans un décor palatial.",
        details: [
          "Le hammam traditionnel est l’une des expériences bien-être les plus emblématiques du Maroc.",
          "Cette activité mêle détente, purification et immersion dans les traditions locales."
        ] as string[],
      },
      a12: {
        description: "Faites les courses dans les souks à l’aube puis apprenez à préparer tagine, pastilla et thé à la menthe avec un chef local.",
        details: [
          "Un cours de cuisine marocaine est à la fois culturel et pratique, du marché jusqu’au plat final.",
          "C’est une manière enrichissante de découvrir l’hospitalité et les traditions culinaires du pays."
        ] as string[],
      },

      r9: {
        description: "Un restaurant rooftop chic sur plusieurs niveaux, revisitant les classiques marocains avec une touche contemporaine.",
        details: [
          "Nomad est l’une des tables modernes les plus connues de Marrakech, entre tradition et style contemporain.",
          "Son rooftop et sa cuisine revisitée en font une adresse très appréciée des voyageurs."
        ] as string[],
      },
      r10: {
        description: "Un restaurant-jardin secret dans un riad du XVIe siècle, ombragé par des bananiers et peuplé de tortues.",
        details: [
          "Le Jardin offre une parenthèse verte et calme au milieu de l’agitation de la médina.",
          "C’est l’endroit idéal pour un déjeuner ou un dîner détendu dans un cadre historique."
        ] as string[],
      },
      r11: {
        description: "Le plus grand théâtre culinaire à ciel ouvert du Maroc — des centaines de stands fumants servant de tout, des escargots aux brochettes.",
        details: [
          "Jemaa el-Fnaa la nuit est l’une des scènes culinaires les plus vibrantes du Maroc, pleine de fumée, de voix et de parfums.",
          "C’est parfait pour les voyageurs à la recherche d’une expérience street food intense et inoubliable."
        ] as string[],
      },
      r12: {
        description: "Une expérience culinaire légendaire dans un palais-riad éclairé à la bougie, avec six services de cuisine marocaine traditionnelle.",
        details: [
          "Dar Yacout est réputé pour son spectacle, son hospitalité et son ambiance théâtrale très marocaine.",
          "C’est une excellente option pour une soirée haut de gamme et mémorable à Marrakech."
        ] as string[],
      },
    },
  },
  favorites: {
    title: 'Vos Sélections Enregistrées',
    subtitle: 'Une collection personnelle de vos destinations marocaines préférées.',
    emptyTitle: "Aucun favori pour l'instant",
    emptyMessage: "Commencez à explorer et appuyez sur l'icône cœur pour sauvegarder des lieux.",
    emptyCta: 'Explorer les Destinations',
  },
  search: {
    title: 'Découvrir le Maroc',
    subtitle: 'Trouvez exactement ce que vous cherchez.',
    placeholder: 'Rechercher par nom ou mot-clé...',
    allCities: 'Toutes les Villes',
    allTypes: 'Tous les Types',
    staysLabel: 'Séjours & Riads',
    experiencesLabel: 'Expériences',
    diningLabel: 'Gastronomie',
    result: 'Résultat',
    results: 'Résultats',
    found: 'trouvé',
    noResultsTitle: 'Aucun endroit trouvé',
    noResultsMsg: "Essayez d'ajuster vos filtres ou termes de recherche.",
    clearFilters: 'Effacer les Filtres',
  },
  card: {
    freeToExplore: 'Accès libre',
    details: 'Détails',
    perNight: '/ nuit',
    category: {
      stay: 'Séjour',
      activity: 'Expérience',
      restaurant: 'Gastronomie',
    },
  },
  footer: {
    tagline:
      'Votre guide premium des merveilles du Maroc. Découvrez des séjours sélectionnés, des activités authentiques et des expériences culinaires inoubliables.',
    destinations: 'Destinations',
    explore: 'Explorer',
    staysRiads: 'Séjours & Riads',
    experiences: 'Expériences',
    dining: 'Gastronomie',
    yourFavorites: 'Vos Favoris',
    allRightsReserved: 'Tous droits réservés.',
  },
};

export const translations: Record<Lang, typeof en> = { en, fr };
export type T = typeof en;