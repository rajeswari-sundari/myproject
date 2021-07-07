import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlEditComponent } from './control-edit-category.component';

describe('ControlEditComponent', () => {
  let component: ControlEditComponent;
  let fixture: ComponentFixture<ControlEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
