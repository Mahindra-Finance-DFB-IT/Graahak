import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsDataComponent } from './logs-data.component';

describe('LogsDataComponent', () => {
  let component: LogsDataComponent;
  let fixture: ComponentFixture<LogsDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LogsDataComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogsDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
