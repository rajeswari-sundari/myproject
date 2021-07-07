import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlLandscapeComponent } from './control-landscape.component';

describe('ControlLandscapeComponent', () => {
  let component: ControlLandscapeComponent;
  let fixture: ComponentFixture<ControlLandscapeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlLandscapeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlLandscapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
