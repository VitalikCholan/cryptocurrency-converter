import { Component, OnInit } from '@angular/core';
import { CoinMarketCapService } from '../service/coin-market-cap.service';
import { DecimalPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';

type Quote = {
  [key: string]: {
    price: number;
    volume_24h: number;
    percent_change_1h: number;
    percent_change_24h: number;
    percent_change_7d: number;
    market_cap: number;
  };
};

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [DecimalPipe, FormsModule, CommonModule],
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css'],
})
export class ConverterComponent implements OnInit {
  cryptoData: { name: string; symbol: string; quote: Quote }[] = [];
  selectedCryptos: string[] = [];
  selectedSymbol: string = '';
  cryptoQuantity: number = 1;
  calculatedPrice: number = 0;
  searchTerm: string = '';
  searchSubject: Subject<string> = new Subject<string>();
  errorMessage: string = '';

  constructor(private coinMarketCapService: CoinMarketCapService) {}

  ngOnInit(): void {
    // Set up the search subject to handle debouncing and dynamic fetching
    this.searchSubject
      .pipe(
        debounceTime(300), // wait for 300ms pause in events
        distinctUntilChanged() // only emit if value is different from before
      )
      .subscribe((searchTerm: string) => {
        if (searchTerm) {
          this.fetchCryptoData(searchTerm);
        }
      });

    this.fetchCryptoData();
  }

  onCryptoChange(event: Event): void {
    const element = event.target as HTMLSelectElement;
    this.selectedSymbol = element.value;
    this.updatePrice(); // This method will now be responsible for updating the price.
  }

  onQuantityChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.cryptoQuantity = +inputElement.value; // Convert value to number
    this.updatePrice();
  }

  onPriceChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const newPrice = +inputElement.value;
    if (this.selectedSymbol) {
      const selectedCrypto = this.cryptoData.find(
        (crypto) => crypto.symbol === this.selectedSymbol
      );
      if (selectedCrypto) {
        const pricePerUnit = selectedCrypto.quote['USD'].price || 0;
        this.cryptoQuantity = newPrice / pricePerUnit;
      }
    }
  }

  updatePrice(): void {
    const selectedCrypto = this.cryptoData.find(
      (crypto) => crypto.symbol === this.selectedSymbol
    );

    if (selectedCrypto) {
      const price = selectedCrypto.quote['USD'].price || 0;
      this.calculatedPrice = price * this.cryptoQuantity;
    }
  }

  filteredCryptos() {
    if (!this.searchTerm) {
      return this.cryptoData;
    }
    return this.cryptoData.filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        crypto.symbol.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  fetchCryptoData(searchTerm: string = ''): void {
    const params = {
      limit: '50', // Limit to 50 results for the sake of performance
      convert: 'USD', // Converting market data to USD
      sort: 'market_cap', // Sort by market cap
    };

    this.coinMarketCapService
      .getCryptoData(params)
      .pipe(
        catchError((error) => {
          if (error.status === 400) {
            this.errorMessage = 'No results found';
            console.warn('Invalid name, suppressing 400 error');
          } else {
            console.error('Error fetching data:', error);
          }
          return of([]);
        })
      )
      .subscribe((response: any) => {
        let data = response.data || [];
        if (searchTerm) {
          data = data.filter(
            (crypto: any) =>
              crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        this.cryptoData = data;
        this.errorMessage = '';
      });
  }

  onSearchTermChange(): void {
    this.searchSubject.next(this.searchTerm);
  }
}
