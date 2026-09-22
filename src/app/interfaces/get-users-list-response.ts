export interface GetUsersListData {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  usuarios: Usuario[];
}

export interface GetUsersListResponse {
  success: boolean;
  error: boolean;
  code: string;
  message: string;
  data: GetUsersListData;
}

export interface Usuario {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  email_verified_at: string | null;
  last_name: string | null;
  birth_date: string | null;
  document: string | null;
  gender: string | null;
  phone: string | null;
  phone_verified_at: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  role: string | null;
  firebase_localId: string | null;
  firebase_token: string | null;
  firebase_last_connection: string | null;
  created_at: string;
  updated_at: string;
}