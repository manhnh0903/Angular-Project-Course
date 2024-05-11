import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-authenticate-email',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './authenticate-email.component.html',
  styleUrl: './authenticate-email.component.scss',
})
export class AuthenticateEmailComponent {
  uid: string = '';
  token: string = '';

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
      //show message route to login?
    } catch (err) {
      console.error(err);
      //fehler 400 = fehler in uid oder token
      //fehler 403 = fehler in detail
    }
  }
}
