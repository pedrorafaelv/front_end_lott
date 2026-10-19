import { Injectable } from '@angular/core';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  Auth, GoogleAuthProvider, deleteUser,
  getAdditionalUserInfo, getAuth, signInWithPopup, signOut,
} from 'firebase/auth';
import { environment } from '../../environments/environment';

export interface SocialResult {
  idToken: string;
  localId: string;
  email: string | null;
  displayName: string | null;
  isNewUser: boolean;
}

@Injectable({ providedIn: 'root' })
export class SocialAuthService {
  private auth: Auth;

  constructor() {
    const app = getApps().length
      ? getApp()
      : initializeApp({ apiKey: environment.Firebase_apiKey , ...environment.firebaseWeb });
    this.auth = getAuth(app);
    this.auth.languageCode = 'es';
  }

  /** Debe llamarse directamente desde un click, o el navegador bloquea el popup. */
  async signInWithGoogle(): Promise<SocialResult> {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    const cred = await signInWithPopup(this.auth, provider);
    return {
      idToken: await cred.user.getIdToken(),
      localId: cred.user.uid,
      email: cred.user.email,
      displayName: cred.user.displayName,
      isNewUser: !!getAdditionalUserInfo(cred)?.isNewUser,
    };
  }

  /** Cierra la sesión del SDK. Con deleteAccount=true borra también la cuenta recién creada. */
  async discard(deleteAccount: boolean): Promise<void> {
    try {
      if (deleteAccount && this.auth.currentUser) {
        await deleteUser(this.auth.currentUser);
      }
    } catch { /* si falla el borrado, igualmente cerramos sesión */ }
    try { await signOut(this.auth); } catch { }
  }
}