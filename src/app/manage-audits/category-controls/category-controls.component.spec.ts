import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryControlsComponent } from './category-controls.component';

describe('CategoryControlsComponent', () => {
  let component: CategoryControlsComponent;
  let fixture: ComponentFixture<CategoryControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CategoryControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
