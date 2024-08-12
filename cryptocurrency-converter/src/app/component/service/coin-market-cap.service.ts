import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoinMarketCapService {
  private apiUrl: string = 'v2/cryptocurrency/quotes/latest?slug=bitcoin';
  private apiKey: string = 'dbaeffee-252c-4d88-b04e-e70106198aa8';

  constructor(private http: HttpClient) {}

  getCryptoData(): Observable<unknown> {
    const headers = new HttpHeaders({
      'X-CMC_PRO_API_KEY': this.apiKey,
    });

    return this.http.get(this.apiUrl, { headers });
  }
}
