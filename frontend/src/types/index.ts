export type UserRole =
  | 'CITIZEN'
  | 'OPERATOR'
  | 'DISTRICT_ADMIN'
  | 'OFFICER'
  | 'HOSPITAL_COORD'
  | 'VOLUNTEER_COORD'
  | 'RESPONSE_TEAM';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
}

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number]; // [lng, lat]
}

export type IncidentCategory =
  | 'FLOOD'
  | 'FIRE'
  | 'BUILDING_COLLAPSE'
  | 'LANDSLIDE'
  | 'MEDICAL_EMERGENCY'
  | 'HAZMAT'
  | 'CYCLONE'
  | 'EARTHQUAKE'
  | 'OTHER';

export type IncidentStatus =
  | 'REPORTED'
  | 'VERIFIED'
  | 'DISPATCHED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'REJECTED';

export interface AIAnalysis {
  urgency?: string;
  extracted_needs?: string[];
  damage_score?: number;
  confidence?: number;
  summary?: string;
  recommended_actions?: string[];
}

export interface AddressMetadata {
  district?: string;
  block?: string;
  landmark?: string;
  full_address?: string;
}

export interface Incident {
  id: string;
  cluster_id?: string;
  title: string;
  description: string;
  category: IncidentCategory;
  status: IncidentStatus;
  severity_score: number;
  location: GeoJSONPoint;
  address_metadata?: AddressMetadata;
  media_urls?: string[];
  ai_analysis?: AIAnalysis;
  created_at?: string;
  updated_at?: string;
}

export interface Resource {
  id: string;
  name: string;
  type: string;
  quantity: number;
  status: 'AVAILABLE' | 'DISPATCHED' | 'MAINTENANCE' | 'DEPLETED';
  current_location: GeoJSONPoint;
  depot_name: string;
  assigned_incident_id?: string;
}

export interface Shelter {
  id: string;
  name: string;
  capacity_total: number;
  capacity_current: number;
  occupancy_percentage: number;
  location: GeoJSONPoint;
  amenities: string[];
  contact_person: string;
  contact_phone: string;
  is_active: boolean;
  status_label: string;
}

export interface Hospital {
  id: string;
  name: string;
  location: GeoJSONPoint;
  total_beds: number;
  available_general_beds: number;
  available_icu_beds: number;
  total_available_beds: number;
  bed_utilization_percentage: number;
  oxygen_status: 'SUFFICIENT' | 'CRITICAL' | 'EXHAUSTED';
  contact_phone: string;
}
