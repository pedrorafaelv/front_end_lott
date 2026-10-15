/** Tipos de documento legal que gestionamos */
export type LegalDocType = 'terms' | 'privacy' | 'cookies' | 'game-rules';

/** Payload que el cliente envía al backend al aceptar */
export interface AcceptTermsRequest {
  docType: LegalDocType;
  version: string;
  sourceUrl?: string;
}

/** Registro de aceptación devuelto por el backend */
export interface TermsAcceptance {
  id: string;
  userId: string;
  docType: LegalDocType;
  version: string;
  contentHash: string;
  acceptedAt: string;        // ISO 8601 con zona horaria
  ipAddress: string | null;
  userAgent: string | null;
  sourceUrl: string | null;
}

/** Respuesta del endpoint /current */
export interface CurrentAcceptanceResponse {
  docType: LegalDocType;
  /** Última versión publicada por el operador */
  currentVersion: string;
  /** Aceptación vigente del usuario para este docType (null si no aceptó nunca) */
  acceptance: TermsAcceptance | null;
  /** true si el usuario debe (re)aceptar la versión vigente */
  requiresAcceptance: boolean;
}

/** Verificación global del estado de todos los documentos obligatorios */
export interface TermsStatusResponse {
  requiresAcceptance: boolean;
  pending: Array<{
    docType: LegalDocType;
    currentVersion: string;
    acceptedVersion: string | null;
  }>;
}