
export interface Bus {
  id: string;
  depot: string;
  fleetNumber: string;
  registrationNumber: string;
  make: string;
  model: string;
  operator: string;
  isAC: boolean;
  serviceType: string;
  registrationDate: string;
  status: 'Active' | 'Maintenance' | 'Retired';
}

export interface DashboardStats {
  totalBuses: number;
  activeBuses: number;
  acBuses: number;
  depotCount: number;
}

export interface FilterState {
  search: string;
  depot: string;
  serviceType: string;
}

export enum Page {
  DASHBOARD = 'DASHBOARD',
  FLEET_SEARCH = 'FLEET_SEARCH',
  DEPOT_BREAKDOWN = 'DEPOT_BREAKDOWN',
  PTSC = 'PTSC',
  GCC = 'GCC',
}

export interface Translation {
  appTitle: string;
  appSubtitle: string;
  dashboard: string;
  fleetSearch: string;
  depotBreakdown: string;
  systemStatus: string;
  online: string;
  trackedFleet: string;
  electricFleet: string;
  vidiyalPayanam: string;
  acBuses: string;
  serviceTypeDist: string;
  searchPlaceholder: string;
  allDepots: string;
  allServices: string;
  fleetNumber: string;
  regNumber: string;
  depot: string;
  makeModel: string;
  service: string;
  showing: string;
  of: string;
  vehicles: string;
  previous: string;
  next: string;
  depotFleetBreakdown: string;
  breakdownSubtitle: string;
  depotName: string;
  total: string;
  grandTotal: string;
  slogan: string;
  loading: string;
  fetching: string;
  rowsPerPage: string;
  lastUpdatedLabel: string;
  regDate: string;
  ptsc: string;
  gcc: string;
  ownership: string;
  financials: string;
  operations: string;
  keyDifferences: string;
}
