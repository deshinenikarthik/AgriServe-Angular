import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Compliancerecordnavbar } from './compliancerecordnavbar';

describe('Compliancerecordnavbar', () => {
  let component: Compliancerecordnavbar;
  let fixture: ComponentFixture<Compliancerecordnavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Compliancerecordnavbar],
    }).compileComponents();

    fixture = TestBed.createComponent(Compliancerecordnavbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
