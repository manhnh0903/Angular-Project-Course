import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MenueStateService {
  public uploadOverlayOpen: boolean = false;
  public userOverlayOpen: boolean = false;
  public deleteUserOverlayOpen: boolean = false;

  constructor() {}
}
