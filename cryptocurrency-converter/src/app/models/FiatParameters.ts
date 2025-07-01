export interface FiatParameters {
  [key: string]: string | number | boolean;
  include_metals: boolean;
  limit: string;
  sort: string;
  start: number;
}
