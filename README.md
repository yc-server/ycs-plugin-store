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
  errors: {
    empty: 'empty content',
    categoryRequired: 'category required',
    categoryNotFound: 'category not found'
  }
};

export const production: IConfig = {
  endpoint: '/store',
  roles: ['store'],
  errors: {
    empty: 'empty content',
    categoryRequired: 'category required',
    categoryNotFound: 'category not found'
  }
};

```