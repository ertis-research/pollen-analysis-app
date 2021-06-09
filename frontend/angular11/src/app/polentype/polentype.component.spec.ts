import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolenTypeComponent } from './polentype.component';

describe('PolenTypeComponent', () => {
  let component: PolenTypeComponent;
  let fixture: ComponentFixture<PolenTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolenTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolenTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
