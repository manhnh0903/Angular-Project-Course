import { Component, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomValidators } from 'src/app/classes/custom-validators.class';
import { FirebaseAuthService } from 'src/app/services/firebase-auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-dialog-edit-profile',
  templateUrl: './dialog-edit-profile.component.html',
  styleUrls: ['./dialog-edit-profile.component.scss'],
})
export class DialogEditProfileComponent {
  editProfileForm: FormGroup;
  chooseProfileImg: boolean = false;
  public selectedProfileImg: string;

  profilePictures: string[] = [
    './assets/img/0character.png',
    './assets/img/1character.png',
    './assets/img/2character.png',
    './assets/img/3character.png',
    './assets/img/4character.png',
    './assets/img/5character.png',
  ];

  constructor(
    private router: Router,
    private el: ElementRef,
    public userService: UserService,
    private firestoreService: FirestoreService,
    private authService: FirebaseAuthService,
    private fb: FormBuilder,
    private homeNavService: HomeNavigationService
  ) {
    this.editProfileForm = this.fb.group({
      name: [userService.user.name, Validators.required],
      email: [
        userService.user.email,
        [Validators.required, CustomValidators.emailValidator],
      ],
    });
    this.addGoogleProfileImg();
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

  addGoogleProfileImg() {
    if (this.authService.currentUser.photoURL) {
      this.profilePictures.push(this.authService.currentUser.photoURL);
    }
  }

  openEditProfileImg() {
    this.chooseProfileImg = true;
  }

  closeEditProfileImg() {
    this.chooseProfileImg = false;
    this.selectedProfileImg = null;
  }

  selectProfileImg() {
    this.chooseProfileImg = false;
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
    this.userService.user.name = name;

    if (this.selectedProfileImg)
      this.userService.user.profileImg = this.selectedProfileImg;

    if (this.userService.user.email !== 'testuser@test.com')
      this.userService.user.email = email;

    await this.firestoreService.newUser(
      this.userService.user.toJson(),
      this.userService.user.userId
    );
    if (this.isNotGoogleOrTestUser()) {
      await this.authService.updateEmailInFirebaseAuth(email);
    }
    this.homeNavService.editProfileOpen = false;
  }

  isNotGoogleOrTestUser() {
    return (
      this.authService.currentUser.photoURL === null &&
      this.userService.user.email !== 'testuser@test.com'
    );
  }

  closeDialog() {
    this.router.navigateByUrl('/home');
    this.homeNavService.editProfileOpen = false;
  }
}
