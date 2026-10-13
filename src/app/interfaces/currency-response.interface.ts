// =============================================
// Modelo principal: Currency
// Basado en los campos usados en el controlador
// =============================================
export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string | null;
  decimals: number | null;
  flag: string | null;
  is_crypto: boolean;
  is_active: boolean;
  display_order: number | null;
  created_at: string;   
  updated_at: string;   
}

// =============================================
// Data de la respuesta exitosa
// =============================================
export interface CurrenciesData {
  currencies: Currency[];
}

// =============================================
// Respuesta exitosa (OK-001)
// =============================================
export interface GetCurrenciesResponse {
  success: true;
  error: false;
  code: string;
  message: string;
  data?: CurrenciesData| undefined;
}


