import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePocComponent } from './manage-poc.component';

describe('ManagePocComponent', () => {
  let component: ManagePocComponent;
  let fixture: ComponentFixture<ManagePocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagePocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
