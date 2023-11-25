import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HomeNavigationService {
  mainChatPath: string = 'pm';
  threadOpen: boolean = false;

  constructor() { }

  setChatPath(path: string) {
    this.mainChatPath = path;
  }

  toggleThread() {
    this.threadOpen = !this.threadOpen;
  }


  


}
