import { Component, OnInit, OnDestroy } from '@angular/core';
import { CoinMarketCapService } from '../service/coin-market-cap/coin-market-cap.service';
import { SearchService } from '../service/search/search.service';
import { PriceCalculatorService } from '../service/price-calculator/price-calculator.service';
import { ConverterStateService } from '../service/converter-state/converter-state.service';
import { DecimalPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable, Subject, takeUntil } from 'rxjs';
import { FiatCurrency } from '../../models/FiatCurrency.interface';
import { Quote } from '../../models/Quote.type';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [DecimalPipe, FormsModule, CommonModule],
  templateUrl: './converter.component.html',
  styleUrls: ['./converter.component.css'],
})
export class ConverterComponent implements OnInit, OnDestroy {
  // Data properties
  cryptoData: { name: string; symbol: string; quote: Quote }[] = [];
  cryptoDataMap: Map<string, { name: string; symbol: string; quote: Quote }> =
    new Map();
  fiatCurrencies: FiatCurrency[] = [];
  filteredFiats: FiatCurrency[] = [];

  // UI state properties
  searchCryptoTerm: string = '';
  searchFiatTerm: string = '';
  errorFiatMessage: string = '';

  // State management
  state$!: Observable<any>; // Add this property declaration

  private destroy$ = new Subject<void>();

  constructor(
    private coinMarketCapService: CoinMarketCapService,
    private searchService: SearchService,
    private priceCalculator: PriceCalculatorService,
    private stateService: ConverterStateService
  ) {
    // Initialize state$ in constructor
    this.state$ = this.stateService.state$;
  }

  ngOnInit(): void {
    this.setupSearchSubscriptions();
    this.loadInitialData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // UI Event Handlers (Single Responsibility: Handle UI events)
  onCryptoChange(event: Event): void {
    const symbol = (event.target as HTMLSelectElement).value;
    this.stateService.updateState({ selectedCrypto: symbol });
    this.updatePrice();
  }

  onQuantityChange(event: Event): void {
    const quantity = +(event.target as HTMLInputElement).value;
    this.stateService.updateState({ quantity });
    this.updatePrice();
  }

  onPriceChange(event: Event): void {
    const price = +(event.target as HTMLInputElement).value;
    this.calculateQuantityFromPrice(price);
  }

  onSearchTermChange(): void {
    this.searchService.updateCryptoSearch(this.searchCryptoTerm);
  }

  onSearchFiatChange(): void {
    this.searchService.updateFiatSearch(this.searchFiatTerm);
  }

  onFiatChange(event: Event): void {
    const fiat = (event.target as HTMLSelectElement).value;
    this.stateService.updateState({ selectedFiat: fiat });
    this.refreshCryptoData();
  }

  switchConversionValues(): void {
    const state = this.stateService.getState();
    this.stateService.updateState({
      selectedCrypto: state.selectedFiat,
      selectedFiat: state.selectedCrypto,
      quantity: state.calculatedPrice,
      calculatedPrice: state.quantity,
    });
  }

  // Private Methods (Single Responsibility: Coordinate between services)
  private setupSearchSubscriptions(): void {
    this.searchService.cryptoSearch$
      .pipe(takeUntil(this.destroy$))
      .subscribe((term) => {
        if (term) {
          this.fetchCryptoData(term);
        }
      });

    this.searchService.fiatSearch$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.filterFiatCurrencies();
      });
  }

  private loadInitialData(): void {
    this.fetchCryptoData();
    this.fetchFiatCurrencies();
  }

  private updatePrice(): void {
    const state = this.stateService.getState();
    const selectedCrypto = this.cryptoData.find(
      (crypto) => crypto.symbol === state.selectedCrypto
    );

    const calculatedPrice = this.priceCalculator.calculatePrice(
      selectedCrypto,
      state.selectedFiat,
      state.quantity
    );

    this.stateService.updateState({ calculatedPrice });
  }

  private calculateQuantityFromPrice(price: number): void {
    const state = this.stateService.getState();
    const selectedCrypto = this.cryptoData.find(
      (crypto) => crypto.symbol === state.selectedCrypto
    );

    const quantity = this.priceCalculator.calculateQuantity(
      price,
      selectedCrypto,
      state.selectedFiat
    );

    this.stateService.updateState({ quantity, calculatedPrice: price });
  }

  private fetchCryptoData(searchTerm: string = ''): void {
    this.stateService.updateState({ isLoading: true, errorMessage: '' });

    const state = this.stateService.getState();
    const params = {
      start: 1,
      limit: '100',
      convert: state.selectedFiat,
      sort: 'market_cap',
    };

    this.coinMarketCapService.getCryptoData(params).subscribe({
      next: (response) => {
        this.cryptoData = response.data || [];
        this.filterCryptoData(searchTerm);
        this.updateCryptoDataMap();
        this.updatePrice();
        this.stateService.updateState({ isLoading: false });
      },
      error: (error) => {
        console.error('Error fetching crypto data:', error);
        this.stateService.updateState({
          isLoading: false,
          errorMessage: 'Failed to load cryptocurrency data',
        });
      },
    });
  }

  private filterCryptoData(searchTerm: string): void {
    if (searchTerm) {
      this.cryptoData = this.cryptoData.filter(
        (crypto) =>
          crypto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          crypto.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
  }

  private updateCryptoDataMap(): void {
    this.cryptoDataMap.clear();
    this.cryptoData.forEach((crypto) => {
      this.cryptoDataMap.set(crypto.symbol, crypto);
    });
  }

  private fetchFiatCurrencies(): void {
    const params = {
      start: 1,
      limit: '10',
      sort: 'id',
      include_metals: true,
    };

    this.coinMarketCapService.getFiatData(params).subscribe({
      next: (response) => {
        this.fiatCurrencies = response.data || [];
        this.filteredFiats = this.fiatCurrencies.slice(0, 4);
      },
      error: (error) => {
        console.error('Error fetching fiat data:', error);
        this.errorFiatMessage = 'Failed to load fiat currencies';
      },
    });
  }

  private filterFiatCurrencies(): void {
    const searchLower = this.searchFiatTerm.toLowerCase();
    this.filteredFiats = this.fiatCurrencies.filter(
      (fiat) =>
        fiat.name.toLowerCase().includes(searchLower) ||
        fiat.symbol.toLowerCase().includes(searchLower)
    );

    this.errorFiatMessage =
      this.filteredFiats.length === 0 ? 'No fiat currencies found' : '';
  }

  private refreshCryptoData(): void {
    this.fetchCryptoData(this.searchCryptoTerm);
  }

  // Public methods for template
  filteredCryptos() {
    if (!this.searchCryptoTerm) {
      return Array.from(this.cryptoDataMap.values()).slice(0, 4);
    }

    const searchLower = this.searchCryptoTerm.toLowerCase();
    const filtered = Array.from(this.cryptoDataMap.values()).filter(
      (crypto) =>
        crypto.name.toLowerCase().includes(searchLower) ||
        crypto.symbol.toLowerCase().includes(searchLower)
    );

    return filtered.slice(0, 4);
  }
}
