export interface ApiResponse<T = unknown> {
  status: string;
  data?: T;
  message?: string;
}

export interface UserPlaceholder {
  id: string;
  name: string;
  role: string;
}

export interface NavItem {
  name: string;
  path: string;
  iconName: string;
  badge?: string;
}
