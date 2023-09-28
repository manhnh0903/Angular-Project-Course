import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  @ViewChild('contactForm') contactForm!: NgForm;

  sending: boolean = false;
  nameEntered: boolean = false;
  nameFormInteraction: boolean = false;
  emailFormInteraction: boolean = false;
  emailIsValid: boolean = false;
  messageFormInteraction: boolean = false;
  privacyInteraction: boolean = false;
  privacyAccepted: boolean = false;
  privacyHover: boolean = false;

  name: string = '';
  email: string = '';
  message: string = '';

  formReadyToSend: boolean = false;

  async sendMail() {
    this.sending = true;
    const formData = this.getFormData();

    // await fetch(
    //   'https://tobias-bayer.developerakademie.net/portfolio/send_mail/send_mail.php',
    //   {
    //     method: 'POST',
    //     body: formData,
    //   }
    // );

    this.sending = false;
  }

  getFormData() {
    const formData = new FormData();

    formData.append('name', this.name);
    formData.append('email', this.email);
    formData.append('message', this.message);

    return formData;
  }

  formInteraction(formType: string) {
    if (formType === 'name') this.nameFormInteraction = true;
    else if (formType === 'email') {
      this.emailFormInteraction = true;
      this.validateEmail();
    } else if (formType === 'message') this.messageFormInteraction = true;
  }

  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    this.emailIsValid = emailPattern.test(this.email);
  }

  togglePrivacy() {
    this.privacyAccepted = !this.privacyAccepted;
    console.log(this.privacyAccepted);
  }

  hoverImg() {}
}
