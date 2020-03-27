const fs = require('fs');
const path = require('path');

const aspects = (() => {
  const directory = path.join(__dirname, '../../aspects');

  const entries = fs.readdirSync(directory, {withFileTypes: true});

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
})();

/**
 * Subset of JSON Schema.
 *
 * @see https://json-schema.org/
 */

const DEFINITIONS = {
  Variables: {
    type: 'object',
    patternProperties: {
      '.*': {
        anyOf: [
          {type: 'boolean'},
          {type: 'null'},
          {type: 'number'},
          {type: 'string'},
        ],
      },
    },
  },
};

const SCHEMAS = {
  Aspect: {
    definitions: DEFINITIONS,
    properties: {
      description: {
        type: 'string',
      },
      variables: {$ref: '#/definitions/Variables'},
    },
    required: ['description'],
    type: 'object',
  },
  Project: {
    definitions: {
      ...DEFINITIONS,
      Aspect: {
        type: 'string',
        enum: aspects,
      },
    },
    properties: {
      platforms: {
        type: 'object',
        properties: {
          darwin: {
            type: 'object',
            properties: {
              aspects: {
                type: 'array',
                items: {$ref: '#/definitions/Aspect'},
              },
              variables: {$ref: '#/definitions/Variables'},
            },
            required: ['aspects'],
          },
          linux: {
            type: 'object',
            properties: {
              aspects: {
                type: 'array',
                items: {$ref: '#/definitions/Aspect'},
              },
              variables: {$ref: '#/definitions/Variables'},
            },
            required: ['aspects'],
          },
        },
        required: ['darwin', 'linux'],
      },
      profiles: {
        type: 'object',
        patternProperties: {
          '.*': {
            type: 'object',
            properties: {
              pattern: {
                type: 'string',
              },
              variables: {$ref: '#/definitions/Variables'},
            },
            required: ['pattern'],
          },
        },
      },
    },
    required: ['platforms'],
    type: 'object',
  },
};

module.exports = SCHEMAS;
