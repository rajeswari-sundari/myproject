import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreauditChecklistTasksComponent } from './preaudit-checklist-tasks.component';

describe('PreauditChecklistTasksComponent', () => {
  let component: PreauditChecklistTasksComponent;
  let fixture: ComponentFixture<PreauditChecklistTasksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreauditChecklistTasksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreauditChecklistTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
