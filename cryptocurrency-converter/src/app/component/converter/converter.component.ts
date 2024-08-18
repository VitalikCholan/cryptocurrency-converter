import { Component, OnInit } from '@angular/core';
import { CoinMarketCapService } from '../service/coin-market-cap.service';
import { DecimalPipe } from '@angular/common';

type Quote = {
  USD: {
    price: number;
  };
};
@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [DecimalPipe],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.css',
})
export class ConverterComponent implements OnInit {
  cryptoData: { name: string; symbol: string; quote: Quote }[] = [];
  selectedCryptos: string[] = ['bitcoin', 'ethereum', 'litecoin'];
  selectedSymbol: string = '';
  cryptoQuantity: number = 1;
  calculatedPrice: number = 0;

  constructor(private coinMarketCapService: CoinMarketCapService) {}

  ngOnInit(): void {
    this.coinMarketCapService.getCryptoData(this.selectedCryptos).subscribe(
      (response: any) => {
        this.cryptoData = Object.values(response.data);
        console.log(this.cryptoData);
        if (this.cryptoData.length > 0) {
          this.selectedSymbol = this.cryptoData[0].symbol;
          this.updatePrice(); // Calculate initial price
        }
      },
      (error) => {
        console.error('There was an error fetching the data!', error);
      }
    );
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
}
