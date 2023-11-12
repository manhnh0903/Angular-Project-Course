import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PeopleToChannelComponent } from '../people-to-channel/people-to-channel.component';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.scss'],
  styles: [`
  :host {
    border-radius: 50%;
  }
`]
})
export class CreateChannelComponent {
  constructor(public dialog: MatDialog) { }

  openPeopleToChannelDialog(): void {
    const dialogRef = this.dialog.open(PeopleToChannelComponent, {
      height: '400px',
      width: '600px',
      panelClass: 'createChannelDialog'
    });
  }
}
