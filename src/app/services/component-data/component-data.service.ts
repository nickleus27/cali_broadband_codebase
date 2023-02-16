import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root'
})
export class ComponentDataService {
  private _graphButtonDisabled: Subject<boolean>;
  private _compButtonDisabled: Subject<boolean>;
  private _sideNav_GraphComp: Subject<boolean>;
  private _phoneModel: Subject<string>;
  private _model_map: {[key:string]: string};
  private _server_map: {[key:string]: string};
  private _round_map: {[key:string]: string};
  private _graph_map: {[key:string]: string};
  
  constructor(private toast: NgToastService) {
    this._graphButtonDisabled = new BehaviorSubject(true);
    this._compButtonDisabled = new BehaviorSubject(true);
    this._sideNav_GraphComp = new BehaviorSubject(false);
    this._phoneModel = new BehaviorSubject('');
    this._model_map = { 'XP8800': 'Sonim XP8', 'SM-G970U': 'Galaxy S10e', 'SM-G998U': 'Galaxy S21', 'SM-G973U': 'Galaxy S10', 'SM-S901U': 'Galaxy S22' };
    this._server_map  = { 'wTCPup1': "West Uploads", 'wTCPdown1': "West Downloads", 'eTCPup1': "East Uploads", 'eTCPdown1': "East Downloads" };
    this._round_map = { 'round14': 'Spring 2021', 'round15': 'Fall 2021', 'round16': 'Summer 2022'};
    this._graph_map = { 'graph1': 'Graph 1', 'graph2': 'Graph 2', 'graph3': 'Graph 3'};
  }
  
  updateGraphButtonFlag(value: boolean): void {
    this._graphButtonDisabled.next(value);
  }

  get displayButtonFlag(): Observable<boolean> {
    return this._graphButtonDisabled.asObservable();
  }

  updateCompButtonFlag(value: boolean): void {
    this._compButtonDisabled.next(value);
  }

  get displayCompButtonFlag(): Observable<boolean> {
    return this._compButtonDisabled.asObservable();
  }

  updateSideNavComp(value: boolean): void {
    this._sideNav_GraphComp.next(value);
  }

  get displaySideNavComp(): Observable<boolean> {
    return this._sideNav_GraphComp.asObservable();
  }

  updatePhoneFlag(value: string): void {
    this._phoneModel.next(value);
  }

  get displayPhoneFlag(): Observable<string> {
    return this._phoneModel.asObservable();
  }

  public getModelMapValue(key: string): string {
    return this._model_map[key];
  }

  public getServerMapValue(key: string): string {
    return this._server_map[key];
  }

  public getRoundMapValue(key: string): string {
    return this._round_map[key];
  }

  public getGraph(key: string): string {
    return this._graph_map[key];
  }
  
  public toastInfo(detailMsg: string, summaryMsg: string): void {
    this.toast.info({ detail: detailMsg, summary: summaryMsg, duration: 5000 });
  }

  public toastWarning(detailMsg: string, summaryMsg: string): void {
    this.toast.warning({ detail: detailMsg, summary: summaryMsg, duration: 5000 });
  }
}
