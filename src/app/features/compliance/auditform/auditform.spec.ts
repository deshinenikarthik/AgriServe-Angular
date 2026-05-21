import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Auditform } from './auditform';

describe('Auditform', () => {
  let component: Auditform;
  let fixture: ComponentFixture<Auditform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Auditform],
    }).compileComponents();

    fixture = TestBed.createComponent(Auditform);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
