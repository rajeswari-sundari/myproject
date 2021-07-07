import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditControlComponent } from './add-edit-control.component';

describe('AddEditControlComponent', () => {
  let component: AddEditControlComponent;
  let fixture: ComponentFixture<AddEditControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
