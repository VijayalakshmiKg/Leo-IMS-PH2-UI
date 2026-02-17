import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuHeaderSectionComponent } from './menu-header-section.component';

describe('MenuHeaderSectionComponent', () => {
  let component: MenuHeaderSectionComponent;
  let fixture: ComponentFixture<MenuHeaderSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MenuHeaderSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuHeaderSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
