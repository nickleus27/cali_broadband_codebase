import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComponentDataService {
  private _graphButtonDisabled: Subject<boolean>;
    
  constructor() {
    this._graphButtonDisabled = new BehaviorSubject(true);
  }
  
  updateFlag(value: boolean): void {
    this._graphButtonDisabled.next(value);
  }

  get displayFlag(): Observable<boolean> {
    return this._graphButtonDisabled.asObservable();
  }
}
