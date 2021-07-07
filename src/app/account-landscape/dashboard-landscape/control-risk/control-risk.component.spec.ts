import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlRiskComponent } from './control-risk.component';

describe('ControlRiskComponent', () => {
  let component: ControlRiskComponent;
  let fixture: ComponentFixture<ControlRiskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlRiskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlRiskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
