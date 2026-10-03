import { Injectable } from '@angular/core';
import { LOTTERY_NAMES } from '../config/lotery-names.config';

@Injectable({ providedIn: 'root' })
export class LotteryNameService {
  private readonly names = LOTTERY_NAMES;

  /**
   * Devuelve un nombre aleatorio evitando repetir el último usado por ese usuario.
   * @param userId id del usuario (para que cada uno tenga su propio "último usado")
   */
  getRandomName(userId: number | string): string {
    const key = `lottery_last_index_${userId}`;
    const lastRaw = localStorage.getItem(key);
    const lastIndex = lastRaw !== null ? parseInt(lastRaw, 10) : -1;

    let newIndex: number;

    if (lastIndex === -1) {
      newIndex = Math.floor(Math.random() * this.names.length);
    } else {
      do {
        newIndex = Math.floor(Math.random() * this.names.length);
      } while (newIndex === lastIndex && this.names.length > 1);
    }

    localStorage.setItem(key, newIndex.toString());
    return this.names[newIndex];
  }

  /** Por si quieres reiniciar el "último usado" de un usuario */
  reset(userId: number | string): void {
    localStorage.removeItem(`lottery_last_index_${userId}`);
  }
}