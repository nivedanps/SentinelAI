export type DisasterType = 'flood' | 'fire' | 'earthquake' | 'cyclone' | 'landslide' | 'industrial_accident' | 'chemical_leak' | 'road_accident' | 'medical_emergency' | 'other';
export type Severity = 'low' | 'moderate' | 'high' | 'critical';
export type IncidentStatus = 'reported' | 'under_review' | 'verified' | 'in_progress' | 'resolved' | 'closed';
export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';
export type ReporterType = 'citizen' | 'first_responder' | 'government_agency' | 'ngo' | 'sensor' | 'other';

export interface Incident {
  id: string;
  title: string;
  description: string;
  disaster_type: DisasterType;
  severity: Severity;
  confidence_score: number;
  latitude: number;
  longitude: number;
  address?: string | null;
  affected_population: number;
  casualties: number;
  injuries: number;
  infrastructure_damage?: string | null;
  reporter_type: ReporterType;
  source: string;
  verification_status: VerificationStatus;
  current_status: IncidentStatus;
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
  is_deleted: boolean;
  deleted_at?: string | null;
}

export type IncidentInput = Omit<Incident, 'id' | 'created_at' | 'updated_at' | 'is_deleted' | 'deleted_at' | 'assigned_resources' | 'assigned_volunteers' | 'nearest_shelter' | 'weather_reference'>;

export interface IncidentPage {
  items: Incident[];
  page: number;
  page_size: number;
  total: number;
  total_pages: number;
}

export interface IncidentFilters {
  search?: string;
  disaster_type?: DisasterType;
  severity?: Severity;
  current_status?: IncidentStatus;
  verification_status?: VerificationStatus;
  reporter_type?: ReporterType;
  created_from?: string;
  created_to?: string;
  location_latitude?: number;
  location_longitude?: number;
  location_radius_km?: number;
  include_archived?: boolean;
}
