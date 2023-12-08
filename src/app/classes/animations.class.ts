import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

export class Animations {
  static slideInOutAnimation = trigger('slideInOutAnimation', [
    state('in', style({ transform: 'translateX(0)' })),
    transition(':enter', [
      style({ transform: 'translateX(calc(100% + 60px))' }),
      animate('0.5s ease-in-out'),
    ]),
  ]);
}
