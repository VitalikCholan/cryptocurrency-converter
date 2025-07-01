export interface ConverterState {
  selectedCrypto: string;
  selectedFiat: string;
  quantity: number;
  calculatedPrice: number;
  isLoading: boolean;
  errorMessage: string;
}
