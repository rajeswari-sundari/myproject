import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricsDefinitionComponent } from './metrics-definition.component';

describe('MetricsDefinitionComponent', () => {
  let component: MetricsDefinitionComponent;
  let fixture: ComponentFixture<MetricsDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetricsDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetricsDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
