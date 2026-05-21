import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mydocuments } from './mydocuments';

describe('Mydocuments', () => {
  let component: Mydocuments;
  let fixture: ComponentFixture<Mydocuments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mydocuments],
    }).compileComponents();

    fixture = TestBed.createComponent(Mydocuments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
