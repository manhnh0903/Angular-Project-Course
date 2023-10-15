import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  @ViewChild('contactForm') contactForm!: NgForm;

  scrolledBy: boolean = false;
  lang!: string;
  sending: boolean = false;
  buttonText: string = 'Send message!';
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

  constructor(public translate: TranslateService) {}

  ngOnInit() {
    this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.updateButtonText();
      this.lang = event.lang;
    });
  }

  ngOnDestroy() {
    this.translate.onLangChange.unsubscribe();
  }

  /**
   * Updates the text displayed on the button based on the current language and email send status.
   * If the email has been sent (mailSend is true), the button text is set to 'Thank you!' in the current language.
   * Otherwise, if the email has not been sent, the button text is set to 'Send message!' in the current language.
   */
  updateButtonText() {
    if (this.mailSend) {
      this.buttonText = this.translate.instant('Thank you!');
    } else {
      this.buttonText = this.translate.instant('Send message!');
    }
  }

  /**
   * Sends an email using the collected form data.
   * It sets the 'sending' flag to true to indicate that the email sending process has started.
   * It uses the 'getFormData()' function to retrieve the form data, and ideally, it should send a POST request
   * to a specified URL with the form data. In this case, the fetch request is currently commented out.
   * After the email is sent (or the attempt is made), it sets 'sending' to false and 'mailSend' to true.
   */

  async sendMail() {
    this.sending = true;
    const formData = this.getFormData();

    await fetch('https://tobias-bayer.dev/send_mail.php', {
      method: 'POST',
      body: formData,
    });

    this.sending = false;
    this.mailSend = true;
    this.updateButtonText();

    setTimeout(() => {
      this.resetForm();
    }, 5000);
  }

  /**
   * resets the mailSend variable
   */
  resetForm() {
    this.mailSend = false;
    this.updateButtonText();
  }

  /**
   * Gathers form data and prepares it for submission.
   * It creates a new 'FormData' object and appends the 'name', 'email', and 'message' properties to it.
   * The resulting 'FormData' object can be used for submitting the form data in an HTTP request.
   *
   * @returns {FormData} - The 'FormData' object containing the form data.
   */
  getFormData() {
    const formData = new FormData();

    formData.append('name', this.name);
    formData.append('email', this.email);
    formData.append('message', this.message);

    return formData;
  }

  /**
   * Manages interactions with different parts of the form.
   * It takes a 'formType' parameter and handles interactions accordingly.
   * - If 'formType' is 'name', it sets 'nameFormInteraction' to true.
   * - If 'formType' is 'email', it sets 'emailFormInteraction' to true and validates the email.
   * - If 'formType' is 'message', it sets 'messageFormInteraction' to true.
   * After the interaction, it calls 'checkIfFormValid()' to reevaluate the form's validity.
   */
  formInteraction(formType: string) {
    if (formType === 'name') this.nameFormInteraction = true;
    else if (formType === 'email') {
      this.emailFormInteraction = true;
      this.validateEmail();
    } else if (formType === 'message') this.messageFormInteraction = true;
    this.checkIfFormValid();
  }

  /**
   * Validates the email address format.
   * It uses a regular expression pattern to check if the 'email' property matches a valid email format.
   * If it's a valid email address, 'emailIsValid' is set to true; otherwise, it's set to false.
   */
  validateEmail() {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    this.emailIsValid = emailPattern.test(this.email);
  }

  /**
   * Toggles the privacy acceptance status.
   * If privacy was accepted, it's now revoked, and vice versa.
   * After the status is toggled, it calls 'checkIfFormValid()' to reevaluate the form's validity.
   */
  togglePrivacy() {
    this.privacyAccepted = !this.privacyAccepted;
    this.checkIfFormValid();
  }

  /**
   * Checks if the form is valid for submission.
   * The form is considered valid if:
   * - 'name' is not empty
   * - 'emailIsValid' is true
   * - 'message' is not empty
   * - 'privacyAccepted' is true
   * If all conditions are met, 'formReadyToSend' is set to true; otherwise, it's set to false.
   */
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

  /**
   * This function signals that the element is in view.
   * It sets the 'scrolledBy' flag to 'true'.
   */
  inVision() {
    this.scrolledBy = true;
  }
}
