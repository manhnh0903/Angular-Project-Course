import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-authenticate-email',
  standalone: true,
  imports: [HeaderComponent, RouterModule],
  templateUrl: './authenticate-email.component.html',
  styleUrl: './authenticate-email.component.scss',
})
export class AuthenticateEmailComponent {
  private uid: string = '';
  private token: string = '';
  public sendSuccessful: boolean = false;

  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('uid');
    const token = this.route.snapshot.paramMap.get('token');

    if (id && token) {
      this.uid = id;
      this.token = token;
    }
    console.log(this.uid, this.token);
  }

  async ngAfterViewInit() {
    try {
      await this.authService.authenticateEmail(this.uid, this.token);
      this.sendSuccessful = true;
    } catch (err) {
      console.error(err);
    }
  }
}
