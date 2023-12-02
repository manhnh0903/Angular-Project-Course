import { Component } from '@angular/core';
import { HomeNavigationService } from 'src/app/services/home-navigation.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Message } from 'src/app/classes/message.class';
import { Subject, startWith, takeUntil } from 'rxjs';

@Component({
  selector: 'app-tread',
  templateUrl: './tread.component.html',
  styleUrls: ['./tread.component.scss'],
})
export class TreadComponent {
  public sendMessageForm: FormGroup;
  public messages: Message[];
  private destroy$ = new Subject<void>();

  public message: Message = new Message();

  constructor(public homeNav: HomeNavigationService, private fb: FormBuilder) {
    this.sendMessageForm = this.fb.group({
      message: ['', [Validators.required]],
    });

    this.subMessageData();
  }

  noOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  subMessageData() {
    this.homeNav.selectedMessage$
      .pipe(startWith(this.homeNav.currentTread), takeUntil(this.destroy$))
      .subscribe((data: Message) => {
        this.message = data;

        console.log(typeof this.message.creationDate);
      });
  }

  sendForm() {}
}
