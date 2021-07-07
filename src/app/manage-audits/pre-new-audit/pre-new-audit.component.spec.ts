import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreNewAuditComponent } from './pre-new-audit.component';

describe('NewAuditComponent', () => {
  let component: PreNewAuditComponent;
  let fixture: ComponentFixture<PreNewAuditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreNewAuditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreNewAuditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
