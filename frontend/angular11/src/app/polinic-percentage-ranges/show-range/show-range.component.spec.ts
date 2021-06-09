import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowRangeComponent } from './show-range.component';

describe('ShowRangeComponent', () => {
  let component: ShowRangeComponent;
  let fixture: ComponentFixture<ShowRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowRangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
