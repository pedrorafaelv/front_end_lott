import { Component, OnInit } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { PublicityComponent } from '../../components/publicity/publicity.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports:[PublicityComponent,
           DatePipe,
           DecimalPipe,
           CommonModule,
           FormsModule
   ],
})
export class ProfileComponent implements OnInit {
  activeTab: 'info' | 'stats' | 'history' | 'settings' = 'info';
  historyFilter: string = 'all';

  user: any = {
    name: 'Juan',
    lastName: 'Pérez',
    username: 'juanp',
    email: 'juan@example.com',
    phone: '+34 600 000 000',
    birthDate: new Date(1995, 5, 15),
    joinDate: new Date(2022, 0, 10),
    avatar: '',
    stats: {
      gamesPlayed: 142,
      wins: 87,
      prizesWon: 23,
      winRate: 0.61,
      totalPrize: 3450,
      currentStreak: 5
    },
    badges: [
      { name: 'Primer juego', icon: 'fa-star', color: '#f6ad55' },
      { name: '10 victorias', icon: 'fa-trophy', color: '#48bb78' },
      { name: 'Racha x5', icon: 'fa-fire', color: '#f56565' }
    ],
    settings: {
      notifications: true,
      sounds: false,
      promotions: true,
      profilePublic: true,
      showEmail: false
    }
  };

  history: any[] = [
    { name: 'Ruleta Rápida', date: new Date(), won: true, prize: 150, bet: 0 },
    { name: 'Blackjack', date: new Date(Date.now() - 86400000), won: false, prize: 0, bet: 50 },
    { name: 'Tragamonedas', date: new Date(Date.now() - 172800000), won: true, prize: 300, bet: 0 }
  ];

  get filteredHistory() {
    if (this.historyFilter === 'wins') return this.history.filter(g => g.won);
    if (this.historyFilter === 'month') {
      const now = new Date();
      return this.history.filter(g => g.date.getMonth() === now.getMonth());
    }
    return this.history;
  }

  ngOnInit(): void {}

  setActiveTab(tab: any) { this.activeTab = tab; }
  editProfile() { /* abrir modal */ }
  changeAvatar() { /* file picker */ }
  changeCover() { /* file picker */ }
  changePassword() { /* ... */ }
  enable2FA() { /* ... */ }
  deleteAccount() { /* ... */ }
}