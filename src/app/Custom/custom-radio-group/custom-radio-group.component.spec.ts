import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomRadioGroupComponent } from './custom-radio-group.component';

describe('CustomRadioGroupComponent', () => {
  let component: CustomRadioGroupComponent;
  let fixture: ComponentFixture<CustomRadioGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomRadioGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomRadioGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
