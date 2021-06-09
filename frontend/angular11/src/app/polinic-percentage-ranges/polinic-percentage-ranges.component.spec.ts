import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolinicPercentageRangesComponent } from './polinic-percentage-ranges.component';

describe('PolinicPercentageRangesComponent', () => {
  let component: PolinicPercentageRangesComponent;
  let fixture: ComponentFixture<PolinicPercentageRangesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolinicPercentageRangesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolinicPercentageRangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
