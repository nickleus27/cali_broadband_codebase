import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BarGraphOptionsComponent } from './bar-graph-options.component';

describe('BarGraphOptionsComponent', () => {
  let component: BarGraphOptionsComponent;
  let fixture: ComponentFixture<BarGraphOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BarGraphOptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BarGraphOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
