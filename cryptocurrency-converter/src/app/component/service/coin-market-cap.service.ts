import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoinMarketCapService {
  private apiCryptoUrl: string = '/v1/cryptocurrency/listings/latest';
  private apiFiatUrl: string = '/v1/fiat/map';
  private apiKey: string = 'dbaeffee-252c-4d88-b04e-e70106198aa8';

  constructor(private http: HttpClient) {}

  getCryptoData(cryptoParams?: any): Observable<any> {
    const headers = new HttpHeaders({
      'X-CMC_PRO_API_KEY': this.apiKey,
    });

    let httpParams = new HttpParams();

    if (cryptoParams) {
      Object.keys(cryptoParams).forEach((key) => {
        httpParams = httpParams.set(key, cryptoParams[key]);
      });
    }

    return this.http.get<any>(this.apiCryptoUrl, {
      headers,
      params: httpParams,
    });
  }

  getFiatData(fiatParams?: any): Observable<any> {
    const headers = new HttpHeaders({
      'X-CMC_PRO_API_KEY': this.apiKey,
    });

    let httpParams = new HttpParams();

    if (fiatParams) {
      Object.keys(fiatParams).forEach((key) => {
        httpParams = httpParams.set(key, fiatParams[key]);
      });
    }

    return this.http.get<any>(this.apiFiatUrl, {
      headers,
      params: httpParams,
    });
  }
}
