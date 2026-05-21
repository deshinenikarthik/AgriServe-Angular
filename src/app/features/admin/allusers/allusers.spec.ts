import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Allusers } from './allusers';

describe('Allusers', () => {
  let component: Allusers;
  let fixture: ComponentFixture<Allusers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Allusers],
    }).compileComponents();

    fixture = TestBed.createComponent(Allusers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
