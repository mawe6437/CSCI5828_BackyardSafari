'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.numberFilter = exports.selectFilter = exports.textFilter = exports.Comparator = undefined;

var _text = require('./src/components/text');

var _text2 = _interopRequireDefault(_text);

var _select = require('./src/components/select');

var _select2 = _interopRequireDefault(_select);

var _number = require('./src/components/number');

var _number2 = _interopRequireDefault(_number);

var _wrapper = require('./src/wrapper');

var _wrapper2 = _interopRequireDefault(_wrapper);

var _comparison = require('./src/comparison');

var Comparison = _interopRequireWildcard(_comparison);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    wrapperFactory: _wrapper2.default,
    options: options
  };
};

var Comparator = exports.Comparator = Comparison;

var textFilter = exports.textFilter = function textFilter() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    Filter: _text2.default,
    props: props
  };
};

var selectFilter = exports.selectFilter = function selectFilter() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    Filter: _select2.default,
    props: props
  };
};

var numberFilter = exports.numberFilter = function numberFilter() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return {
    Filter: _number2.default,
    props: props
  };
};