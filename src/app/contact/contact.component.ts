import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  @ViewChild('contactForm') contactForm!: NgForm;

  scrolledBy: boolean = false;

  sending: boolean = false;
  mailSend: boolean = false;
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

    // await fetch('https://tobias-bayer.dev/send_mail.php', {
    //   method: 'POST',
    //   body: formData,
    // });

    this.sending = false;
    this.mailSend = true;
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
    this.checkIfFormValid();
  }

  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    this.emailIsValid = emailPattern.test(this.email);
  }

  togglePrivacy() {
    this.privacyAccepted = !this.privacyAccepted;
    this.checkIfFormValid();
  }

  checkIfFormValid() {
    if (
      this.name.length > 0 &&
      this.emailIsValid &&
      this.message.length > 0 &&
      this.privacyAccepted
    )
      this.formReadyToSend = true;
    else this.formReadyToSend = false;
  }

  inVision() {
    this.scrolledBy = true;
  }
}
