import { Component } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NgxImageSliderComponent } from './image-slider.component';
import { NgxImageSliderModule } from './image-slider.module';

@Component({
  selector: 'ngx-image-slider-test-wrapper-component',
  template: '<ngx-image-slider [autoplay]="false"><ngx-image-slider-item *ngFor="let slide of slides"></ngx-image-slider-item></ngx-image-slider>'
})
class NgxImageSliderTestWrapperComponent {
  public slides = new Array<never>(5);
}

describe('NgxImageSliderComponent', () => {
  let component: NgxImageSliderComponent;
  let fixture: ComponentFixture<NgxImageSliderTestWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NgxImageSliderTestWrapperComponent],
      imports: [
        NoopAnimationsModule,
        MatButtonModule,
        MatIconModule,
        NgxImageSliderModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxImageSliderTestWrapperComponent);
    component = fixture.debugElement.children[0].componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start with index 0', () => {
    expect(component.currentIndex).toBe(0);
  });

  it('should have 5 children', () => {
    expect(component.slidesList.length).toBe(5);
  });

  it('should adjust itself to have 3 children', () => {
    component.slides = 3;
    expect(component.slidesList.length).toBe(3);
  });

  it('should change index to 1', () => {
    component.next();
    expect(component.currentIndex).toBe(1);
  });

  it('should change index to last element', () => {
    component.slideTo(component.slidesList.length - 1);
    expect(component.currentIndex).toBe(4);
  });

  it('should go from last to first slide', () => {
    component.slideTo(component.slidesList.length - 1);
    component.next();
    expect(component.currentIndex).toBe(0);
  });

  it('should go from first to last slide', () => {
    component.previous();
    expect(component.currentIndex).toBe(4);
  });

  it('should not loop to previous', () => {
    component.loop = false;
    component.previous();
    expect(component.currentIndex).toBe(0);
  });

  describe('@Output(change)', () => {
    beforeEach(() => {
      spyOn(component.changeEmitter, 'emit');
      component.loop = true;
    });

    it('should emit when slideTo is called', fakeAsync(() => {
      const idx = (component.currentIndex + 1) % component.slidesList.length;
      component.slideTo(idx);
      tick();

      expect(component.changeEmitter.emit).toHaveBeenCalledWith(idx);
    }));

    it('should emit when next is called', fakeAsync(() => {
      component.next();
      tick();

      expect(component.changeEmitter.emit).toHaveBeenCalledWith(1);
    }));

    it('should emit when previous is called', fakeAsync(() => {
      component.previous();
      tick();

      expect(component.changeEmitter.emit).toHaveBeenCalledWith(component.slidesList.length - 1);
    }));

    it('should emit when autoplay is set', fakeAsync(() => {
      component.autoplay = true;
      component.interval = 100;
      tick(100);

      component.autoplay = false;

      expect(component.changeEmitter.emit).toHaveBeenCalledWith(1);
    }));
  });
});
