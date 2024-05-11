import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  constructor() {}

  async loginWithUsernameAndPassword(username: string, password: string) {
    const url = environment.baseUrl + '/auth/token/login';
    const body = { username: username, password: password };

    return lastValueFrom(this.http.post(url, body));
  }

  async logoutTokenEndpoint() {
    const url = environment.baseUrl + '/auth/token/logout';
    const body = {};

    return lastValueFrom(this.http.post(url, body));
  }

  async checkAuth() {
    const url = environment.baseUrl + '/auth/users/me';

    try {
      const resp: { id?: number } = await lastValueFrom(this.http.get(url));

      return resp && resp.id;
    } catch (err) {
      return false;
    }
  }

  async registerUser(
    username: string,
    email: string,
    password: string,
    passwordRepeat: string
  ) {
    const url = environment.baseUrl + '/auth/users/';
    const body = {
      username: username,
      email: email,
      password: password,
      re_password: passwordRepeat,
    };

    return lastValueFrom(this.http.post(url, body));
  }

  async authenticateEmail(uid: string, token: string) {
    const url = environment.baseUrl + '/auth/users/activation/';
    const body = { uid: uid, token: token };

    return lastValueFrom(this.http.post(url, body));
  }

  async requestPasswordReset(email: string) {
    const url = environment.baseUrl + '/auth/users/reset_password/';
    const body = { email: email };

    return lastValueFrom(this.http.post(url, body));
  }

  async setNewPassword(uid: string, token: string, password: string) {
    const url = environment.baseUrl + '/auth/users/reset_password_confirm/';
    const body = { uid: uid, token: token, new_password: password };

    return lastValueFrom(this.http.post(url, body));
  }
}
