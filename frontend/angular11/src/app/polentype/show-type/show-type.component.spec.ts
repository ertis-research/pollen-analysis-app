import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowTypeComponent } from './show-type.component';

describe('ShowTypeComponent', () => {
  let component: ShowTypeComponent;
  let fixture: ComponentFixture<ShowTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
