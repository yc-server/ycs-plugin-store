import Controller from './controller';
import Model from './model';
import { Router } from '@ycs/core/lib/routers';
import { IConfig } from '../config';

export function routes(config: IConfig) {
  const controller = new Controller(config);
  return Model.routes(
    `${config.endpoint}/orders`,
    {
      path: '/',
      methods: ['get'],
      auth: {
        type: 'isAuthenticated',
      },
      controller: controller.index,
      tags: ['__store_order'],
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
        type: 'isAuthenticated',
      },
      controller: controller.create,
      tags: ['__store_order'],
      summary: 'Create a document',
      description: 'Create a document',
      consumes: ['application/json', 'application/xml'],
      produces: ['application/json', 'application/xml'],
      parameters: [
        {
          in: 'body',
          name: 'body',
          required: true,
          schema: {
            type: 'object',
            properties: {
              product: {
                type: 'string',
                required: true,
              },
            },
            xml: { name: 'xml' },
          },
        },
      ],
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
      path: '/:id',
      methods: ['post'],
      auth: {
        type: 'ownsOrHasRoles',
        roles: config.roles,
      },
      controller: controller.action,
      tags: ['__store_order'],
      summary: 'Customer operation',
      description: 'Customer operation',
      consumes: ['application/json', 'application/xml'],
      produces: ['application/json', 'application/xml'],
      parameters: [
        {
          in: 'body',
          name: 'body',
          required: true,
          schema: {
            type: 'object',
            properties: {
              action: {
                type: 'string',
                required: true,
              },
              msg: {
                type: 'string',
              },
              extra: {
                type: 'string',
              },
            },
            xml: { name: 'xml' },
          },
        },
      ],
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
      methods: ['get'],
      controller: controller.show,
      tags: ['__store_order'],
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
      tags: ['__store_order'],
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
      tags: ['__store_order'],
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
