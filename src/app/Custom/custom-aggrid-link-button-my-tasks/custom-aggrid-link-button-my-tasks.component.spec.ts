import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomAggridLinkButtonMyTasksComponent } from './custom-aggrid-link-button-my-tasks.component';

describe('CustomAggridLinkButtonMyTasksComponent', () => {
  let component: CustomAggridLinkButtonMyTasksComponent;
  let fixture: ComponentFixture<CustomAggridLinkButtonMyTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomAggridLinkButtonMyTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomAggridLinkButtonMyTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
