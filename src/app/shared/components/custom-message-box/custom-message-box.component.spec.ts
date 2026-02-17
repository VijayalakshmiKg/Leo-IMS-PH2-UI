import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomMessageBoxComponent } from './custom-message-box.component';

describe('CustomMessageBoxComponent', () => {
  let component: CustomMessageBoxComponent;
  let fixture: ComponentFixture<CustomMessageBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomMessageBoxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomMessageBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
