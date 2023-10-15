import { Component, OnChanges } from '@angular/core';
import { OptionsDialog } from '../OptionsDialogInterface/OptionsDialog';
import { GraphOptions } from '../GraphOptionsModels/GraphOptions';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { ComponentDataService } from 'src/app/services/component-data/component-data.service';
import { ActivatedRoute, Router } from '@angular/router';

export enum DialogViews {
  roundView,
  carrierView,
  phoneView
};

@Component({
  selector: 'app-bar-graph-options',
  templateUrl: './bar-graph-options.component.html',
  styleUrls: ['./bar-graph-options.component.css']
})

export class BarGraphOptionsComponent implements OptionsDialog, OnChanges {
  dialogViews = DialogViews;
  graphChoices: GraphOptions;
  rounds: string[];
  roundMap: { [key: string]: any };
  carriers: string[];
  carrierMap: { [key: string]: any };
  phoneMap: { [key: string]: any };
  _next: BehaviorSubject<number>;
  disableDisplayButton: BehaviorSubject<boolean>;


  constructor(private cmpntDataSrvc: ComponentDataService,
    private route: ActivatedRoute,
    private router: Router) {
    this.graphChoices = {
      graphType: "bar-graph",
    };
    this.phoneMap = {
      'XP8800': 'Sonim XP8',
      'SM-G970U': 'Galaxy S10e',
      'SM-G998U': 'Galaxy S21',
      'SM-G973U': 'Galaxy S10',
      'SM-S901U': 'Galaxy S22',
      'SM-G930A': 'Galaxy S7',
      'SM-G930P': 'Galaxy S7',
      'SM-G930T': 'Galaxy S7',
      'SM-G930V': 'Galaxy S7'
    };
    this.carriers = [
      'AT&T',
      'FirstNet',
      'Sprint',
      'T-Mobile',
      'Verizon'
    ];
    this.carrierMap = {
      'round14': {
        'AT&T': ['SM-G998U', 'SM-G970U'],
        'FirstNet': ['XP8800'],
        'Sprint': ['SM-G973U'],
        'T-Mobile': ['SM-G998U', 'SM-G970U'],
        'Verizon': ['SM-G998U', 'SM-G970U']
      },
      'round15': {
        'AT&T': ['SM-G998U', 'SM-G970U'],
        'FirstNet': ['XP8800'],
        'Sprint': ['SM-G973U'],
        'T-Mobile': ['SM-G998U', 'SM-G970U'],
        'Verizon': ['SM-G998U', 'SM-G970U']
      },
      'round16': {
        'AT&T': ['SM-S901U'],
        'FirstNet': ['SM-G998U'],
        'Sprint': ['SM-G973U'],
        'T-Mobile': ['SM-S901U', 'SM-G970U'],
        'Verizon': ['SM-S901U']
      }
    };
    this.rounds = ['round14', 'round15', 'round16'];
    this.roundMap = { 'round14': 'Spring 2021', 'round15': 'Fall 2021', 'round16': 'Summer 2022' };
    this._next = new BehaviorSubject(this.dialogViews.roundView);
    this.disableDisplayButton = new BehaviorSubject(true);
  }

  ngOnChanges() {
    if (!!this.graphChoices.phoneSelected) {
      this.disableDisplayButton.next(false);
    }
  }

  cancel() {
    this.cmpntDataSrvc.clearGraphChoices();
  }

  back() {
    switch (this._next.value) {
      case this.dialogViews.carrierView:
        this._next.next(this.dialogViews.roundView);
        break;
      case this.dialogViews.phoneView:
        this._next.next(this.dialogViews.carrierView);
        break;
      default:
        console.log("Malformed dialog view value");
        break;
    }
  }

  next() {
    switch (this._next.value) {
      case this.dialogViews.roundView:
        if (!!this.graphChoices.roundSelected) {
          this._next.next(this.dialogViews.carrierView);
        }
        break;
      case this.dialogViews.carrierView:
        if (!!this.graphChoices.carrierSelected) {
          this._next.next(this.dialogViews.phoneView);
        }
        break;
      default:
        console.log("Malformed dialog view value");
        break;
    }
  }

  add() {
    if (!!this.graphChoices.phoneSelected) {
      this.cmpntDataSrvc.pushGraphChoices(this.graphChoices);
      this.graphChoices = {
        graphType: "bar-graph",
      };
      this.disableDisplayButton.next(true);
      this._next.next(this.dialogViews.roundView);
    }
  }

  display() {

    if (!!this.graphChoices.phoneSelected) {
      this.cmpntDataSrvc.pushGraphChoices(this.graphChoices);
      this.router.navigate(['graphs'], { relativeTo: this.route });
    }
  }

}
