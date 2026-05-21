import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Recentaudits } from './recentaudits';

describe('Recentaudits', () => {
  let component: Recentaudits;
  let fixture: ComponentFixture<Recentaudits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Recentaudits],
    }).compileComponents();

    fixture = TestBed.createComponent(Recentaudits);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
