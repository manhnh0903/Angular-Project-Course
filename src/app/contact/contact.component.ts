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

    formData.append('name', this.contactForm.value.name);
    formData.append('email', this.contactForm.value.email);
    formData.append('message', this.contactForm.value.message);

    return formData;
  }
}
