import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMetricsDefinationComponent } from './edit-metrics-defination.component';

describe('EditMetricsDefinationComponent', () => {
  let component: EditMetricsDefinationComponent;
  let fixture: ComponentFixture<EditMetricsDefinationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMetricsDefinationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMetricsDefinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
