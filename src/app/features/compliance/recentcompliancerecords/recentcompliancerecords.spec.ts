import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recentcompliancerecords } from './recentcompliancerecords';

describe('Recentcompliancerecords', () => {
  let component: Recentcompliancerecords;
  let fixture: ComponentFixture<Recentcompliancerecords>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recentcompliancerecords],
    }).compileComponents();

    fixture = TestBed.createComponent(Recentcompliancerecords);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
