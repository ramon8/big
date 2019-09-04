import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeInfoComponent } from './shape-info.component';

describe('ShapeInfoComponent', () => {
  let component: ShapeInfoComponent;
  let fixture: ComponentFixture<ShapeInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapeInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShapeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
