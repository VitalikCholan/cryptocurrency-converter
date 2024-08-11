import { Component } from '@angular/core';
import { CoinMarketCapService } from '../service/coin-market-cap.service';

@Component({
  selector: 'app-converter',
  standalone: true,
  imports: [],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.css',
})
export class ConverterComponent {
  cryptoData: any = [];

  constructor(private coinMarketCapService: CoinMarketCapService) {}

  ngOnInit(): void {
    this.coinMarketCapService.getCryptoData().subscribe(
      (data) => {
        this.cryptoData = data;
        console.log(this.cryptoData);
      },
      (error) => {
        console.error('There was an error fetching the data!', error);
      }
    );
  }
}
