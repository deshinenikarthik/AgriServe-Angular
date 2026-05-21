import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trainingprograms } from './trainingprograms';

describe('Trainingprograms', () => {
  let component: Trainingprograms;
  let fixture: ComponentFixture<Trainingprograms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Trainingprograms],
    }).compileComponents();

    fixture = TestBed.createComponent(Trainingprograms);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
