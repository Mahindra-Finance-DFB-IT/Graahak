import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeDetailComponent } from './scheme-detail.component';

describe('SchemeDetailComponent', () => {
  let component: SchemeDetailComponent;
  let fixture: ComponentFixture<SchemeDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeDetailComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchemeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
