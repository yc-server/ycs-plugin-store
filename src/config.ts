import { EAction as EOrderAction } from './order/utils';
import { EAction as EOrderWrapAction } from './order_wrap/utils';

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
  orderEvents?: IOrderEvent[];
  orderWrapEvents?: IOrderWrapEvent[];
}

export interface IOrderEvent {
  on: EOrderAction;
  handler: (entity: any) => any;
}

export interface IOrderWrapEvent {
  on: EOrderWrapAction;
  handler: (entity: any) => any;
}
