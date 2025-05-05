import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceabilityMatrixComponent } from './traceability-matrix.component';

describe('TraceabilityMatrixComponent', () => {
  let component: TraceabilityMatrixComponent;
  let fixture: ComponentFixture<TraceabilityMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraceabilityMatrixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraceabilityMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
