import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeListComponent } from './scheme-list.component';

describe('SchemeListComponent', () => {
  let component: SchemeListComponent;
  let fixture: ComponentFixture<SchemeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchemeListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchemeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
