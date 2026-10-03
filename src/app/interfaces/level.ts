/* ============================================
   INTERFACES
   ============================================ */
export interface UserLevel {
  id: number;
  name: string;
  icon: string;
  color: string;
  maxRaffles: number;
  maxAmount: number;
  maxRetentionPercent: number;
  canCreatePrivate: boolean;
  canUseAuto: boolean;
  canUseCustomFichas: boolean;
}

export interface LevelConfig {
  id: number;
  name: string;
  icon: string;
  color: string;
  max_raffles_active: number;
  max_amount: number;
  max_retention_percent: number;
  can_create_private: boolean;
  can_use_auto_type: boolean;
  can_use_custom_fichas: boolean;
  min_games_played: number;
  min_days_registered: number;
  min_wins: number;
}

/* ============================================
     CONFIGURACIÓN DE NIVELES
     ============================================ */
  export const  niveles: LevelConfig[] = [
    {
      id: 1, name: 'Novato', icon: 'fa-seedling', color: '#909090',
      max_raffles_active: 0, max_amount: 0, max_retention_percent: 0,
      can_create_private: false, can_use_auto_type: false, can_use_custom_fichas: false,
      min_games_played: 0, min_days_registered: 0, min_wins: 0
    },
    {
      id: 2, name: 'Jugador', icon: 'fa-star', color: '#3a7ebf',
      max_raffles_active: 1, max_amount: 100, max_retention_percent: 5,
      can_create_private: false, can_use_auto_type: false, can_use_custom_fichas: false,
      min_games_played: 50, min_days_registered: 30, min_wins: 0
    },
    {
      id: 3, name: 'Avanzado', icon: 'fa-fire', color: '#f39c12',
      max_raffles_active: 3, max_amount: 500, max_retention_percent: 10,
      can_create_private: true, can_use_auto_type: false, can_use_custom_fichas: false,
      min_games_played: 200, min_days_registered: 90, min_wins: 10
    },
    {
      id: 4, name: 'Élite', icon: 'fa-gem', color: '#00e676',
      max_raffles_active: 5, max_amount: 2000, max_retention_percent: 15,
      can_create_private: true, can_use_auto_type: true, can_use_custom_fichas: true,
      min_games_played: 500, min_days_registered: 180, min_wins: 30
    },
    {
      id: 5, name: 'VIP', icon: 'fa-crown', color: '#ffd700',
      max_raffles_active: 10, max_amount: 10000, max_retention_percent: 20,
      can_create_private: true, can_use_auto_type: true, can_use_custom_fichas: true,
      min_games_played: 1000, min_days_registered: 365, min_wins: 100
    },
    {
      id: 6, name: 'Admin', icon: 'fa-user-shield', color: '#ff4757',
      max_raffles_active: 999, max_amount: 999999, max_retention_percent: 100,
      can_create_private: true, can_use_auto_type: true, can_use_custom_fichas: true,
      min_games_played: 0, min_days_registered: 0, min_wins: 0
    }
  ];