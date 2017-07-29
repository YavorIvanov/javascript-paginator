'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Page = function () {
  function Page(order, label) {
    var states = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];
    var dataset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};

    _classCallCheck(this, Page);

    this.order = order;
    this.label = label;
    this.dataset = dataset;
    this.states = states;
    this.node = this.generateNode(label, states, dataset);
  }

  // Generate functional DOM link for the page hash


  _createClass(Page, [{
    key: 'generateNode',
    value: function generateNode(label) {
      var states = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var dataset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var item = document.createElement('li');
      var link = document.createElement('a');
      var text = document.createTextNode(label);
      if (states) {
        link.className = states.join(' ');
      }
      for (var data in dataset) {
        link.dataset[data] = dataset[data];
      }
      link.appendChild(text);
      item.appendChild(link);
      return item;
    }
  }]);

  return Page;
}();