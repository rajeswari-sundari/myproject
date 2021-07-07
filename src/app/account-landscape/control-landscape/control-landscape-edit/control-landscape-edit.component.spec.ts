import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlLandscapeEditComponent } from './control-landscape-edit.component';

describe('ControlLandscapeEditComponent', () => {
  let component: ControlLandscapeEditComponent;
  let fixture: ComponentFixture<ControlLandscapeEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlLandscapeEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlLandscapeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
