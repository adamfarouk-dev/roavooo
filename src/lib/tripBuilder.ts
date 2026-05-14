export type TripStyle = "budget" | "balanced" | "luxury";

export type TripBuilderPlace = {
  id: string;
  name: string;
  category: "stay" | "activity" | "restaurant";
  price_per_night?: number | null;
  estimated_cost?: number | null;
  estimated_cost_per_person?: number | null;
  rating?: number | null;
};

export type TripBuilderDay = {
  activities: TripBuilderPlace[];
  restaurants: TripBuilderPlace[];
  cost: number;
};

export type BuildTripInput = {
  cityPlaces: TripBuilderPlace[];
  budget: number;
  days: number;
  style: TripStyle;
};

export type BuildTripResult = {
  stay: TripBuilderPlace | null;
  days: TripBuilderDay[];
  total: number;
  remaining: number;
};

const MIN_REMAINING_BUDGET_RATIO = 0.2;

const getPlaceCost = (place: TripBuilderPlace) => {
  if (place.category === "stay") return place.price_per_night ?? null;
  if (place.category === "activity") return place.estimated_cost ?? null;
  return place.estimated_cost_per_person ?? null;
};

const byPriceAsc = (a: TripBuilderPlace, b: TripBuilderPlace) => {
  const aCost = getPlaceCost(a) ?? Number.POSITIVE_INFINITY;
  const bCost = getPlaceCost(b) ?? Number.POSITIVE_INFINITY;

  return (
    aCost - bCost ||
    (b.rating ?? 0) - (a.rating ?? 0) ||
    a.name.localeCompare(b.name) ||
    a.id.localeCompare(b.id)
  );
};

const byPriceDesc = (a: TripBuilderPlace, b: TripBuilderPlace) => {
  const aCost = getPlaceCost(a) ?? Number.NEGATIVE_INFINITY;
  const bCost = getPlaceCost(b) ?? Number.NEGATIVE_INFINITY;

  return (
    bCost - aCost ||
    (b.rating ?? 0) - (a.rating ?? 0) ||
    a.name.localeCompare(b.name) ||
    a.id.localeCompare(b.id)
  );
};

const byBalancedValue = (a: TripBuilderPlace, b: TripBuilderPlace) => {
  const aCost = getPlaceCost(a) ?? Number.POSITIVE_INFINITY;
  const bCost = getPlaceCost(b) ?? Number.POSITIVE_INFINITY;

  return (
    (b.rating ?? 0) - (a.rating ?? 0) ||
    aCost - bCost ||
    a.name.localeCompare(b.name) ||
    a.id.localeCompare(b.id)
  );
};

const getSortedPlaces = (
  places: TripBuilderPlace[],
  style: TripStyle,
  forceCheapest: boolean
) => {
  if (forceCheapest || style === "budget") return [...places].sort(byPriceAsc);
  if (style === "luxury") return [...places].sort(byPriceDesc);
  return [...places].sort(byBalancedValue);
};

const pickStay = (
  stays: TripBuilderPlace[],
  style: TripStyle,
  budget: number,
  days: number
) => {
  const sortedStays = stays
    .filter((stay) => {
      const nightlyPrice = stay.price_per_night;
      return nightlyPrice != null && nightlyPrice * days <= budget;
    })
    .sort(byPriceAsc);

  if (sortedStays.length === 0) return null;
  if (style === "budget") return sortedStays[0];
  if (style === "luxury") return sortedStays[sortedStays.length - 1];

  return sortedStays[Math.floor(sortedStays.length / 2)];
};

const getNextAffordablePlace = ({
  places,
  usedPlaceIds,
  dayPlaceIds,
  availableBudget,
  style,
  forceCheapest,
}: {
  places: TripBuilderPlace[];
  usedPlaceIds: Set<string>;
  dayPlaceIds: Set<string>;
  availableBudget: number;
  style: TripStyle;
  forceCheapest: boolean;
}) => {
  const sortedPlaces = getSortedPlaces(places, style, forceCheapest);

  const unusedAffordablePlace = sortedPlaces.find((place) => {
    const cost = getPlaceCost(place);
    return (
      cost != null &&
      cost <= availableBudget &&
      !usedPlaceIds.has(place.id) &&
      !dayPlaceIds.has(place.id)
    );
  });

  if (unusedAffordablePlace) return unusedAffordablePlace;

  return (
    sortedPlaces.find((place) => {
      const cost = getPlaceCost(place);
      return cost != null && cost <= availableBudget && !dayPlaceIds.has(place.id);
    }) ?? null
  );
};

export function buildTrip({
  cityPlaces,
  budget,
  days,
  style,
}: BuildTripInput): BuildTripResult {
  const safeBudget = Math.max(0, budget);
  const safeDays = Math.max(1, Math.floor(days));
  const perDayBudget = safeBudget / safeDays;

  const stays = cityPlaces.filter(
    (place) => place.category === "stay" && place.price_per_night != null
  );
  const activities = cityPlaces.filter(
    (place) => place.category === "activity" && place.estimated_cost != null
  );
  const restaurants = cityPlaces.filter(
    (place) =>
      place.category === "restaurant" && place.estimated_cost_per_person != null
  );

  const stay = pickStay(stays, style, safeBudget, safeDays);
  const stayCost = stay ? (stay.price_per_night ?? 0) * safeDays : 0;
  let remainingBudget = safeBudget;
  let total = 0;

  if (stay && stayCost <= remainingBudget) {
    remainingBudget -= stayCost;
    total += stayCost;
  }

  const usedActivityIds = new Set<string>();
  const usedRestaurantIds = new Set<string>();
  const plannedDays: TripBuilderDay[] = [];

  for (let dayIndex = 0; dayIndex < safeDays; dayIndex += 1) {
    const day: TripBuilderDay = {
      activities: [],
      restaurants: [],
      cost: 0,
    };
    const dayActivityIds = new Set<string>();
    const dayRestaurantIds = new Set<string>();

    const dayBudgetTarget = Math.min(perDayBudget, remainingBudget);
    const lowBudgetMode =
      remainingBudget < safeBudget * MIN_REMAINING_BUDGET_RATIO;

    const addPlaceToDay = (
      place: TripBuilderPlace,
      bucket: "activities" | "restaurants",
      usedPlaceIds: Set<string>,
      dayPlaceIds: Set<string>
    ) => {
      const cost = getPlaceCost(place);
      const availableBudget = Math.min(
        remainingBudget,
        Math.max(0, dayBudgetTarget - day.cost)
      );
      if (cost == null || cost > availableBudget) return false;

      day[bucket].push(place);
      day.cost += cost;
      total += cost;
      remainingBudget -= cost;
      usedPlaceIds.add(place.id);
      dayPlaceIds.add(place.id);
      return true;
    };

    const activityTarget = style === "budget" ? 1 : 2;
    while (day.activities.length < activityTarget) {
      const nextActivity = getNextAffordablePlace({
        places: activities,
        usedPlaceIds: usedActivityIds,
        dayPlaceIds: dayActivityIds,
        availableBudget: Math.min(
          remainingBudget,
          Math.max(0, dayBudgetTarget - day.cost)
        ),
        style,
        forceCheapest: lowBudgetMode || day.cost >= dayBudgetTarget,
      });

      if (!nextActivity) break;
      if (
        !addPlaceToDay(
          nextActivity,
          "activities",
          usedActivityIds,
          dayActivityIds
        )
      ) {
        break;
      }
      if (day.cost >= dayBudgetTarget && day.activities.length >= 1) break;
    }

    const restaurantTarget = style === "budget" ? 1 : 2;
    while (day.restaurants.length < restaurantTarget) {
      const nextRestaurant = getNextAffordablePlace({
        places: restaurants,
        usedPlaceIds: usedRestaurantIds,
        dayPlaceIds: dayRestaurantIds,
        availableBudget: Math.min(
          remainingBudget,
          Math.max(0, dayBudgetTarget - day.cost)
        ),
        style,
        forceCheapest: lowBudgetMode || day.cost >= dayBudgetTarget,
      });

      if (!nextRestaurant) break;
      if (
        !addPlaceToDay(
          nextRestaurant,
          "restaurants",
          usedRestaurantIds,
          dayRestaurantIds
        )
      ) {
        break;
      }
      if (day.cost >= dayBudgetTarget && day.restaurants.length >= 1) break;
    }

    plannedDays.push(day);
  }

  return {
    stay,
    days: plannedDays,
    total,
    remaining: remainingBudget,
  };
}
