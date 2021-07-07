import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreauditUpdateTasksComponent } from './preaudit-update-tasks.component';

describe('PreauditUpdateTasksComponent', () => {
  let component: PreauditUpdateTasksComponent;
  let fixture: ComponentFixture<PreauditUpdateTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreauditUpdateTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreauditUpdateTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
