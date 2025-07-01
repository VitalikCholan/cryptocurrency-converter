import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PriceCalculatorService {
  calculatePrice(crypto: any, fiat: string, quantity: number): number {
    if (crypto?.quote?.[fiat]?.price) {
      return crypto.quote[fiat].price * quantity;
    }
    return 0;
  }

  calculateQuantity(price: number, crypto: any, fiat: string): number {
    if (crypto?.quote?.[fiat]?.price > 0) {
      return price / crypto.quote[fiat].price;
    }
    return 0;
  }

  formatPrice(price: number): string {
    if (price > 1) {
      return price.toFixed(2);
    }
    return price.toFixed(6);
  }
}
