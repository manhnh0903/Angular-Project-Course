import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataManagerService } from '../../services/data-manager.service';

@Component({
  selector: 'app-user-overlay',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-overlay.component.html',
  styleUrl: './user-overlay.component.scss',
})
export class UserOverlayComponent {
  dataManager = inject(DataManagerService);

  closeOverlay() {
    console.log('close');
  }
}
