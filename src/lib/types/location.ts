export interface Neighborhood {
  id: string;
  name: string;
  nameBn?: string;
}

export interface District {
  id: string;
  name: string;
  nameBn?: string;
  neighborhoods?: Neighborhood[];
}

export interface Division {
  id: string;
  name: string;
  nameBn?: string;
  districts: District[];
}

export interface Location {
  divisionId: string;
  districtId: string;
  neighborhoodId?: string;
  address?: string;
}

export interface LocationDisplay {
  division: string;
  district: string;
  neighborhood?: string;
  full: string;
}
