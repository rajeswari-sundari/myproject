import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCategoryControlComponent } from './edit-category-control.component';

describe('EditCategoryControlComponent', () => {
  let component: EditCategoryControlComponent;
  let fixture: ComponentFixture<EditCategoryControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCategoryControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCategoryControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
