import {
  trigger,
  state,
  style,
  animate,
  transition,
  sequence,
  query,
  group,
  keyframes,
} from '@angular/animations';

export class Animations {
  static slideInOutAnimation = trigger('slideInOutAnimation', [
    state('in', style({ transform: 'translateX(0)' })),
    transition(':enter', [
      style({ transform: 'translateX(calc(100% + 60px))' }),
      animate('0.5s ease-in-out'),
    ]),
  ]);

  static landingPageAnimation = trigger('landingPageAnimation', [
    transition(
      ':enter',
      sequence([
        // logo to left side
        group([
          query('.logo-wrapper', [
            animate(
              '1s ease-in-out',
              style({
                left: 'calc(50% - 300px)',
              })
            ),
          ]),
          query('.logo-mask', [
            animate(
              '1s ease-in-out',
              style({
                left: 'calc(50% - 300px)',
              })
            ),
          ]),
        ]),

        // animate text

        query('.logo-wrapper span', [
          animate('1s ease-in-out', style({ left: ' calc(70px + 16px)' })),
        ]),

        // logo + lext top left corner and opacity of background
        group([
          query('.logo-mask', [
            animate(
              '1ms ease-in-out',
              style({
                opacity: '0',
              })
            ),
          ]),
          query('.logo-wrapper', [
            animate('1s ease-in-out', style({ left: ' 45px', top: '25px' })),
          ]),
          query('.logo-mask', [
            animate('1s ease-in-out', style({ left: '45px' })),
          ]),
          query('.logo-wrapper span', [
            animate('1s ease-in-out', style({ color: 'black' })),
          ]),
          query('.background', [
            animate('1s ease-in-out', style({ opacity: '0' })),
          ]),
        ]),
      ])
    ),
  ]);
}
