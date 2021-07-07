import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishPreviewCheckListComponent } from './publish-preview-check-list.component';

describe('PublishPreviewCheckListComponent', () => {
  let component: PublishPreviewCheckListComponent;
  let fixture: ComponentFixture<PublishPreviewCheckListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishPreviewCheckListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishPreviewCheckListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
