import { VideoResponse } from '../home/interfaces/video-response-interface';

export class Video {
  id: number;
  created_at: string;
  title: string;
  description: string;
  thumnail_file: string;
  video_file: string;

  constructor(data: VideoResponse) {
    this.id = data.id;
    this.created_at = data.created_at;
    this.title = data.title;
    this.description = data.description;
    this.thumnail_file = data.thumnail_file;
    this.video_file = data.video_file;
  }

  asJson() {
    return {
      id: this.id,
      created_at: this.created_at,
      title: this.title,
      description: this.description,
      thumnail_file: this.thumnail_file,
      video_file: this.video_file,
    };
  }
}
