import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CoinMarketCapService {
  private apiUrl: string = '/v1/cryptocurrency/listings/latest';
  private apiKey: string = 'dbaeffee-252c-4d88-b04e-e70106198aa8';

  constructor(private http: HttpClient) {}

  getCryptoData(params?: any): Observable<any> {
    const headers = new HttpHeaders({
      'X-CMC_PRO_API_KEY': this.apiKey,
    });

    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        httpParams = httpParams.set(key, params[key]);
      });
    }

    return this.http.get<any>(this.apiUrl, { headers, params: httpParams });
  }
}
