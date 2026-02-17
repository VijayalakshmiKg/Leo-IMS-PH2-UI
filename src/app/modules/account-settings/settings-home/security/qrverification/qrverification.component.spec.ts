import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QRVerificationComponent } from './qrverification.component';

describe('QRVerificationComponent', () => {
  let component: QRVerificationComponent;
  let fixture: ComponentFixture<QRVerificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QRVerificationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QRVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
