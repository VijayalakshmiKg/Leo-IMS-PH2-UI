import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplatePaginatorComponent } from './template-paginator.component';

describe('TemplatePaginatorComponent', () => {
  let component: TemplatePaginatorComponent;
  let fixture: ComponentFixture<TemplatePaginatorComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplatePaginatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatePaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
