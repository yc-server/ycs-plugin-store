// import { IErrors } from './errors';

export interface IConfig {
  endpoint: string;
  roles: string[];
  orderPrice: (product: any) => number;
  orderPaidPy: string[];
  errors: {
    empty: string;
    categoryRequired: string;
    categoryNotFound: string;
    productNotFound: string;
  };
}
