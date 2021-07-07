import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAggridLinkButtonAcclsComponent } from './custom-aggrid-link-button-accls.component';

describe('CustomAggridLinkButtonAcclsComponent', () => {
  let component: CustomAggridLinkButtonAcclsComponent;
  let fixture: ComponentFixture<CustomAggridLinkButtonAcclsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAggridLinkButtonAcclsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAggridLinkButtonAcclsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
