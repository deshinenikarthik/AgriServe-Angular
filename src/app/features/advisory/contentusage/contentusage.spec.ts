import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Contentusage } from './contentusage';

describe('Contentusage', () => {
  let component: Contentusage;
  let fixture: ComponentFixture<Contentusage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contentusage],
    }).compileComponents();

    fixture = TestBed.createComponent(Contentusage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
