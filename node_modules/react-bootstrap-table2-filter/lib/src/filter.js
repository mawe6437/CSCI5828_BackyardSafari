'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.filters = exports.filterFactory = exports.filterByNumber = exports.filterByText = undefined;

var _const = require('./const');

var _comparison = require('./comparison');

/* eslint eqeqeq: 0 */
/* eslint no-console: 0 */
var filterByText = exports.filterByText = function filterByText(_) {
  return function (data, dataField, _ref, customFilterValue) {
    var _ref$filterVal = _ref.filterVal,
        userInput = _ref$filterVal === undefined ? '' : _ref$filterVal,
        _ref$comparator = _ref.comparator,
        comparator = _ref$comparator === undefined ? _comparison.LIKE : _ref$comparator,
        caseSensitive = _ref.caseSensitive;

    // make sure filter value to be a string
    var filterVal = userInput.toString();

    return data.filter(function (row) {
      var cell = _.get(row, dataField);
      if (customFilterValue) {
        cell = customFilterValue(cell, row);
      }
      var cellStr = _.isDefined(cell) ? cell.toString() : '';
      if (comparator === _comparison.EQ) {
        return cellStr === filterVal;
      }
      if (caseSensitive) {
        return cellStr.includes(filterVal);
      }

      return cellStr.toLocaleUpperCase().indexOf(filterVal.toLocaleUpperCase()) !== -1;
    });
  };
};

var filterByNumber = exports.filterByNumber = function filterByNumber(_) {
  return function (data, dataField, _ref2, customFilterValue) {
    var _ref2$filterVal = _ref2.filterVal,
        comparator = _ref2$filterVal.comparator,
        number = _ref2$filterVal.number;
    return data.filter(function (row) {
      if (number === '' || !comparator) return true;
      var valid = true;
      var cell = _.get(row, dataField);
      if (customFilterValue) {
        cell = customFilterValue(cell, row);
      }

      switch (comparator) {
        case _comparison.EQ:
          {
            if (cell != number) {
              valid = false;
            }
            break;
          }
        case _comparison.GT:
          {
            if (cell <= number) {
              valid = false;
            }
            break;
          }
        case _comparison.GE:
          {
            if (cell < number) {
              valid = false;
            }
            break;
          }
        case _comparison.LT:
          {
            if (cell >= number) {
              valid = false;
            }
            break;
          }
        case _comparison.LE:
          {
            if (cell > number) {
              valid = false;
            }
            break;
          }
        case _comparison.NE:
          {
            if (cell == number) {
              valid = false;
            }
            break;
          }
        default:
          {
            console.error('Number comparator provided is not supported');
            break;
          }
      }
      return valid;
    });
  };
};

var filterFactory = exports.filterFactory = function filterFactory(_) {
  return function (filterType) {
    var filterFn = void 0;
    switch (filterType) {
      case _const.FILTER_TYPE.TEXT:
      case _const.FILTER_TYPE.SELECT:
        filterFn = filterByText(_);
        break;
      case _const.FILTER_TYPE.NUMBER:
        filterFn = filterByNumber(_);
        break;
      default:
        filterFn = filterByText(_);
    }
    return filterFn;
  };
};

var filters = exports.filters = function filters(store, columns, _) {
  return function (currFilters) {
    var factory = filterFactory(_);
    var result = store.getAllData();
    var filterFn = void 0;
    Object.keys(currFilters).forEach(function (dataField) {
      var filterObj = currFilters[dataField];
      filterFn = factory(filterObj.filterType);
      var filterValue = void 0;
      for (var i = 0; i < columns.length; i += 1) {
        if (columns[i].dataField === dataField) {
          filterValue = columns[i].filterValue;
          break;
        }
      }
      result = filterFn(result, dataField, filterObj, filterValue);
    });
    return result;
  };
};