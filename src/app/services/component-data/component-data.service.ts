import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentDataService {
  private _graphButtonDisabled: Subject<boolean>;
  private _sideNavFlag: Subject<boolean>;

    
  constructor() {
    this._graphButtonDisabled = new BehaviorSubject(true);
    this._sideNavFlag = new BehaviorSubject(true);

  }
  
  updateGraphButtonFlag(value: boolean): void {
    this._graphButtonDisabled.next(value);
  }

  updateSideNavFlag(value: boolean): void {
    this._sideNavFlag.next(value);
  }

  get displayButtonFlag(): Observable<boolean> {
    return this._graphButtonDisabled.asObservable();
  }

  get sideNavFlag() : Observable<boolean> {
    return this._sideNavFlag.asObservable();
  }
  
}
