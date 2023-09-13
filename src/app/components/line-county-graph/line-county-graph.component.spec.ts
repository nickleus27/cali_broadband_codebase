import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineCountyGraphComponent } from './line-county-graph.component';

describe('LineCountyGraphComponent', () => {
  let component: LineCountyGraphComponent;
  let fixture: ComponentFixture<LineCountyGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineCountyGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineCountyGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
