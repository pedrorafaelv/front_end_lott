// ─────────────────────────────────────────────
// Códigos y tipos base
// ─────────────────────────────────────────────
export type GetTotalsSuccessCode = 'OK-001';
export type GetTotalsErrorCode   = 'ERR-033';

// ─────────────────────────────────────────────
// Data de éxito
// ─────────────────────────────────────────────
export interface GetTotalsData {
  deposits:    number;
  withdrawals: number;
  bets:        number;
  awards:      number;
  promotions:  number;
  debits:      number;
  credits:     number;
}

// ─────────────────────────────────────────────
// Respuesta éxito
// ─────────────────────────────────────────────
export interface GetTotalsSuccess {
  success: true;
  error:   false;
  code:    GetTotalsSuccessCode;
  message: string;
  data:    GetTotalsData;
}

// ─────────────────────────────────────────────
// Respuesta error
// ─────────────────────────────────────────────
export interface GetTotalsError {
  success: false;
  error:   true;
  code:    GetTotalsErrorCode;
  message: string;        // 'User or Currency not found '
  data:    null;
}

// ─────────────────────────────────────────────
// Unión discriminada
// ─────────────────────────────────────────────
export type GetTotalsResponse = GetTotalsSuccess | GetTotalsError;