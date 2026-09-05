import type { Division } from "@/lib/types";

export const divisions: Division[] = [
  {
    id: "dhaka",
    name: "Dhaka",
    nameBn: "ঢাকা",
    districts: [
      {
        id: "dhaka-metro",
        name: "Dhaka Metro",
        nameBn: "ঢাকা মetro",
        neighborhoods: [
          { id: "gulshan", name: "Gulshan", nameBn: "গুলশান" },
          { id: "banani", name: "Banani", nameBn: "বনানী" },
          { id: "motijheel", name: "Motijheel", nameBn: "মতিঝিল" },
          { id: "mirpur", name: "Mirpur", nameBn: "মিরপুর" },
          { id: "uttara", name: "Uttara", nameBn: "উত্তরা" },
          { id: "dhanmondi", name: "Dhanmondi", nameBn: "ধানমন্ডি" },
          { id: "tejgaon", name: "Tejgaon", nameBn: "তেজগাঁও" },
        ],
      },
      { id: "gazipur", name: "Gazipur", nameBn: "গাজীপুর" },
      { id: "narayanganj", name: "Narayanganj", nameBn: "নারায়ণগঞ্জ" },
    ],
  },
  {
    id: "chittagong",
    name: "Chittagong",
    nameBn: "চট্টগ্রাম",
    districts: [
      { id: "chittagong-metro", name: "Chittagong Metro", nameBn: "চট্টগ্রাম মetro" },
      { id: "coxs-bazar", name: "Cox's Bazar", nameBn: "কক্সবাজার" },
    ],
  },
  {
    id: "rajshahi",
    name: "Rajshahi",
    nameBn: "রাজশাহী",
    districts: [{ id: "rajshahi-metro", name: "Rajshahi Metro", nameBn: "রাজশাহী মetro" }],
  },
  {
    id: "khulna",
    name: "Khulna",
    nameBn: "খুলনা",
    districts: [{ id: "khulna-metro", name: "Khulna Metro", nameBn: "খুলনা মetro" }],
  },
  {
    id: "sylhet",
    name: "Sylhet",
    nameBn: "সিলেট",
    districts: [{ id: "sylhet-metro", name: "Sylhet Metro", nameBn: "সিলেট মetro" }],
  },
];

function locName(
  item: { name: string; nameBn?: string } | undefined,
  fallback: string,
  locale?: string
) {
  if (!item) return fallback;
  return locale === "bn" ? (item.nameBn ?? item.name) : item.name;
}

export function getLocationDisplay(
  location: {
    divisionId: string;
    districtId: string;
    neighborhoodId?: string;
  },
  locale?: string
): { division: string; district: string; neighborhood?: string; full: string } {
  const division = divisions.find((d) => d.id === location.divisionId);
  const district = division?.districts.find((d) => d.id === location.districtId);
  const neighborhood = district?.neighborhoods?.find(
    (n) => n.id === location.neighborhoodId
  );

  const divisionName = locName(division, location.divisionId, locale);
  const districtName = locName(district, location.districtId, locale);
  const neighborhoodName = neighborhood
    ? locName(neighborhood, neighborhood.name, locale)
    : undefined;

  const parts = [neighborhoodName, districtName, divisionName].filter(Boolean);
  return {
    division: divisionName,
    district: districtName,
    neighborhood: neighborhoodName,
    full: parts.join(", "),
  };
}
