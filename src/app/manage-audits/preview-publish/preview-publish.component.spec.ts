import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewPublishComponent } from './preview-publish.component';

describe('PreviewPublishComponent', () => {
  let component: PreviewPublishComponent;
  let fixture: ComponentFixture<PreviewPublishComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewPublishComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewPublishComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
