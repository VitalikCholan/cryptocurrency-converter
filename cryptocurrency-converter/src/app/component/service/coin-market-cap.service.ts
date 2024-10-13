import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

interface CryptoData {
  [key: string]: string | number;
  convert: string;
  limit: string;
  sort: string;
  start: number;
}

interface CryptoResponseData {
  name: string;
  symbol: string;
  quote: Quote;
}

interface Quote {
  [key: string]: {
    price: number;
  };
}

interface FiatData {
  id: number;
  name: string;
  symbol: string;
}

interface FiatParameters {
  [key: string]: string | number | boolean;
  include_metals: boolean;
  limit: string;
  sort: string;
  start: number;
}
@Injectable({
  providedIn: 'root',
})
export class CoinMarketCapService {
  private apiCryptoUrl: string = '/v1/cryptocurrency/listings/latest';
  private apiFiatUrl: string = '/v1/fiat/map';
  private apiKey: string = 'dbaeffee-252c-4d88-b04e-e70106198aa8';

  constructor(private http: HttpClient) {}

  getCryptoData(
    cryptoParams: CryptoData
  ): Observable<{ data: CryptoResponseData[] }> {
    const headers = new HttpHeaders({
      'X-CMC_PRO_API_KEY': this.apiKey,
    });

    let httpParams = new HttpParams();
    Object.keys(cryptoParams).forEach((key) => {
      httpParams = httpParams.set(key, cryptoParams[key]);
    });

    return this.http
      .get<{ data: CryptoResponseData[] }>(this.apiCryptoUrl, {
        headers,
        params: httpParams,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching cryptocurrency data:', error);
          return of({ data: [] }); // Return an empty array on error
        })
      );
  }

  getFiatData(fiatParams: FiatParameters): Observable<{ data: FiatData[] }> {
    const headers = new HttpHeaders({
      'X-CMC_PRO_API_KEY': this.apiKey,
    });

    let httpParams = new HttpParams();

    if (fiatParams) {
      Object.keys(fiatParams).forEach((key) => {
        httpParams = httpParams.set(key, String(fiatParams[key]));
      });
    }

    return this.http
      .get<{ data: FiatData[] }>(this.apiFiatUrl, {
        headers,
        params: httpParams,
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching fiat currencies:', error);
          // Return an empty array wrapped in an object to ensure correct typing
          return of({ data: [] });
        })
      );
  }
}
