import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'src/app/classes/custom-validators.class';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dialog-edit-profile',
  templateUrl: './dialog-edit-profile.component.html',
  styleUrls: ['./dialog-edit-profile.component.scss'],
})
export class DialogEditProfileComponent {
  editProfileForm: FormGroup;

  constructor(
    private router: Router,
    private el: ElementRef,
    public userService: UserService,
    private firestoreService: FirestoreService,
    private authService: FirebaseAuthService,
    private fb: FormBuilder
  ) {
    this.editProfileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, CustomValidators.emailValidator]],
    });
  }

  ngAfterViewInit() {
    this.el.nativeElement.addEventListener('click', (event) => {
      if (event.target.classList.contains('profileContainer')) {
        this.closeDialog();
      }
    });
  }

  get name() {
    return this.editProfileForm.get('name');
  }
  get email() {
    return this.editProfileForm.get('email');
  }

  async editProfile() {
    const email = this.email.value;
    const name = this.name.value;

    if (this.editProfileForm.valid) {
      this.updateUserData(name, email);
    } else {
      this.editProfileForm.markAllAsTouched();
    }
  }

  async updateUserData(name: string, email: string) {
    if (this.userService.user.email === 'testuser@test.com') {
      this.userService.user.name = name;
    } else {
      this.userService.user.name = name;
      this.userService.user.email = email;
    }

    await this.firestoreService.newUser(
      this.userService.user.toJson(),
      this.userService.user.userId
    );
    if (this.userService.user.email !== 'testuser@test.com') {
      await this.authService.updateEmailInFirebaseAuth(email);
    }
  }

  closeDialog() {
    this.router.navigateByUrl('/home');
  }
}
