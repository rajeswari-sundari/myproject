import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageMetricsComponent } from './manage-metrics.component';

describe('ManageMetricsComponent', () => {
  let component: ManageMetricsComponent;
  let fixture: ComponentFixture<ManageMetricsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageMetricsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageMetricsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
