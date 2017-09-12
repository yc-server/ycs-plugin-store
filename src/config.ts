// import { IErrors } from './errors';

export interface IConfig {
  endpoint: string;
  roles: string[];
  errors: {
    empty: string;
    categoryRequired: string;
    categoryNotFound: string;
  };
}
