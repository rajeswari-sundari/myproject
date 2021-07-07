import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridLinkComponent } from './ag-grid-link.component';

describe('AgGridLinkComponent', () => {
  let component: AgGridLinkComponent;
  let fixture: ComponentFixture<AgGridLinkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgGridLinkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
