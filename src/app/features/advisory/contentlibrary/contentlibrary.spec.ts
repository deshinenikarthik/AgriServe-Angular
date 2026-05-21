import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Contentlibrary } from './contentlibrary';

describe('Contentlibrary', () => {
  let component: Contentlibrary;
  let fixture: ComponentFixture<Contentlibrary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Contentlibrary],
    }).compileComponents();

    fixture = TestBed.createComponent(Contentlibrary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
