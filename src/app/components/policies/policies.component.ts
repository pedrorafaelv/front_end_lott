import { Component, NgModule  } from '@angular/core';
import { CommonModule } from '@angular/common';

interface LevelPolicy {
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
  description: string;
}


@Component({
  selector: 'app-policies-levels',
  templateUrl: './Policies.component.html',
  styleUrls: ['./Policies.component.css'],
  standalone: true,
  imports: [CommonModule, 
            ]
})



export class PoliciesComponent {

  readonly niveles: LevelPolicy[] = [
    {
      id: 1, name: 'Novato', icon: 'fa-seedling', color: '#909090',
      max_raffles_active: 0, max_amount: 0, max_retention_percent: 0,
      can_create_private: false, can_use_auto_type: false, can_use_custom_fichas: false,
      min_games_played: 0, min_days_registered: 0, min_wins: 0,
      description: 'Nivel inicial. Todo usuario nuevo comienza aquí. No permite sorteos activos ni funcionalidades especiales.'
    },
    {
      id: 2, name: 'Jugador', icon: 'fa-star', color: '#3a7ebf',
      max_raffles_active: 1, max_amount: 100, max_retention_percent: 5,
      can_create_private: false, can_use_auto_type: false, can_use_custom_fichas: false,
      min_games_played: 50, min_days_registered: 30, min_wins: 0,
      description: 'Nivel básico para usuarios con actividad inicial comprobada. Permite un sorteo activo.'
    },
    {
      id: 3, name: 'Avanzado', icon: 'fa-fire', color: '#f39c12',
      max_raffles_active: 3, max_amount: 500, max_retention_percent: 10,
      can_create_private: true, can_use_auto_type: false, can_use_custom_fichas: false,
      min_games_played: 200, min_days_registered: 90, min_wins: 10,
      description: 'Nivel intermedio para usuarios con experiencia consolidada. Desbloquea sorteos privados.'
    },
    {
      id: 4, name: 'Élite', icon: 'fa-gem', color: '#00e676',
      max_raffles_active: 5, max_amount: 2000, max_retention_percent: 15,
      can_create_private: true, can_use_auto_type: true, can_use_custom_fichas: true,
      min_games_played: 500, min_days_registered: 180, min_wins: 30,
      description: 'Nivel avanzado para usuarios destacados. Acceso a tipo automático y fichas personalizadas.'
    },
    {
      id: 5, name: 'VIP', icon: 'fa-crown', color: '#ffd700',
      max_raffles_active: 10, max_amount: 10000, max_retention_percent: 20,
      can_create_private: true, can_use_auto_type: true, can_use_custom_fichas: true,
      min_games_played: 1000, min_days_registered: 365, min_wins: 100,
      description: 'Nivel máximo para usuarios de élite. Todos los beneficios desbloqueados.'
    },
    {
      id: 6, name: 'Admin', icon: 'fa-user-shield', color: '#ff4757',
      max_raffles_active: 999, max_amount: 999999, max_retention_percent: 100,
      can_create_private: true, can_use_auto_type: true, can_use_custom_fichas: true,
      min_games_played: 0, min_days_registered: 0, min_wins: 0,
      description: 'Nivel administrativo, exclusivo para personal autorizado. No se obtiene por méritos de juego.'
    }
  ];

  readonly reglasGenerales: string[] = [
    'Cada usuario tiene un único nivel activo en todo momento.',
    'Para ascender a un nivel, el usuario debe cumplir al menos uno de los requisitos mínimos exigidos (partidas jugadas, días registrados o victorias obtenidas).',
    'Si el usuario no tiene fecha de registro válida, la condición de días registrados se ignora y solo se evalúan partidas jugadas y victorias.',
    'Todo usuario sin méritos suficientes permanece en el nivel Novato.',
    'El usuario obtiene el nivel más alto cuyos requisitos cumpla.',
    'El nivel Admin se asigna únicamente a usuarios marcados como administradores y queda excluido de las reglas automáticas de ascenso.',
    'Los umbrales pueden ser ajustados por la administración del juego en cualquier momento.',
    'El nivel puede ser revocado o modificado manualmente por un administrador cuando existan razones justificadas.'
  ];
}