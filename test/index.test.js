/**
 * Copyright(c) node-modules and other contributors.
 * MIT Licensed
 *
 * Authors:
 *  dead_horse <dead_horse@qq.com>
 */

'use strict';
var fs = require('fs');
var path = require('path');
var prettier = require("prettier");

/**
 * Module dependencies.
 */

var should = require('should');
var util = require('util');
var ParameterInterface = require('..');
var ParameterInterface = new ParameterInterface();

const testSuit = {
  require: {int: {type: 'int', required: true}},
  notrequire: {int: {type: 'int', required: false}},
  int: { int: {type: 'int', max: 100, min: 1 }},
  number: { number: {type: 'number', max: 100, min: 1 }},
  string: { string: {type: 'string', max: 100, min: 1, format: /^\D+$/ }},
  id: {id: 'id'},
  date: {date: 'date'},
  datetime: {dateTime: 'dateTime'},
  boolean: {boolean: 'boolean'},
  enumNumber: {enum: [1, 2, 3]},
  enumStirng: {enum: ['x', 'y', 'z']},
  email: { name: { type: 'email' } },
  password: {
    password: {
      type: 'password',
    }
  },
  url: { name: { type: 'url' } },
  object: {
    object: {
      type: 'object',
      rule: {
        name: 'string',
        age: 'int'
      }
    }
  },
  array: {
    array: {
      type: 'array',
      itemType: 'object',
      rule: {
        name: 'string',
        age: 'int'
      }
    }
  },
  arrayItemType: {
    array: {
      type: 'array',
      itemType: 'object',
      rule: {
        name: 'string',
        age: 'int'
      }
    }
  },
  arrayItemType2: {
    array: {
      type: 'array',
      itemType: 'string',
      rule: {type: 'string', allowEmpty: true}
    }
  },
  complex: {
    a: {
      type: 'string',
    },
    b: {
      type: 'number',
      required: false,
    },
    c: {
      type: 'object',
      rule: {
        childx: {
          type: 'enum',
          values: ['x', 'y', 'z'],
        },
        childy: {
          type: 'array',
          itemType: 'object',
          rule: {
            foo: 'number',
            bar: 'string',
          }
        }
      },
    }
  }
}








  Object.keys(testSuit).forEach(type => {
    let result =  ParameterInterface.transform(testSuit[type]);
    result = prettier.format('interface Parameter' + result, {
      parser: 'typescript',
    });
    fs.writeFileSync(path.resolve(__dirname, './fixtures/', `${type}.ts`), result);
  })






