import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentVerifyMailComponent } from './sent-verify-mail.component';

describe('SentVerifyMailComponent', () => {
  let component: SentVerifyMailComponent;
  let fixture: ComponentFixture<SentVerifyMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SentVerifyMailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SentVerifyMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
