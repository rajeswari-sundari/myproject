import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlDefinitionComponent } from './control-definition.component';

describe('ControlDefinitionComponent', () => {
  let component: ControlDefinitionComponent;
  let fixture: ComponentFixture<ControlDefinitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlDefinitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
