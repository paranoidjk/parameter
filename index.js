'use strict';

/**
 * Parameter class
 * @class Parameter
 */
class ParameterToInterface {

  /**
   * transform
   *
   * @param {Object} rules
   * @api public
   */
  transform(rules) {
    if (typeof rules !== 'object') {
      throw new TypeError('need object type rule');
    }

    var self = this;

    var result = [];

    for (var key in rules) {
      var rule = formatRule(rules[key]);

      let leftStr = `${key}${rule.require ? '' : '?'}: `;

      var spec_transfrom = TYPE_MAP[rule.type];
      if (!checker) {
        throw new TypeError('rule type must be one of ' + Object.keys(TYPE_MAP).join(', ') +
          ', but the following type was passed: ' + rule.type);
      }

      var rightStr = spec_transfrom.call(self, rule, obj[key], obj);
      result.push(leftStr + rightStr);
    }
    return '{\n' + result.join('\n') + '}';
  }
};

/**
 * Module exports
 * @type {Function}
 */
module.exports = Parameter;


/**
 * Simple type map
 * @type {Object}
 */
var TYPE_MAP = ParameterToInterface.TYPE_MAP = {
  number: checkNumber,
  int: checkInt,
  integer: checkInt,
  string: checkString,
  id: checkId,
  date: checkDate,
  dateTime: checkDateTime,
  datetime: checkDateTime,
  boolean: checkBoolean,
  bool: checkBoolean,
  array: checkArray,
  object: checkObject,
  enum: checkEnum,
  email: checkEmail,
  password: checkPassword,
  url: checkUrl,
};

/**
 * format a rule
 *
 * @param {Mixed} rule
 * @return {Object}
 * @api private
 */

function formatRule(rule) {
  if (typeof rule === 'string') {
    return { type: rule };
  }
  if (Array.isArray(rule)) {
    return { type: 'enum', values: rule };
  }
  if (rule instanceof RegExp) {
    return { type: 'string', format: rule };
  }
  return rule || {};
}

/**
 * check interger
 * {
 *   max: 100,
 *   min: 0
 * }
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkInt(rule) {
  return 'number;';
}

/**
 * check number
 * {
 *   max: 100,
 *   min: 0
 * }
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkNumber(rule) {
  return 'number;';
}

/**
 * check string
 * {
 *   allowEmpty: true, // (default to false, alias to empty)
 *   format: /^\d+$/,
 *   max: 100,
 *   min: 0
 * }
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkString(rule) {
  return 'string;';
}

/**
 * check id format
 * format: /^\d+/
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkId(rule) {
  return 'string;'
}

/**
 * check date format
 * format: YYYY-MM-DD
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkDate(rule) {
  return 'string';
}

/**
 * check date time format
 * format: YYYY-MM-DD HH:mm:ss
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkDateTime(rule) {
  return 'string';
}

/**
 * check boolean
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkBoolean(rule) {
 return 'boolean';
}

/**
 * check enum
 * {
 *   values: [0, 1, 2]
 * }
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkEnum(rule) {
  if (!Array.isArray(rule.values)) {
    throw new TypeError('check enum need array type values');
  }
  return rule.values.map(item => typeof item === 'string' ? `'${item}'` : item ).join(' | ') + ';';
}

/**
 * check email
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkEmail(rule) {
  return 'string';
}

/**
 * check password
 * @param {Object} rule
 * @param {Object} value
 * @param {Object} obj
 * @return {Boolean}
 *
 * @api private
 */

function checkPassword(rule) {
  return 'string';
}

/**
 * check url
 *
 * @param {Object} rule
 * @param {Object} value
 * @return {Boolean}
 * @api private
 */

function checkUrl(rule) {
  return 'string';
}

/**
 * check object
 * {
 *   rule: {}
 * }
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkObject(rule) {
  if (rule.rule) {
    return this.transform(rule.rule);
  }
}

/**
 * check array
 * {
 *   type: 'array',
 *   itemType: 'string'
 *   rule: {type: 'string', allowEmpty: true}
 * }
 *
 * {
 *   type: 'array'.
 *   itemType: 'object',
 *   rule: {
 *     name: 'string'
 *   }
 * }
 *
 * @param {Object} rule
 * @param {Mixed} value
 * @return {Boolean}
 * @api private
 */

function checkArray(rule) {
  if (!rule.itemType) {
    return 'any[]';
  }

  var self = this;
  var checker = TYPE_MAP[rule.itemType];
  if (!checker) {
    throw new TypeError('rule type must be one of ' + Object.keys(TYPE_MAP).join(', ') +
        ', but the following type was passed: ' + rule.itemType);
  }

  var errors = [];
  var subRule = formatRule.call(self, rule.itemType === 'object' ? rule.rule : rule.itemType);

  var itemResult = this.transform(subRule);

  return `${itemResult}[]`;
}
