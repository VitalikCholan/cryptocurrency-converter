import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConverterState } from '../../../models/ConverterState.interface';

@Injectable({
  providedIn: 'root',
})
export class ConverterStateService {
  private initialState: ConverterState = {
    selectedCrypto: '',
    selectedFiat: 'USD',
    quantity: 1,
    calculatedPrice: 0,
    isLoading: false,
    errorMessage: '',
  };

  private stateSubject = new BehaviorSubject<ConverterState>(this.initialState);
  state$ = this.stateSubject.asObservable();

  updateState(updates: Partial<ConverterState>) {
    const currentState = this.stateSubject.value;
    const newState = { ...currentState, ...updates };
    this.stateSubject.next(newState);
  }

  getState(): ConverterState {
    return this.stateSubject.value;
  }
}
