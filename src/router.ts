import { Ycs } from '@ycs/core';
import { Router } from '@ycs/core/lib/routers';
import { IConfig } from './config';
import { routes as categoryRoutes } from './category/router';
import { routes as fieldRoutes } from './field/router';
import { routes as filterRoutes } from './filter/router';

export async function setupRouter(app: Ycs): Promise<Router[]> {
  const config: IConfig = app.config.bookmark;
  const routers: Router[] = [];
  routers.push(
    categoryRoutes(config),
    fieldRoutes(config),
    filterRoutes(config)
  );

  return routers;
}
