import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggrOptionsDialogsComponent } from './aggr-options-dialogs.component';

describe('AggrOptionsDialogsComponent', () => {
  let component: AggrOptionsDialogsComponent;
  let fixture: ComponentFixture<AggrOptionsDialogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AggrOptionsDialogsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AggrOptionsDialogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
