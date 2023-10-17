import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteChoiceComponent } from './delete-choice-dialog.component';

describe('DeleteChoiceComponent', () => {
  let component: DeleteChoiceComponent;
  let fixture: ComponentFixture<DeleteChoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteChoiceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteChoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
