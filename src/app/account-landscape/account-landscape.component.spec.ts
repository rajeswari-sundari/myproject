import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountLandscapeComponent } from './account-landscape.component';

describe('AccountLandscapeComponent', () => {
  let component: AccountLandscapeComponent;
  let fixture: ComponentFixture<AccountLandscapeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountLandscapeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountLandscapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
