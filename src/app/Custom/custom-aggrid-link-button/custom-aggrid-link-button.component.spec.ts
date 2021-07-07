import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAGGridLinkButtonComponent } from './custom-aggrid-link-button.component';

describe('CustomAGGridLinkButtonComponent', () => {
  let component: CustomAGGridLinkButtonComponent;
  let fixture: ComponentFixture<CustomAGGridLinkButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAGGridLinkButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAGGridLinkButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
