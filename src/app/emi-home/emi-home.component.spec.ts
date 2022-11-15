import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmiHomeComponent } from './emi-home.component';

describe('EmiHomeComponent', () => {
  let component: EmiHomeComponent;
  let fixture: ComponentFixture<EmiHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmiHomeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmiHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
