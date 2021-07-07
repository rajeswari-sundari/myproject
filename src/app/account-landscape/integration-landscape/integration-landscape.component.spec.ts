import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegrationLandscapeComponent } from './integration-landscape.component';

describe('IntegrationLandscapeComponent', () => {
  let component: IntegrationLandscapeComponent;
  let fixture: ComponentFixture<IntegrationLandscapeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntegrationLandscapeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntegrationLandscapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
