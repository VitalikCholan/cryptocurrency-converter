import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  private baseUrl: string = 'https://pro-api.coinmarketcap.com';
  private apiCryptoUrl: string;
  private apiFiatUrl: string;
  private apiKey: string = environment.apiKey;

  constructor(private http: HttpClient) {
    // Check if running as extension
    const isExtension =
      (window as any).chrome &&
      (window as any).chrome.runtime &&
      (window as any).chrome.runtime.id;
    if (isExtension) {
      this.apiCryptoUrl = `${this.baseUrl}/v1/cryptocurrency/listings/latest`;
      this.apiFiatUrl = `${this.baseUrl}/v1/fiat/map`;
    } else {
      // Development mode with proxy
      this.apiCryptoUrl = '/v1/cryptocurrency/listings/latest';
      this.apiFiatUrl = '/v1/fiat/map';
    }
  }

  getCryptoData(
    cryptoParams: CryptoData
  ): Observable<{ data: CryptoResponseData[] }> {
    const headers = new HttpHeaders({
      'X-CMC_PRO_API_KEY': this.apiKey,
      Accept: 'application/json',
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
          return of({ data: [] });
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
