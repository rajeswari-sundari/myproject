import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePOCChecklistComponent } from './manage-poc-checklist.component';

describe('ManagePOCChecklistComponent', () => {
  let component: ManagePOCChecklistComponent;
  let fixture: ComponentFixture<ManagePOCChecklistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePOCChecklistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePOCChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
