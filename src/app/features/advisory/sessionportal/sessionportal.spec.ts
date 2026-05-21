import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sessionportal } from './sessionportal';

describe('Sessionportal', () => {
  let component: Sessionportal;
  let fixture: ComponentFixture<Sessionportal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sessionportal],
    }).compileComponents();

    fixture = TestBed.createComponent(Sessionportal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
