export type Category = 'stay' | 'activity' | 'restaurant';

export interface Place {
  id: string;
  name: string;
  cityId: string;
  category: Category;
  priceRange?: string;
  pricePerNight?: number;
  rating: number;
  description: string;
  imageUrl: string;
  cuisine?: string;
  location?: string;
}

export interface City {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
}

export const CITIES: City[] = [
  {
    id: "c1",
    slug: "casablanca",
    name: "Casablanca",
    imageUrl: "https://images.unsplash.com/photo-1538230575309-59dfc388ae36?q=80&w=874&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "c2",
    slug: "rabat",
    name: "Rabat",
    imageUrl: "https://images.unsplash.com/photo-1598022124758-26d09adcb7b6?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "c3",
    slug: "marrakech",
    name: "Marrakech",
    imageUrl: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=1200&q=80",
  }
];

export const PLACES: Place[] = [
  // CASABLANCA STAYS
  {
    id: "s1", name: "Hôtel particulier Le Doge", cityId: "c1", category: "stay",
    pricePerNight: 250, rating: 4.8,
    description: "A beautifully restored Art Deco mansion offering luxurious suites and a world-class spa in the heart of Casablanca.",
    imageUrl: "https://images.trvl-media.com/lodging/4000000/3980000/3974500/3974430/7b99e558.jpg?impolicy=resizecrop&rw=1200&ra=fit",
    location: "Gauthier District"
  },
  {
    id: "s2", name: "Four Seasons Casablanca", cityId: "c1", category: "stay",
    pricePerNight: 420, rating: 4.9,
    description: "Oceanfront luxury with breathtaking Atlantic views, private beach access, and impeccable five-star service.",
    imageUrl: "https://images.trvl-media.com/lodging/13000000/12300000/12294700/12294696/3fcd5c83.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill",
    location: "Corniche"
  },
  {
    id: "s3", name: "Riad Jnane Sherazade", cityId: "c1", category: "stay",
    pricePerNight: 120, rating: 4.6,
    description: "A rare authentic riad experience hidden in the heart of modern Casablanca, with a peaceful inner courtyard.",
    imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/05/2e/29/35/magnifique-demeure.jpg?w=1000&h=-1&s=1",
    location: "Habous Quarter"
  },
  {
    id: "s4", name: "Art Palace Suites", cityId: "c1", category: "stay",
    pricePerNight: 185, rating: 4.7,
    description: "Boutique hotel where each suite is uniquely dedicated to a famous artist, blending culture and comfort.",
    imageUrl: "https://ak-d.tripcdn.com/images/0205p1200096i0yodA9AE_R_600_400_R5.webp",
    location: "Gauthier"
  },

  // CASABLANCA ACTIVITIES
  {
    id: "a1", name: "Hassan II Mosque Tour", cityId: "c1", category: "activity",
    rating: 5.0,
    description: "Guided tour of one of the world's largest mosques, built dramatically over the Atlantic Ocean.",
    imageUrl: "https://www.barcelo.com/guia-turismo/wp-content/uploads/2022/10/casablanca-mezquita-hassan-ii-888-2.jpg",
    location: "Corniche"
  },
  {
    id: "a2", name: "Art Deco Architecture Walk", cityId: "c1", category: "activity",
    rating: 4.5,
    description: "Explore the downtown core's stunning 1930s Mauresque and Art Deco buildings with an expert local guide.",
    imageUrl: "https://citiz-on.com/wp-content/uploads/2025/07/3-1.jpg",
    location: "Downtown"
  },
  {
    id: "a3", name: "Atlantic Surf Lesson", cityId: "c1", category: "activity",
    rating: 4.6,
    description: "Catch consistent Atlantic waves with experienced local surf instructors on Casablanca's beach.",
    imageUrl: "https://wecasablanca.com/sites/default/files/2021-07/Lot-surf/AinDiabSurfSchool/1.jpg",
    location: "Ain Diab"
  },
  {
    id: "a4", name: "Habous Quarter Exploration", cityId: "c1", category: "activity",
    rating: 4.4,
    description: "Wander the picturesque 'New Medina' to shop for traditional crafts, pastries, and local spices.",
    imageUrl: "https://cdn.getyourguide.com/img/tour/24227e4307f51b063034040b21a75731af932cb4c5197c86ec3615b4f438cefd.png/68.jpg",
    location: "Quartier Habous"
  },

  // CASABLANCA RESTAURANTS
  {
    id: "r1", name: "Rick's Café", cityId: "c1", category: "restaurant",
    cuisine: "International / Moroccan", priceRange: "$$$", rating: 4.7,
    description: "Iconic Casablanca bar inspired by the classic film, serving Moroccan and international cuisine with live jazz.",
    imageUrl: "https://www.rickscafe.ma/wp-content/uploads/2024/09/IMG_1297-675x450.jpg",
    location: "Old Medina edge"
  },
  {
    id: "r2", name: "La Sqala", cityId: "c1", category: "restaurant",
    cuisine: "Traditional Moroccan", priceRange: "$$", rating: 4.8,
    description: "Set inside a historic fortress, celebrated for lavish Moroccan breakfasts and traditional tagines.",
    imageUrl: "https://sqala.ma/wp-content/uploads/2025/04/GOUTERSQALA-1024x800.jpg",
    location: "Boulevard des Almohades"
  },
  {
    id: "r3", name: "Le Cabestan", cityId: "c1", category: "restaurant",
    cuisine: "Seafood / Mediterranean", priceRange: "$$$", rating: 4.6,
    description: "Chic oceanfront dining on the Corniche with stunning sunset views and the freshest Atlantic seafood.",
    imageUrl: "https://www.le-cabestan.com/wp-content/uploads/2023/10/0D7A2439-1.jpg",
    location: "Corniche"
  },
  {
    id: "r4", name: "Derb Sultan Street Food", cityId: "c1", category: "restaurant",
    cuisine: "Street Food", priceRange: "$", rating: 4.5,
    description: "Authentic local stalls serving fresh msemen, grilled kefta, harira soup, and sweet mint tea.",
    imageUrl: "https://passportandstamps.com/wp-content/uploads/2025/08/Preparation-of-mixed-sandwich.webp",
    location: "Derb Sultan"
  },

  // RABAT STAYS
  {
    id: "s5", name: "Euphoriad", cityId: "c2", category: "stay",
    pricePerNight: 160, rating: 4.8,
    description: "An award-winning riad in the Medina blending modern luxury with traditional Moroccan craftsmanship.",
    imageUrl: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/83848267.jpg?k=46a3fa3b1e7b121d50c64c532f1469ba2db729f7c172dfc4c70c927e728b0f14&o=",
    location: "Medina"
  },
  {
    id: "s6", name: "Villa Mandarine", cityId: "c2", category: "stay",
    pricePerNight: 225, rating: 4.7,
    description: "A serene oasis of calm set within five acres of citrus groves and lush gardens in the Souissi district.",
    imageUrl: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/261586070.jpg?k=9fe4eea4ffb2edfbc36a8f5ca8bf14d40147ebf9c21baaeab5ad1535e1fca66f&o=",
    location: "Souissi"
  },
  {
    id: "s7", name: "Riad Kalaa", cityId: "c2", category: "stay",
    pricePerNight: 140, rating: 4.6,
    description: "Elegant 19th-century riad with intricate zellige tilework, a rooftop pool, and sweeping medina views.",
    imageUrl: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/325666223.jpg?k=f708ab28f7fd803f1e3b76d25609407563906bb8a9fe526f0b4b710782d809a0&o=",
    location: "Medina"
  },
  {
    id: "s8", name: "Sofitel Jardin des Roses", cityId: "c2", category: "stay",
    pricePerNight: 360, rating: 4.9,
    description: "Five-star grandeur set within 17 acres of manicured Andalusian gardens in Rabat's most prestigious district.",
    imageUrl: "https://x.cdrst.com/foto/hotel-sf/12097ca0/granderesp/foto-hotel-120971f6.jpg",
    location: "Souissi"
  },

  // RABAT ACTIVITIES
  {
    id: "a5", name: "Kasbah of the Udayas", cityId: "c2", category: "activity",
    rating: 4.9,
    description: "Stroll through the iconic blue-and-white alleys of this ancient Atlantic-facing fortress and its Andalusian gardens.",
    imageUrl: "https://usercontent.one/wp/www.desertmoroccoadventure.com/wp-content/uploads/2016/06/Kasbah-of-the-Udayas.png?media=1774803146",
    location: "Kasbah"
  },
  {
    id: "a6", name: "Chellah Necropolis Tour", cityId: "c2", category: "activity",
    rating: 4.7,
    description: "Explore the hauntingly beautiful Roman and Merinid ruins, home to resident storks and citrus trees.",
    imageUrl: "https://www.barcelo.com/guia-turismo/wp-content/uploads/2024/04/necropolis-de-chellah-3.jpg",
    location: "Chellah"
  },
  {
    id: "a7", name: "Andalusian Gardens", cityId: "c2", category: "activity",
    rating: 4.8,
    description: "Unwind in Rabat's terraced botanical gardens, filled with orange trees, rose bushes, and quiet fountains.",
    imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/08/0b/75/4d/andalusian-gardens.jpg?w=900&h=500&s=1",
    location: "Near Kasbah"
  },
  {
    id: "a8", name: "Rabat Medina Souk Walk", cityId: "c2", category: "activity",
    rating: 4.5,
    description: "A calmer, pressure-free alternative to Marrakech — perfect for browsing rugs, ceramics, and leather goods.",
    imageUrl: "https://photos.smugmug.com/Maroc-Lovers/Rabat/Medina/i-HHHDB92/0/KcpTt9vwjxjzbqh7GT2L7B3jWMPxwgQk8drVHDLD5/L/old-town-rabat-morocco-12-L.jpg",
    location: "Medina"
  },

  // RABAT RESTAURANTS
  {
    id: "r5", name: "Dar Naji", cityId: "c2", category: "restaurant",
    cuisine: "Traditional Moroccan", priceRange: "$$", rating: 4.6,
    description: "A beloved Rabat institution for authentic slow-cooked tagines, fluffy couscous, and warm Moroccan hospitality.",
    imageUrl: "https://lh3.googleusercontent.com/p/AF1QipMDDXmtdSzcY0IM6kPHGZeTnuHSO9x2IpgG6Qgr=s1600-w640",
    location: "Bab El Had"
  },
  {
    id: "r6", name: "Le Dhow", cityId: "c2", category: "restaurant",
    cuisine: "Seafood / Mediterranean", priceRange: "$$$", rating: 4.7,
    description: "Dine aboard a beautiful replica wooden ship moored on the Bou Regreg river, with views of the Kasbah.",
    imageUrl: "https://ledhow.com/wp-content/uploads/2024/08/2.jpg",
    location: "Riverfront"
  },
  {
    id: "r7", name: "Ty Potes", cityId: "c2", category: "restaurant",
    cuisine: "French / Café", priceRange: "$$", rating: 4.5,
    description: "A charming courtyard café beloved by Rabat's creative crowd, ideal for brunch and relaxed afternoon lunches.",
    imageUrl: "https://lh3.googleusercontent.com/proxy/BCFYAIk8W5AaiJx5Vwwgy_KmTNFJkLu4tRpEGHdShUvZvTTHDuTIKK4u5UvYqwqLu6G7wc7twkoD1wd_G-4",
    location: "Hassan"
  },
  {
    id: "r8", name: "Medina Food Stalls", cityId: "c2", category: "restaurant",
    cuisine: "Street Food", priceRange: "$", rating: 4.8,
    description: "Grab fresh makouda fritters, snails in broth, and honey-soaked sfenj doughnuts from Rabat's local vendors.",
    imageUrl: "https://afktravel.com/wp-content/uploads/2015/05/rabat-16-delicacies.jpg",
    location: "Medina"
  },

  // MARRAKECH STAYS
  {
    id: "s9", name: "La Mamounia", cityId: "c3", category: "stay",
    pricePerNight: 850, rating: 5.0,
    description: "The legendary palace hotel — a Marrakech icon since 1923 — offering unrivalled opulence, vast gardens, and timeless grandeur.",
    imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2b/fe/c4/81/hotel-entrance.jpg?w=900&h=500&s=1",
    location: "Hivernage"
  },
  {
    id: "s10", name: "El Fenn", cityId: "c3", category: "stay",
    pricePerNight: 460, rating: 4.9,
    description: "A vibrant boutique riad filled with contemporary Moroccan art, a rooftop pool, and sweeping medina panoramas.",
    imageUrl: "https://el-fenn.b-cdn.net/wp-content/uploads/2025/11/Moggi-Photography-Evening-Restaurant-1.jpg",
    location: "Medina"
  },
  {
    id: "s11", name: "Riad Yasmine", cityId: "c3", category: "stay",
    pricePerNight: 185, rating: 4.8,
    description: "Instagram-famous for its stunning emerald plunge pool and lush flower-draped courtyard in the ancient medina.",
    imageUrl: "https://www.riad-yasmine.com/wp-content/uploads/2018/02/PATIO-1024x664.jpg",
    location: "Medina"
  },
  {
    id: "s12", name: "Agafay Desert Camp", cityId: "c3", category: "stay",
    pricePerNight: 310, rating: 4.7,
    description: "Sleep under a sky blazing with stars in a luxury Bedouin-style tent in the raw stone desert near Marrakech.",
    imageUrl: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/780213830.jpg?k=49cc1d892cd935d628fcec16e44a29b6574d1ffabc7c5ab90cc45f09014b9afd&o=",
    location: "Agafay Desert"
  },

  // MARRAKECH ACTIVITIES
  {
    id: "a9", name: "Jardin Majorelle", cityId: "c3", category: "activity",
    rating: 4.9,
    description: "Wander through Yves Saint Laurent's iconic cobalt-blue botanical garden, home to rare cacti and a Berber museum.",
    imageUrl: "https://riad-selouane.net/wp-content/uploads/blog/jardin-majorelle/jardin-majorelle-marrakesch-garten-yves-saint-laurent-blogpost.jpg",
    location: "Gueliz"
  },
  {
    id: "a10", name: "Souk Exploration Tour", cityId: "c3", category: "activity",
    rating: 4.8,
    description: "Navigate the medina's labyrinthine markets with a knowledgeable guide — spices, lanterns, leather, and silver.",
    imageUrl: "https://www.voyage-maroc.com/cdn/ma-public/souk-MAX-w1000h600.jpg",
    location: "Medina"
  },
  {
    id: "a11", name: "Traditional Hammam & Spa", cityId: "c3", category: "activity",
    rating: 4.9,
    description: "Surrender to the ancient ritual of a hammam — steam, black soap scrub, and argan oil massage in a palace setting.",
    imageUrl: "https://appart-marrakech.com/en/wp-content/uploads/2018/03/hammam.jpg",
    location: "Various"
  },
  {
    id: "a12", name: "Moroccan Cooking Class", cityId: "c3", category: "activity",
    rating: 4.7,
    description: "Shop the souks at dawn, then learn to craft perfect tagine, pastilla, and mint tea with a local family chef.",
    imageUrl: "https://media-cdn.tripadvisor.com/media/attractions-splice-spp-674x446/06/b6/3c/2b.jpg",
    location: "Medina"
  },

  // MARRAKECH RESTAURANTS
  {
    id: "r9", name: "Nomad", cityId: "c3", category: "restaurant",
    cuisine: "Modern Moroccan", priceRange: "$$$", rating: 4.8,
    description: "A chic multi-level rooftop restaurant reimagining Moroccan classics with contemporary flair and medina rooftop views.",
    imageUrl: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/32/b3/33/47/caption.jpg?w=1200&h=-1&s=1",
    location: "Rahba Kedima"
  },
  {
    id: "r10", name: "Le Jardin", cityId: "c3", category: "restaurant",
    cuisine: "Moroccan / European", priceRange: "$$", rating: 4.6,
    description: "A lush secret garden restaurant inside a 16th-century riad, shaded by banana trees and resident tortoises.",
    imageUrl: "https://www.theworlds50best.com/discovery/filestore/jpeg/Le_Jardin_Food.jpeg",
    location: "Medina"
  },
  {
    id: "r11", name: "Jemaa el-Fnaa Night Market", cityId: "c3", category: "restaurant",
    cuisine: "Street Food", priceRange: "$", rating: 4.9,
    description: "Morocco's greatest open-air dining theatre — hundreds of smoke-filled stalls serving everything from snails to lamb brochettes.",
    imageUrl: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjHWIajdg_PyGYAtZiYb1FmZTP1dQlqvJI_3xDgot-FayqCcyzVczbOURycKGMYiO3eupkARN4lNW2V45gStyYNyeguGJtlg7Rtd5hVrstoVCgykLzmPdFaENzkt2BBLtii00CJReVqAZU/s1600/Workman+resto+at+end+of+world+Marrakech1.jpg",
    location: "Jemaa el-Fnaa"
  },
  {
    id: "r12", name: "Dar Yacout", cityId: "c3", category: "restaurant",
    cuisine: "Haute Traditional Moroccan", priceRange: "$$$$", rating: 4.8,
    description: "A legendary palace-restaurant experience — six courses of traditional Moroccan cuisine served in a candlelit riad.",
    imageUrl: "https://daryacout.com/wp-content/uploads/2022/09/DSC09331new.jpg",
    location: "Medina"
  },
];
