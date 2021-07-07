import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryControlsTabComponent } from './category-controls-tab.component';

describe('CategoryControlsTabComponent', () => {
  let component: CategoryControlsTabComponent;
  let fixture: ComponentFixture<CategoryControlsTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryControlsTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryControlsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
