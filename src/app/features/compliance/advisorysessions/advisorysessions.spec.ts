import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Advisorysessions } from './advisorysessions';

describe('Advisorysessions', () => {
  let component: Advisorysessions;
  let fixture: ComponentFixture<Advisorysessions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Advisorysessions],
    }).compileComponents();

    fixture = TestBed.createComponent(Advisorysessions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
