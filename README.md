# Installation

```bash
ycs add plugin store
```

# configurations

```ts
import { IConfig } from 'ycs-plugin-store';

export const development: IConfig = {
  endpoint: '/store',
  roles: ['store'],
  orderPrice: product => product.productPrice,
  orderPaidPy: ['wechatpay', 'alipay'],
  errors: {
    empty: 'empty content',
    categoryRequired: 'category required',
    categoryNotFound: 'category not found',
    productNotFound: 'product not found'
  }
};

export const production: IConfig = {
  endpoint: '/store',
  roles: ['store'],
  orderPrice: product => product.productPrice,
  orderPaidPy: ['wechatpay', 'alipay'],
  errors: {
    empty: 'empty content',
    categoryRequired: 'category required',
    categoryNotFound: 'category not found',
    productNotFound: 'product not found'
  }
};

```