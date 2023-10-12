import {
  ElementRef,
  Output,
  Directive,
  AfterViewInit,
  OnDestroy,
  EventEmitter,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { fromEvent } from 'rxjs';
import { startWith } from 'rxjs/operators';

@Directive({
  selector: '[appear]',
})
export class AppearDirective implements AfterViewInit, OnDestroy {
  @Output() appear: EventEmitter<void>;

  elementPos!: number;
  elementHeight!: number;

  scrollPos!: number;
  windowHeight!: number;

  subscriptionScroll!: Subscription;
  subscriptionResize!: Subscription;

  constructor(private element: ElementRef) {
    this.appear = new EventEmitter<void>();
  }

  /**
   * Saves the dimensions and position information of an element.
   * It calculates and stores the position of the element on the page ('elementPos'),
   * the height of the element ('elementHeight'), and the height of the window ('windowHeight').
   */
  saveDimensions() {
    this.elementPos = this.getOffsetTop(this.element.nativeElement);
    this.elementHeight = this.element.nativeElement.offsetHeight;
    this.windowHeight = window.innerHeight;
  }

  /**
   * Saves the current vertical scroll position of the window.
   * It stores the current vertical scroll position in the 'scrollPos' property.
   */
  saveScrollPos() {
    this.scrollPos = window.scrollY;
  }

  /**
   * Recursively calculates the offset top of an element relative to its offset parent.
   * It computes the vertical distance between the element and its closest offset parent,
   * including all ancestor elements. This is used to determine an element's position on the page.
   *
   * @param {any} element - The element for which the offset top is calculated.
   * @returns {number} - The calculated offset top in pixels.
   */
  getOffsetTop(element: any) {
    let offsetTop = element.offsetTop || 0;
    if (element.offsetParent) {
      offsetTop += this.getOffsetTop(element.offsetParent);
    }
    return offsetTop;
  }

  /**
   * Checks and triggers an event if the element becomes visible in the viewport.
   * It first checks if the element is visible using the 'isVisible()' method.
   * If it's visible, it saves the element dimensions and checks visibility again.
   * If the element is still visible, it unsubscribes from further checks and emits the 'appear' event.
   */
  checkVisibility() {
    if (this.isVisible()) {
      this.saveDimensions();
      if (this.isVisible()) {
        this.unsubscribe();
        this.appear.emit();
      }
    }
  }

  /**
   * Checks if the element is currently visible in the viewport.
   * It determines visibility based on the comparison of the vertical scroll position ('scrollPos')
   * and the position of the element ('elementPos'), taking into account a vertical buffer of 200 pixels.
   * If the element's top or a portion of it is within the viewport, it's considered visible.
   *
   * @returns {boolean} - True if the element is currently visible, otherwise false.
   */
  isVisible() {
    return (
      this.scrollPos >= this.elementPos ||
      this.scrollPos + this.windowHeight >= this.elementPos + 200
    );
  }

  /**
   * Subscribes to scroll and resize events on the window.
   * It sets up event listeners for 'scroll' and 'resize' on the window.
   * When these events are triggered, it calls functions to save scroll position and dimensions,
   * as well as checks element visibility to respond to changes in the viewport.
   */
  subscribe() {
    this.subscriptionScroll = fromEvent(window, 'scroll')
      .pipe(startWith(null))
      .subscribe(() => {
        this.saveScrollPos();
        this.checkVisibility();
      });
    this.subscriptionResize = fromEvent(window, 'resize')
      .pipe(startWith(null))
      .subscribe(() => {
        this.saveDimensions();
        this.checkVisibility();
      });
  }

  /**
   * Unsubscribes from scroll and resize event subscriptions.
   * It checks if there are active subscriptions for 'scroll' and 'resize' events,
   * and if so, it unsubscribes from them to stop listening to these events.
   */
  unsubscribe() {
    if (this.subscriptionScroll) {
      this.subscriptionScroll.unsubscribe();
    }
    if (this.subscriptionResize) {
      this.subscriptionResize.unsubscribe();
    }
  }

  /**
   * Lifecycle hook called after the component's view has been initialized.
   * It is used to set up event subscriptions for 'scroll' and 'resize' events on the window,
   * enabling the component to respond to these events when the view is ready.
   */
  ngAfterViewInit() {
    this.subscribe();
  }

  /**
   * Lifecycle hook called when the component is being destroyed.
   * It is used to unsubscribe from previously set event subscriptions,
   * ensuring that there are no memory leaks and that the component cleans up properly.
   */
  ngOnDestroy() {
    this.unsubscribe();
  }
}
