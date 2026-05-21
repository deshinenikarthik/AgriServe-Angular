import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Compliancerecordform } from './compliancerecordform';

describe('Compliancerecordform', () => {
  let component: Compliancerecordform;
  let fixture: ComponentFixture<Compliancerecordform>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Compliancerecordform],
    }).compileComponents();

    fixture = TestBed.createComponent(Compliancerecordform);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
