import { Component, OnInit } from '@angular/core';
import { CoinMarketCapService } from '../service/coin-market-cap.service';
import { DecimalPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged } from 'rxjs/operators';

type Quote = {
  [key: string]: {
    price: number;
  };
};

interface FiatCurrency {
  id: number;
  name: string;
  symbol: string;
}

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [DecimalPipe, FormsModule, CommonModule],
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css'],
})
export class ConverterComponent implements OnInit {
  cryptoData: { name: string; symbol: string; quote: Quote }[] = [];
  cryptoDataMap: Map<string, { name: string; symbol: string; quote: Quote }> =
    new Map();
  selectedCryptos: string[] = [];
  selectedSymbol: string = '';
  cryptoQuantity: number = 1;
  calculatedPrice: number = 0;
  searchCryptoTerm: string = '';
  searchCryptoSubject: Subject<string> = new Subject<string>();
  errorMessage: string = '';
  fiatCurrencies: FiatCurrency[] = [];
  filteredFiats: FiatCurrency[] = [];
  selectedFiat: string = 'USD';
  searchFiatTerm: string = '';
  searchFiatSubject: Subject<string> = new Subject<string>();
  errorFiatMessage: string = '';

  constructor(private coinMarketCapService: CoinMarketCapService) {}

  ngOnInit(): void {
    // Set up the search subject to handle debouncing and dynamic fetching
    this.searchCryptoSubject
      .pipe(
        debounceTime(300), // wait for 300ms pause in events
        distinctUntilChanged() // only emit if value is different from before
      )
      .subscribe((searchCryptoTerm: string) => {
        if (searchCryptoTerm) {
          this.fetchCryptoData(searchCryptoTerm);
        }
      });

    this.searchFiatSubject
      .pipe(
        debounceTime(300), // wait for 300ms pause in events
        distinctUntilChanged() // only emit if value is different from before
      )
      .subscribe((searchFiatTerm: string) => {
        if (searchFiatTerm) {
          this.fetchFiatCurrencies();
        }
      });

    this.fetchCryptoData();

    this.fetchFiatCurrencies();
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

    if (this.selectedSymbol && this.selectedFiat) {
      // Find the selected cryptocurrency
      const selectedCrypto = this.cryptoData.find(
        (crypto) => crypto.symbol === this.selectedSymbol
      );

      if (selectedCrypto && selectedCrypto.quote[this.selectedFiat]) {
        // Get the price per unit in the selected fiat currency
        const pricePerUnit = selectedCrypto.quote[this.selectedFiat].price || 0;

        if (pricePerUnit > 0) {
          // Calculate the crypto quantity based on the price input
          this.cryptoQuantity = newPrice / pricePerUnit;
        } else {
          this.cryptoQuantity = 0; // If no valid price, set quantity to 0
        }

        // Update calculatedPrice to reflect the current crypto quantity
        this.calculatedPrice = this.cryptoQuantity * pricePerUnit;
      }
    }
  }

  updatePrice(): void {
    const selectedCrypto = this.cryptoData.find(
      (crypto) => crypto.symbol === this.selectedSymbol
    );

    if (
      selectedCrypto &&
      selectedCrypto.quote &&
      selectedCrypto.quote[this.selectedFiat]
    ) {
      // Only access the price if selectedCrypto, quote, and the selectedFiat exist
      const price = selectedCrypto.quote[this.selectedFiat].price || 0;
      this.calculatedPrice = price * this.cryptoQuantity;
    } else {
      // Handle cases where selectedCrypto or quote for the selected fiat does not exist
      this.calculatedPrice = 0;
    }
  }

  filteredCryptos() {
    if (!this.searchCryptoTerm) {
      return Array.from(this.cryptoDataMap.values()).slice(0, 4); // Return first 4 by default
    }

    const searchCryptoTermLower = this.searchCryptoTerm.toLowerCase();
    // Filter the Map by name or symbol
    const filtered = Array.from(this.cryptoDataMap.values()).filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchCryptoTermLower) ||
        crypto.symbol.toLowerCase().includes(searchCryptoTermLower)
    );

    if (filtered.length === 0) {
      this.errorMessage = 'No crypto found';
    }

    return filtered.slice(0, 4);
  }

  onFiatChange(event: Event): void {
    const element = event.target as HTMLSelectElement;
    this.selectedFiat = element.value;
    this.fetchCryptoData(this.searchCryptoTerm);
    this.updatePrice();
  }

  fetchCryptoData(searchCryptoTerm: string = ''): void {
    const params = {
      start: 1,
      limit: '10',
      convert: this.selectedFiat,
      sort: 'market_cap',
    };

    this.coinMarketCapService
      .getCryptoData(params)
      .subscribe((response: any) => {
        this.cryptoData = response.data || [];

        if (searchCryptoTerm) {
          this.cryptoData = this.cryptoData.filter(
            (crypto) =>
              crypto.name
                .toLowerCase()
                .includes(searchCryptoTerm.toLowerCase()) ||
              crypto.symbol
                .toLowerCase()
                .includes(searchCryptoTerm.toLowerCase())
          );
        }

        // Create a Map for faster lookup
        this.cryptoDataMap.clear(); // Clear the previous data
        this.cryptoData.forEach((crypto) => {
          this.cryptoDataMap.set(crypto.symbol, crypto);
        });

        this.errorMessage = '';

        this.updatePrice();
      });
  }

  fetchFiatCurrencies(): void {
    const params = {
      start: 1,
      limit: '10',
      sort: 'id',
      include_metals: true,
    };
    this.coinMarketCapService
      .getFiatData(params)
      .pipe(
        catchError((error) => {
          console.error(error);
          return of({ data: [] });
        })
      )
      .subscribe((response) => {
        this.fiatCurrencies = response.data || [];
        this.filteredFiats = this.fiatCurrencies.slice(0, 4);
      });
  }

  filterFiatCurrencies(): void {
    const searchFiatLower = this.searchFiatTerm.toLowerCase();
    this.filteredFiats = this.fiatCurrencies.filter(
      (fiat) =>
        fiat.name.toLowerCase().includes(searchFiatLower) ||
        fiat.symbol.toLowerCase().includes(searchFiatLower)
    );

    if (this.filteredFiats.length === 0) {
      this.errorFiatMessage = 'No fiat currencies found.';
    } else {
      this.errorFiatMessage = '';
    }
  }

  // Handle search input changes for fiat currencies
  onSearchFiatChange(): void {
    this.filterFiatCurrencies(); // Emit value to Subject
  }

  onSearchTermChange(): void {
    this.searchCryptoSubject.next(this.searchCryptoTerm);
  }
}
