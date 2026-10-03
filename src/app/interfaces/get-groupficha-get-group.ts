// ============================================
// RESPUESTA GENÉRICA DE LA API
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  error: boolean;
  code: string;
  message?: string;   // opcional porque en este JSON no viene
  data: T;
}
 // ============================================
// RESPUESTA ESPECÍFICA DEL ENDPOINT
// ============================================
export type GroupFichasResponse = ApiResponse<GroupFichasData>;

export interface GroupFichasData {
  groupfichas: GroupFicha[];
}

// ============================================
// GRUPO DE FICHAS
// ============================================
export interface GroupFicha {
  id: number;
  name: string;
  description: string;
  created_at: string | null;   // ISO 8601 o null
  updated_at: string | null;   // ISO 8601 o null
}