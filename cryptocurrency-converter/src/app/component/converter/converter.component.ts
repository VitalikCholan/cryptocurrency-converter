import { Component, OnInit } from '@angular/core';
import { CoinMarketCapService } from '../service/coin-market-cap.service';

type Quote = {
  USD: {
    price: number;
  };
};
@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.css',
})
export class ConverterComponent implements OnInit {
  cryptoData: { name: string; symbol: string; quote: Quote }[] = [];
  selectedCryptos: string[] = ['bitcoin', 'ethereum', 'litecoin'];

  constructor(private coinMarketCapService: CoinMarketCapService) {}

  ngOnInit(): void {
    this.coinMarketCapService.getCryptoData(this.selectedCryptos).subscribe(
      (response: any) => {
        this.cryptoData = Object.values(response.data);
        console.log(this.cryptoData);
      },
      (error) => {
        console.error('There was an error fetching the data!', error);
      }
    );
  }

  selectedPrice: number = 0;

  onCryptoChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedSymbol = selectElement.value;

    const selectedCrypto = this.cryptoData.find(
      (crypto) => crypto.symbol === selectedSymbol
    );

    if (selectedCrypto) {
      this.selectedPrice = selectedCrypto.quote?.USD?.price || 0;
    }
  }
}
