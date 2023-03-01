import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidebarStateService {

  private _sidebarState: any;

  constructor() { 
    this._sidebarState = {
      state: 'graph1',
      graph1: false,
      graph2: false,
      graph3: false,
      };
    }

  get accepting(): boolean {
    return this._sidebarState[this._sidebarState.state];
  }

  set state(state: string) {
    this._sidebarState.state = state;
  }

  acceptingState(state: string) {
    this._sidebarState[state] = true;
  }

  reset(): void {
    this._sidebarState = {
      state: 'graph1',
      graph1: false,
      graph2: false,
      graph3: false,
      };
  }
}
