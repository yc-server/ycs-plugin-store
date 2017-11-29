import Controller from './controller';
import Model from './model';
import { Router } from '@ycs/core/lib/routers';
import { IConfig } from '../config';

export function routes(config: IConfig) {
  const controller = new Controller(config);
  return Model.routes(
    `${config.endpoint}/order/wrap/logs`,
    {
      path: '/',
      methods: ['get'],
      auth: {
        type: 'hasRoles',
        roles: config.roles,
      },
      controller: controller.index,
      tags: ['__store_order_wrap_log'],
      summary: 'List documents',
      description: 'List documents',
      consumes: ['application/json', 'application/xml'],
      produces: ['application/json', 'application/xml'],
      parameters: [Model.docSchema.paginateOptions, Model.docSchema.filters],
      responses: {
        200: {
          description: 'Successful operation',
          schema: Model.docSchema.paginateResult,
        },
        '4xx': Model.docSchema.response4xx,
        '5xx': Model.docSchema.response5xx,
      },
    },
    {
      path: '/',
      methods: ['post'],
      auth: {
        type: 'hasRoles',
        roles: config.roles,
      },
      controller: controller.create,
      tags: ['__store_order_wrap_log'],
      summary: 'Create a document',
      description: 'Create a document',
      consumes: ['application/json', 'application/xml'],
      produces: ['application/json', 'application/xml'],
      parameters: [Model.docSchema.body],
      responses: {
        201: {
          description: 'Successful operation',
          schema: Model.docSchema.result,
        },
        '4xx': Model.docSchema.response4xx,
        '5xx': Model.docSchema.response5xx,
      },
    },
    {
      path: '/wrap/:id',
      methods: ['get'],
      auth: {
        type: 'isAuthenticated',
        roles: config.roles,
      },
      controller: controller.wrap,
      tags: ['__store_order_wrap_log'],
      summary: 'List logs by wrap',
      description: 'List logs by wrap',
      consumes: ['application/json', 'application/xml'],
      produces: ['application/json', 'application/xml'],
      parameters: [
        Model.docSchema.paginateOptions,
        Model.docSchema.filters,
        Model.docSchema.paramId,
      ],
      responses: {
        200: {
          description: 'Successful operation',
          schema: Model.docSchema.paginateResult,
        },
        '4xx': Model.docSchema.response4xx,
        '5xx': Model.docSchema.response5xx,
      },
    },
    {
      path: '/:id',
      methods: ['get'],
      auth: {
        type: 'hasRoles',
        roles: config.roles,
      },
      controller: controller.show,
      tags: ['__store_order_wrap_log'],
      summary: 'Retrieve a document',
      description: 'Retrieve a document',
      consumes: ['application/json', 'application/xml'],
      produces: ['application/json', 'application/xml'],
      parameters: [Model.docSchema.showOptions, Model.docSchema.paramId],
      responses: {
        200: {
          description: 'Successful operation',
          schema: Model.docSchema.result,
        },
        '4xx': Model.docSchema.response4xx,
        '5xx': Model.docSchema.response5xx,
      },
    },
    {
      path: '/:id',
      methods: ['put', 'patch'],
      auth: {
        type: 'hasRoles',
        roles: config.roles,
      },
      controller: controller.update,
      tags: ['__store_order_wrap_log'],
      summary: 'Modify a document',
      description: 'Modify a document',
      consumes: ['application/json', 'application/xml'],
      produces: ['application/json', 'application/xml'],
      parameters: [Model.docSchema.paramId, Model.docSchema.body],
      responses: {
        200: {
          description: 'Successful operation',
          schema: Model.docSchema.result,
        },
        '4xx': Model.docSchema.response4xx,
        '5xx': Model.docSchema.response5xx,
      },
    },
    {
      path: '/:id',
      methods: ['delete'],
      auth: {
        type: 'hasRoles',
        roles: config.roles,
      },
      controller: controller.destroy,
      tags: ['__store_order_wrap_log'],
      summary: 'Delete a document',
      description: 'Delete a document',
      produces: ['text/plain'],
      parameters: [Model.docSchema.paramId],
      responses: {
        204: {
          description: 'Successful operation',
        },
        '4xx': Model.docSchema.response4xx,
        '5xx': Model.docSchema.response5xx,
      },
    }
  );
}
