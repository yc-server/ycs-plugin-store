import { Ycs } from '@ycs/core';
import { Router } from '@ycs/core/lib/routers';
import { IConfig } from './config';
import { routes as categoryRoutes } from './category/router';
import { routes as fieldRoutes } from './field/router';
import { routes as filterRoutes } from './filter/router';
import { routes as productRouters } from './product/router';
import { routes as orderRouters } from './order/router';
import { routes as orderLogRouters } from './order_log/router';

export async function setupRouter(app: Ycs): Promise<Router[]> {
  const config: IConfig = app.config.store;
  const routers: Router[] = [];
  routers.push(
    categoryRoutes(config),
    fieldRoutes(config),
    filterRoutes(config),
    productRouters(config),
    orderRouters(config),
    orderLogRouters(config)
  );

  return routers;
}
