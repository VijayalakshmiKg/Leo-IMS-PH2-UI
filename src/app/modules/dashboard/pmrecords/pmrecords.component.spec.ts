import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmrecordsComponent } from './pmrecords.component';

describe('PmrecordsComponent', () => {
  let component: PmrecordsComponent;
  let fixture: ComponentFixture<PmrecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmrecordsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PmrecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
