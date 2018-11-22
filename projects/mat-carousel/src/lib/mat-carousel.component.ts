import {
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild
} from '@angular/core';
import {
  animate,
  style,
  AnimationBuilder,
  AnimationPlayer
} from '@angular/animations';
import { interval, Observable, Subscription } from 'rxjs';

import { MatCarouselItemComponent } from './mat-carousel-item/mat-carousel-item.component';

@Component({
  selector: 'mat-carousel',
  templateUrl: './mat-carousel.component.html',
  styleUrls: ['./mat-carousel.component.scss']
})
export class MatCarouselComponent implements AfterViewInit, OnDestroy, OnInit {
  // Attributes.
  @Input()
  public timings = '250ms ease-in';
  @Input()
  public loop = true;
  @Input()
  public autoplay = true;
  @Input()
  public autoplayInterval = 5000;
  @Input()
  public showArrows = true;
  @Input()
  public showStepper = true;
  @Input()
  public awaitAnimation = false;

  // Elements.
  @ContentChildren(MatCarouselItemComponent)
  public items: QueryList<MatCarouselItemComponent>;

  public current = 0;
  public playing = false;

  @ViewChild('carouselContainer')
  private carouselContainer: ElementRef;
  @ViewChild('carouselList')
  private carouselList: ElementRef;

  private intervalSubscription: Subscription;
  private interval: Observable<number>;

  constructor(private animationBuilder: AnimationBuilder) {}

  public ngAfterViewInit(): void {
    this.startTimer();
  }

  public ngOnDestroy(): void {
    this.clearInterval();
  }

  public ngOnInit(): void {
    this.interval = interval(this.autoplayInterval);
  }

  public next(): void {
    this.show(this.current + 1);
  }

  public previous(): void {
    this.show(this.current - 1);
  }

  public show(index: number): void {
    this.setCurrent(index);
    this.playAnimation();
  }

  @HostListener('mouseenter')
  public onMouseEnter(): void {
    this.clearInterval();
  }

  @HostListener('mouseleave')
  public onMouseLeave(): void {
    this.startTimer();
  }

  @HostListener('window:resize', ['$event'])
  public onResize(event: Event): void {
    // Reset carousel when window is resized
    // in order to avoid major glitches.
    this.show(0);
  }

  private clearInterval(): void {
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
  }

  private getWidth(): number {
    const el = this.carouselContainer.nativeElement as HTMLElement;
    return el.clientWidth;
  }

  private playAnimation(): void {
    const offset = this.current * this.getWidth();
    const factory = this.animationBuilder.build(
      animate(this.timings, style({ transform: `translateX(-${offset}px)` }))
    );
    const animation = factory.create(this.carouselList.nativeElement);

    if (this.awaitAnimation) {
      animation.onStart(() => (this.playing = true));
      animation.onDone(() => (this.playing = false));
    }

    animation.play();
  }

  private setCurrent(index: number) {
    this.current =
      index === this.items.length
        ? 0 // start carousel over
        : index < 0
        ? this.items.length - 1 // go to last item
        : index;
  }

  private startTimer(): void {
    this.clearInterval();
    if (this.autoplay) {
      this.intervalSubscription = interval(this.autoplayInterval).subscribe(
        () => this.next()
      );
    }
  }
}