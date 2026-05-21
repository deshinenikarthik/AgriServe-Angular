import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Uploadcontent } from './uploadcontent';

describe('Uploadcontent', () => {
  let component: Uploadcontent;
  let fixture: ComponentFixture<Uploadcontent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Uploadcontent],
    }).compileComponents();

    fixture = TestBed.createComponent(Uploadcontent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
