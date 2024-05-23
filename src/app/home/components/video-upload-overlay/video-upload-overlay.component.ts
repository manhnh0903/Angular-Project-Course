import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FormInputWithErrorComponent } from '../../../shared/components/form-input-with-error/form-input-with-error.component';
import { ButtonWithoutIconComponent } from '../../../shared/components/button-without-icon/button-without-icon.component';
import { DataManagerService } from '../../services/data-manager.service';

@Component({
  selector: 'app-video-upload-overlay',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormInputWithErrorComponent,
    ButtonWithoutIconComponent,
  ],
  templateUrl: './video-upload-overlay.component.html',
  styleUrl: './video-upload-overlay.component.scss',
})
export class VideoUploadOverlayComponent {
  public uploadForm: FormGroup;
  public selectedVideoFileName: string = '';
  public selectedThumbnailFileName: string = '';

  private fb = inject(FormBuilder);
  private dataManager = inject(DataManagerService);

  constructor() {
    this.uploadForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      video: [null, Validators.required],
      thumbnail: [null],
    });
  }

  /**
   * Getter method for the 'title' form control.
   *
   * @returns The 'title' form control.
   */
  get title() {
    return this.uploadForm.get('title');
  }

  /**
   * Getter method for the 'description' form control.
   *
   * @returns The 'description' form control.
   */
  get description() {
    return this.uploadForm.get('description');
  }

  /**
   * Getter method for the 'video' form control.
   *
   * @returns The 'video' form control.
   */
  get video() {
    return this.uploadForm.get('video');
  }

  /**
   * Getter method for the 'thumbnail' form control.
   *
   * @returns The 'thumbnail' form control.
   */
  get thumbnail() {
    return this.uploadForm.get('thumbnail');
  }

  onFileChange(event: Event, field: string) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadForm.patchValue({ [field]: file });

      if (field === 'video') {
        this.selectedVideoFileName = file.name;
      } else if (field === 'thumbnail') {
        this.selectedThumbnailFileName = file.name;
      }
    }
  }

  async uploadVideo() {
    if (this.uploadForm.valid) {
      const formData = new FormData();
      formData.append('title', this.title?.value);
      formData.append('description', this.description?.value);
      formData.append('video_file', this.video?.value);
      formData.append('thumnail_file', this.thumbnail?.value);
      await this.dataManager.uploadVideo(formData);
    } else this.uploadForm.markAllAsTouched();
  }
}
