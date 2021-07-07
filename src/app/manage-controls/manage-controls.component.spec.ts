import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageControlsComponent } from './manage-controls.component';

describe('ManageControlsComponent', () => {
  let component: ManageControlsComponent;
  let fixture: ComponentFixture<ManageControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
