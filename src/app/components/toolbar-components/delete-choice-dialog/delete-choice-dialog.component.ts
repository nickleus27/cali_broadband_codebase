import { Component, ViewChild } from '@angular/core';
import { ToolbarDialog } from '../ToolbarDialogInterface/ToolbarDialogInterface';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { GraphOptions } from '../../graph-options-dialogs/GraphOptionsModels/GraphOptions';
import { MatSelectionList } from '@angular/material/list';

@Component({
  selector: 'app-delete-choice',
  templateUrl: './delete-choice-dialog.component.html',
  styleUrls: ['./delete-choice-dialog.component.css']
})
export class DeleteChoiceDialogComponent implements ToolbarDialog {
  @ViewChild(MatSelectionList) selectAllList: MatSelectionList;
  graphChoices;
  deletionList: any;

  constructor(
    private cmpntDataSrvc: ComponentDataService,
  ) {
    this.graphChoices = this.cmpntDataSrvc.graphChoices;
    this.deletionList = [];
  }

  ngAfterViewInit() {
    console.log(this.selectAllList)
  }

  onNgModelChange($changes: any): void {
    console.log($changes);
  }

  cancel(): void {

  }

  deleteItems(): void {
    this.cmpntDataSrvc.deleteGraphChoiceItems(this.deletionList);
  }

  selectAll(): void {
    this.selectAllList.selectAll();
  }

  get getCmpntDataSrvc(): ComponentDataService {
    return this.cmpntDataSrvc;
  }
}
