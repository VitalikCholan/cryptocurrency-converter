import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private cryptoSearchSubject = new Subject<string>();
  private fiatSearchSubject = new Subject<string>();

  cryptoSearch$ = this.cryptoSearchSubject.pipe(
    debounceTime(300),
    distinctUntilChanged()
  );

  fiatSearch$ = this.fiatSearchSubject.pipe(
    debounceTime(300),
    distinctUntilChanged()
  );

  updateCryptoSearch(term: string) {
    this.cryptoSearchSubject.next(term);
  }

  updateFiatSearch(term: string) {
    this.fiatSearchSubject.next(term);
  }
}
