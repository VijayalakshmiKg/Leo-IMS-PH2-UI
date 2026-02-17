import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryContactInformationComponent } from './primary-contact-information.component';

describe('PrimaryContactInformationComponent', () => {
  let component: PrimaryContactInformationComponent;
  let fixture: ComponentFixture<PrimaryContactInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrimaryContactInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrimaryContactInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
