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

  /**
   * Getter method for the 'name' form control.
   *
   * @returns The 'name' form control.
   */
  get name() {
    return this.editProfileForm.get('name');
  }
  /**
   * Getter method for the 'email' form control.
   *
   * @returns The 'email' form control.
   */
  get email() {
    return this.editProfileForm.get('email');
  }

  /**
   * Adds the Google profile image to the profilePictures array if available.
   */
  addGoogleProfileImg() {
    if (this.authService.currentUser.photoURL) {
      this.profilePictures.push(this.authService.currentUser.photoURL);
    }
  }

  /**
   * Opens the profile image selection overlay.
   */
  openEditProfileImg() {
    this.chooseProfileImg = true;
  }

  /**
   * Closes the profile image selection overlay and clears the selected image.
   */
  closeEditProfileImg() {
    this.chooseProfileImg = false;
    this.selectedProfileImg = null;
  }

  /**
   * Selects a profile image and closes the image selection overlay.
   */
  selectProfileImg() {
    this.chooseProfileImg = false;
  }

  /**
   * Handles the user's profile editing process, updating the user data if the form is valid.
   */
  async editProfile() {
    const email = this.email.value;
    const name = this.name.value;

    if (this.editProfileForm.valid) {
      this.updateUserData(name, email);
    } else {
      this.editProfileForm.markAllAsTouched();
    }
  }

  /**
   * Updates user data, including name, profile image, and email, and synchronizes changes with Firebase.
   * Closes the edit profile dialog afterward.
   * @param name - The new user name.
   * @param email - The new user email.
   */
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

  /**
   * Checks if the current user is not a Google user and not the test user.
   * @returns True if the user is neither a Google user (with a photo URL) nor the test user.
   */
  isNotGoogleOrTestUser() {
    return (
      this.authService.currentUser.photoURL === null &&
      this.userService.user.email !== 'testuser@test.com'
    );
  }

  /**
   * Closes the edit profile dialog and navigates back to the home page.
   */
  closeDialog() {
    this.router.navigateByUrl('/home');
    this.homeNavService.editProfileOpen = false;
  }
}
