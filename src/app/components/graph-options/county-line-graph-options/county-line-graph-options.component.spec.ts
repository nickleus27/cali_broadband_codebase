import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountyLineGraphOptionsComponent } from './county-line-graph-options.component';

describe('CountyLineGraphOptionsComponent', () => {
  let component: CountyLineGraphOptionsComponent;
  let fixture: ComponentFixture<CountyLineGraphOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CountyLineGraphOptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountyLineGraphOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
