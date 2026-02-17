import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialHomeComponent } from './material-home.component';

describe('MaterialHomeComponent', () => {
  let component: MaterialHomeComponent;
  let fixture: ComponentFixture<MaterialHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
