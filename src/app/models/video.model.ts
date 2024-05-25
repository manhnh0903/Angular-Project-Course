import { VideoResponse } from '../home/interfaces/video-response-interface';

export class Video {
  id: number;
  created_at: string;
  title: string;
  description: string;
  thumbnail_file: string;
  video_file: string;
  visibility: string;

  constructor(data: VideoResponse) {
    this.id = data.id;
    this.created_at = data.created_at;
    this.title = data.title;
    this.description = data.description;
    this.thumbnail_file = data.thumbnail_file;
    this.video_file = data.video_file;
    this.visibility = data.visibility;
  }

  asJson() {
    return {
      id: this.id,
      created_at: this.created_at,
      title: this.title,
      description: this.description,
      thumbnail_file: this.thumbnail_file,
      video_file: this.video_file,
      visibility: this.visibility,
    };
  }
}
