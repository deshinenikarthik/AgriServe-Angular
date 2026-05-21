import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Farmerdashboard } from './farmerdashboard';

describe('Farmerdashboard', () => {
  let component: Farmerdashboard;
  let fixture: ComponentFixture<Farmerdashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Farmerdashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(Farmerdashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
