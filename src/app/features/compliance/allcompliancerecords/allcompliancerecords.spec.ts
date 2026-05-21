import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Allcompliancerecords } from './allcompliancerecords';

describe('Allcompliancerecords', () => {
  let component: Allcompliancerecords;
  let fixture: ComponentFixture<Allcompliancerecords>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Allcompliancerecords],
    }).compileComponents();

    fixture = TestBed.createComponent(Allcompliancerecords);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
