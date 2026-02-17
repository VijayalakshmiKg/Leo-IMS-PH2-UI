import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialMainComponent } from './material-main.component';

describe('MaterialMainComponent', () => {
  let component: MaterialMainComponent;
  let fixture: ComponentFixture<MaterialMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaterialMainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaterialMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
