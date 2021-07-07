import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishLandscapeComponent } from './publish-landscape.component';

describe('PublishLandscapeComponent', () => {
  let component: PublishLandscapeComponent;
  let fixture: ComponentFixture<PublishLandscapeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublishLandscapeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishLandscapeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
