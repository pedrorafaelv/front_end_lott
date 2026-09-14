/**
 * ============================================================
 * INTERFACES ESTÁNDAR PARA RESPUESTAS DE LA API
 * ============================================================
 */

// ============================================================
// META (común a todas las respuestas)
// ============================================================
export interface ResponseMeta {
    timestamp: string;   // "2026-09-13 10:30:00"
    request_id: string;  // UUID
    version: string;     // "1.0"
}

// ============================================================
// RESPUESTA BASE
// ============================================================
export interface BaseApiResponse {
    success: boolean;
    code: string;
    message: string;
    data: any;
    errors: any;
    meta: ResponseMeta;
}

// ============================================================
// RESPUESTA DE ÉXITO
// ============================================================
export interface CancelBetSuccessResponse extends BaseApiResponse {
    success: true;
    code: 'OK-001';
    message: 'Bet cancelled successfully';
    data: {
        raffle_id: number;
        card_id: number;
        user_id: number;
        refunded_amount: number;
        new_amount: number;
    };
    errors: null;
}

// ============================================================
// RESPUESTA DE ERROR
// ============================================================
export interface CancelBetErrorResponse extends BaseApiResponse {
    success: false;
    code: CancelBetErrorCode;
    message: string;
    data: null;
    errors: any;
}

// ============================================================
// UNIÓN DE RESPUESTAS
// ============================================================
export type CancelBetResponse = CancelBetSuccessResponse | CancelBetErrorResponse;

// ============================================================
// CÓDIGOS DE ERROR
// ============================================================
export type CancelBetErrorCode =
    | 'ERR-001'  // Validation error
    | 'ERR-006'  // Raffle not found
    | 'ERR-009'  // Raffle already ended
    | 'ERR-016'  // Max fichas reached
    | 'ERR-017'  // Bet not found
    | 'ERR-018'  // Account not found
    | 'ERR-019'  // Failed to cancel
    | 'ERR-020'; // General error

// ============================================================
// CÓDIGOS DE ÉXITO
// ============================================================
export type CancelBetSuccessCode = 'OK-001';

// ============================================================
// MAPA DE MENSAJES EN ESPAÑOL
// ============================================================
export const CANCEL_BET_MESSAGES: Record<CancelBetErrorCode, string> = {
    'ERR-001': 'Error de validación en los datos enviados.',
    'ERR-006': 'El sorteo no fue encontrado.',
    'ERR-009': 'El sorteo ya ha finalizado. No se puede cancelar la apuesta.',
    'ERR-016': 'El sorteo ya ha iniciado y se alcanzó el número máximo de figuras.',
    'ERR-017': 'La apuesta no existe o no pertenece a este usuario.',
    'ERR-018': 'La cuenta del usuario no fue encontrada.',
    'ERR-019': 'No se pudo cancelar la apuesta. Intenta nuevamente.',
    'ERR-020': 'Ocurrió un error inesperado al cancelar la apuesta.'
};

// ============================================================
// TYPE GUARDS
// ============================================================
export function isCancelBetSuccess(
    response: CancelBetResponse
): response is CancelBetSuccessResponse {
    return response.success === true && response.code === 'OK-001';
}

export function isCancelBetError(
    response: CancelBetResponse
): response is CancelBetErrorResponse {
    return response.success === false;
}