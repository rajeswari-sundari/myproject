import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLandscapeComponent } from './dashboard-landscape.component';

describe('DashboardLandscapeComponent', () => {
  let component: DashboardLandscapeComponent;
  let fixture: ComponentFixture<DashboardLandscapeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardLandscapeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardLandscapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
