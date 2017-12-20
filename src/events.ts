import { Ycs } from '@ycs/core';
import { event as orderEvent } from './order/utils';
import { event as orderWrapEvent } from './order_wrap/utils';
import { IConfig } from './config';

export function setupEvents(app: Ycs) {
  const config: IConfig = app.config.store;
  if (config.orderEvents) {
    for (const e of config.orderEvents) {
      orderEvent.on(e.on, e.handler);
    }
  }
  if (config.orderWrapEvents) {
    for (const e of config.orderWrapEvents) {
      orderWrapEvent.on(e.on, e.handler);
    }
  }
}
