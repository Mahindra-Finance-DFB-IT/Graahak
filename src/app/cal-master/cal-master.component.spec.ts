import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalMasterComponent } from './cal-master.component';

describe('CalMasterComponent', () => {
  let component: CalMasterComponent;
  let fixture: ComponentFixture<CalMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
