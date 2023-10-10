import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineGraphOptionsComponent } from './line-graph-options.component';

describe('LineGraphOptionsComponent', () => {
  let component: LineGraphOptionsComponent;
  let fixture: ComponentFixture<LineGraphOptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineGraphOptionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineGraphOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
