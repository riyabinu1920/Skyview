import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Skyview } from './skyview';

describe('Skyview', () => {
  let component: Skyview;
  let fixture: ComponentFixture<Skyview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Skyview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Skyview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
