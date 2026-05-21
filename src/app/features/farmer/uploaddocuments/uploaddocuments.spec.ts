import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Uploaddocuments } from './uploaddocuments';

describe('Uploaddocuments', () => {
  let component: Uploaddocuments;
  let fixture: ComponentFixture<Uploaddocuments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Uploaddocuments],
    }).compileComponents();

    fixture = TestBed.createComponent(Uploaddocuments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
