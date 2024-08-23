import { Component, OnInit } from '@angular/core';
import { CoinMarketCapService } from '../service/coin-market-cap.service';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

type Quote = {
  USD: {
    price: number;
  };
};
@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [DecimalPipe, FormsModule, CommonModule],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.css',
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
          this.fetchCryptoData([searchTerm.toLowerCase()]);
        } else {
          this.fetchCryptoData(['bitcoin']); // Default to Bitcoin if empty
        }
      });
  }

  onCryptoChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedSymbol = selectElement.value;
    this.updatePrice();
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
        const pricePerUnit = selectedCrypto.quote.USD.price || 0;
        this.cryptoQuantity = newPrice / pricePerUnit;
      }
    }
  }

  updatePrice(): void {
    const selectedCrypto = this.cryptoData.find(
      (crypto) => crypto.symbol === this.selectedSymbol
    );

    if (selectedCrypto) {
      const price = selectedCrypto.quote.USD.price || 0;
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

  fetchCryptoData(slugs: string[]): void {
    this.coinMarketCapService
      .getCryptoData(slugs)
      .pipe(
        catchError((error) => {
          if (error.status === 400) {
            this.errorMessage = 'No results found';
            console.warn('Invalid slug, suppressing 400 error');
          } else {
            console.error('Error fetching data:', error);
          }
          return of([]); // Return an empty array to avoid breaking the app
        })
      )
      .subscribe((response: any) => {
        this.cryptoData = Object.values(response.data);
        if (this.cryptoData.length > 0) {
          this.selectedSymbol = this.cryptoData[0].symbol;
          this.errorMessage = '';
          this.updatePrice();
        }
      });
  }

  onSearchTermChange(): void {
    this.searchSubject.next(this.searchTerm);
  }
}
