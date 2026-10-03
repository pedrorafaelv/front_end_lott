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