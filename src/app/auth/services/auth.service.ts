import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { User } from '../../models/user.model';
import { checkAuthResponse } from '../interfaces/check-auth-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  public user?: User;

  constructor() {}

  async loginWithUsernameAndPassword(username: string, password: string) {
    const url = environment.baseUrl + '/auth/token/login';
    const body = { username: username, password: password };

    return lastValueFrom(this.http.post(url, body));
  }

  async logoutWithTokenEndpoint() {
    const url = environment.baseUrl + '/auth/token/logout';
    const body = {};

    return lastValueFrom(this.http.post(url, body));
  }

  async checkAuth() {
    const url = environment.baseUrl + '/auth/users/me';

    try {
      const resp = await lastValueFrom(this.http.get<checkAuthResponse>(url));
      this.user = new User(resp);

      return resp && resp.id;
    } catch (err) {
      return false;
    }
  }

  async updateUser(user: User) {
    const url = environment.baseUrl + '/auth/users/me/';
    const body = user.asJson();

    return lastValueFrom(this.http.patch(url, body));
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
