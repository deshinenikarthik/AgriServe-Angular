import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Advisorycontent } from './advisorycontent';

describe('Advisorycontent', () => {
  let component: Advisorycontent;
  let fixture: ComponentFixture<Advisorycontent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Advisorycontent],
    }).compileComponents();

    fixture = TestBed.createComponent(Advisorycontent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
