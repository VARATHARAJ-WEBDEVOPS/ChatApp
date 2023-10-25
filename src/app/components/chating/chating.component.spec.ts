import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatingComponent } from './chating.component';

describe('ChatingComponent', () => {
  let component: ChatingComponent;
  let fixture: ComponentFixture<ChatingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatingComponent]
    });
    fixture = TestBed.createComponent(ChatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
