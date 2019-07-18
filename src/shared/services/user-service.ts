import { ApiService } from './api-service';
import { JwtService } from './jwt-service';
import { User } from '../models/user';
import { SharedState } from '../state/shared-state';
import { inject } from '@aurelia/kernel';

@inject(ApiService, JwtService, SharedState)
export class UserService {

  constructor(private readonly apiService: ApiService, private readonly jwtService: JwtService, private readonly sharedState: SharedState) {
  }

  // Verify JWT in localstorage with server & load user's info.
  // This runs once on application startup.
  populate() {
    if (this.jwtService.getToken()) {
      this.apiService.get('/user')
        .then(data => this.setAuth(data.user))
    } else {
      // Remove any potential remnants of previous auth states
      this.purgeAuth();
    }
  }

  setAuth(user: User) {
    // Save JWT sent from server in localstorage
    this.jwtService.saveToken(user.token);
    this.sharedState.currentUser = user;
    this.sharedState.isAuthenticated = true;
  }

  purgeAuth() {
    // Remove JWT from localstorage
    this.jwtService.destroyToken();
    this.sharedState.currentUser = new User();
    this.sharedState.isAuthenticated = false;
  }

  async attemptAuth(type, credentials) {
    const route = (type === 'login') ? '/login' : '';
    const data = await this.apiService.post('/users' + route, { user: credentials });
    this.setAuth(data.user);
    return data;
  }

  async update(user: User) {
    const data = await this.apiService.put('/user', { user });
    this.sharedState.currentUser = data.user;
    return data.user;

  }
}
