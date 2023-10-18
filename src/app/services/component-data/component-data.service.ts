import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { GraphOptions } from 'src/app/components/graph-options-dialogs/GraphOptionsModels/GraphOptions';

@Injectable({
  providedIn: 'root'
})
export class ComponentDataService {
  private _model_map: { [key: string]: string };
  private _round_map: { [key: string]: string };
  private _graphChoices: GraphOptions[];
  private _graphChoicesSubject: Subject<GraphOptions[]>;

  constructor() {
    this._model_map = {
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
    this._round_map = { 'round14': 'Spring 2021', 'round15': 'Fall 2021', 'round16': 'Summer 2022' };
    this._graphChoices = [];
    this._graphChoicesSubject = new Subject();
  }

  public getModelMapValue(key: string): string {
    return this._model_map[key];
  }

  public getRoundMapValue(key: string): string {
    return this._round_map[key];
  }

  public pushGraphChoices(graphChoice: GraphOptions): void {
    this._graphChoices.push(graphChoice);
  }
  public clearGraphChoices(): void {
    this._graphChoices.length = 0;
  }
  // return a copy
  get graphChoices(): GraphOptions[] {
    return this._graphChoices.map(choice => choice);
  }

  get graphChoicesObsrv(): Observable<GraphOptions[]> {
    return this._graphChoicesSubject;
  }

  public updateGraphChoices(): void {
    this._graphChoicesSubject.next(this._graphChoices);
  }

  /**
   * 
   * @param deletionList 
   */
  public deleteGraphChoiceItems(deletionList: any): void {
    this._graphChoices = this._graphChoices.filter(item => {
      switch (item.graphType) {
        case 'bar-graph':
          return !this.inList(deletionList,
            (itemToDelete: GraphOptions) => {
              return item.roundSelected === itemToDelete.roundSelected
                && item.carrierSelected === itemToDelete.carrierSelected
                && item.phoneSelected === itemToDelete.phoneSelected
            });
        case 'line-graph':
          return !this.inList(deletionList,
            (itemToDelete: GraphOptions) => {
              return item.carrierSelected === itemToDelete.carrierSelected
                && item.speedRangeSelected === itemToDelete.speedRangeSelected;
            });
        case 'county-line-graph':
          return !this.inList(deletionList,
            (itemToDelete: GraphOptions) => {
              return item.countySelected === itemToDelete.countySelected
                && item.carrierSelected === itemToDelete.carrierSelected;
            });
        default:
          console.log("Malformed graph choice");
          return false;
      }
    });
    this.updateGraphChoices();
  }

  private inList(list: any[], cb: any): boolean {
    return list.some(cb);
  }
}
