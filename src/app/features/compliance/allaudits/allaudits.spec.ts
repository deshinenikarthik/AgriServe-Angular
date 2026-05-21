import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Allaudits } from './allaudits';

describe('Allaudits', () => {
  let component: Allaudits;
  let fixture: ComponentFixture<Allaudits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Allaudits],
    }).compileComponents();

    fixture = TestBed.createComponent(Allaudits);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
