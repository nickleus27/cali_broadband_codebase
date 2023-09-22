import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountyLineGraphComponent } from './county-line-graph.component';

describe('CountyLineGraphComponent', () => {
  let component: CountyLineGraphComponent;
  let fixture: ComponentFixture<CountyLineGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountyLineGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountyLineGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
