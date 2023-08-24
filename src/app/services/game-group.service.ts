import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameGroupService {
  
  defaultGameGroupId: string = 'KG0dTTTS4HLIR8q9QWsG';

  private _selectedGameGroup: BehaviorSubject<string> = new BehaviorSubject(this.defaultGameGroupId);
  public readonly selectedGameGroup$: Observable<string> = this._selectedGameGroup.asObservable();

  constructor() { }

  setGameGroup(gameGroup: string): any {
    this._selectedGameGroup.next(gameGroup);
  }
}