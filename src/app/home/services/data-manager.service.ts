import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { lastValueFrom } from 'rxjs';
import { Video } from '../../models/video.model';
import { VideoResponse } from '../interfaces/video-response-interface';

@Injectable({
  providedIn: 'root',
})
export class DataManagerService {
  public publicVideos: { [key: string]: Array<Video> } = {
    fitness: [],
    animals: [],
    landscapes: [],
  };

  public privateVideos: Video[] = [];

  private http = inject(HttpClient);

  constructor() {}

  async getPublicVideos() {
    const url = environment.baseUrl + '/videos/?visibility=public';

    // const url = `${
    //   environment.baseUrl
    // }/videos/?visibility=public&_=${new Date().getTime()}`;

    try {
      const resp = (await lastValueFrom(
        this.http.get(url)
      )) as Array<VideoResponse>;
      const videos = resp.map(
        (videoData: VideoResponse) => new Video(videoData)
      );
      this.sortPublicVideos(videos);
    } catch (err) {
      console.error(err);
    }
  }

  sortPublicVideos(videos: Video[]) {
    console.log(videos);

    this.publicVideos = {
      fitness: [],
      animals: [],
      landscapes: [],
    };

    videos.forEach((video) => {
      switch (video.genre) {
        case 'fitness':
          this.publicVideos['fitness'].push(video);
          break;
        case 'animals':
          this.publicVideos['animals'].push(video);
          break;
        case 'landscapes':
          this.publicVideos['landscapes'].push(video);
          break;
        default:
          break;
      }
    });
  }

  async getPrivateVideos() {
    const url = `${
      environment.baseUrl
    }/videos/?visibility=private&_=${new Date().getTime()}`;

    try {
      const resp = (await lastValueFrom(
        this.http.get(url)
      )) as Array<VideoResponse>;
      const videos = resp.map(
        (videoData: VideoResponse) => new Video(videoData)
      );
      this.privateVideos = videos;
      console.log(this.privateVideos);
    } catch (err) {
      console.error(err);
    }
  }

  async uploadVideo(formData: FormData) {
    const url = environment.baseUrl + '/videos/';
    const body = formData;

    return lastValueFrom(this.http.post(url, body));
  }
}
