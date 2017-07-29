'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Paginator = function () {
  function Paginator(params) {
    _classCallCheck(this, Paginator);

    // normalize params object
    if (!params.options) {
      params.options = {};
    }
    if (!params.labels) {
      params.labels = {};
    }
    if (!params.features) {
      params.features = {};
    }

    // parameter defaults
    this.callback = params.callback;
    this.totalItems = params.totalItems;
    this.currentPage = params.currentPage || 1;
    this.itemsPerPage = params.itemsPerPage || 10;

    this.calculateTotalPages(); // this.totalPages
    this.calculatePreviousPage(); // this.previousPage
    this.calculateNextPage(); // this.nextPage

    this.firstPage = 1;
    this.lastPage = this.totalPages;

    // user preferences
    this.options = {
      innerPagesCount: this.setValue(params.options.innerPagesCount, 1),
      outerPagesCount: this.setValue(params.options.outerPagesCount, 1)
    };

    this.labels = {
      currentPage: params.labels.currentPage || this.currentPage,
      previousPage: params.labels.previousPage || '❮',
      nextPage: params.labels.nextPage || '❯',
      firstPage: params.labels.firstPage || this.firstPage,
      lastPage: params.labels.lastPage || this.lastPage,
      gapPage: params.labels.gapPage || '…'
    };

    // feature switches
    this.features = {
      hideAuto: params.features.hideAuto || false, // hide the whole pagination if it's one page
      hideGaps: params.features.hideGaps || false, // hide the gaps between outer and inner pages
      hideAdjacent: params.features.hideAdjacent || false, // hide the next and previous page
      hideDisabled: params.features.hideDisabled || false // hide all pages with page state disabled
    };

    // internals
    this.pageStates = {
      disabled: 'disabled',
      hide: 'hide',
      current: 'current',
      first: 'first',
      last: 'last',
      previous: 'previous',
      next: 'next',
      gap: 'gap'
    };
    // up to date Pages array of Page objects
    this.pages = [];
    // TODO make this another class and use real objects
    // NB filled with page object:
    //page = {
    //  order: 0
    //  label: 'previous',
    //  state: ['disabled', 'previous'],
    //  node: <DOM/NODE>
    //};
  }

  _createClass(Paginator, [{
    key: 'calculateTotalPages',
    value: function calculateTotalPages() {
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    }
  }, {
    key: 'calculatePreviousPage',
    value: function calculatePreviousPage() {
      if (this.currentPage <= this.totalPages && this.currentPage > 1) {
        this.previousPage = this.currentPage - 1;
      } else {
        this.previousPage = null;
      }
    }
  }, {
    key: 'calculateNextPage',
    value: function calculateNextPage() {
      if (this.currentPage < this.totalPages && this.totalPages > 1) {
        this.nextPage = this.currentPage + 1;
      } else {
        this.nextPage = null;
      }
    }
  }, {
    key: 'setValue',
    value: function setValue(integerValue, defaultValue) {
      if (isNaN(parseInt(integerValue))) {
        return defaultValue;
      } else {
        return integerValue;
      }
    }

    // Pass item range for user appplication query purposes

  }, {
    key: 'getItemsRange',
    value: function getItemsRange() {
      var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.currentPage;

      var start = (page - 1) * this.itemsPerPage;
      var end = start + this.itemsPerPage;
      return {
        start: start,
        end: end
      };
    }
  }, {
    key: 'sortPages',
    value: function sortPages() {
      this.pages.sort(function (a, b) {
        return a.order - b.order;
      });
    }
  }, {
    key: 'buildPreviousPage',
    value: function buildPreviousPage(order) {
      var dataset = { page: this.previousPage };
      var label = this.labels.previousPage;
      var states = [this.pageStates.previous];
      if (this.previousPage == null) {
        states.push(this.pageStates.disabled);
      }
      // feature => hideAdjacent
      if (this.features.hideAdjacent) {
        states.push(this.pageStates.hide);
      }
      // feature => hideDisabled
      if (this.features.hideDisabled && states.includes(this.pageStates.disabled)) {
        states.push(this.pageStates.hide);
      }
      var page = new Page(order, label, states, dataset);
      this.pages.unshift(page);
    }
  }, {
    key: 'buildNextPage',
    value: function buildNextPage(order) {
      var dataset = { page: this.nextPage };
      var label = this.labels.nextPage;
      var states = [this.pageStates.next];
      if (this.nextPage == null) {
        states.push(this.pageStates.disabled);
      }
      // feature => hideAdjacent
      if (this.features.hideAdjacent) {
        states.push(this.pageStates.hide);
      }
      // feature => hideDisabled
      if (this.features.hideDisabled && states.includes(this.pageStates.disabled)) {
        states.push(this.pageStates.hide);
      }
      var page = new Page(order, label, states, dataset);
      this.pages.push(page);
    }
  }, {
    key: 'buildGaps',
    value: function buildGaps() {
      var outerEdgeLeft = this.firstPage + this.options.outerPagesCount;
      var outerEdgeRight = this.lastPage - this.options.outerPagesCount;
      var innerEdgeLeft = this.currentPage - this.options.innerPagesCount;
      var innerEdgeRight = this.currentPage + this.options.innerPagesCount;

      var label = this.labels.gapPage;
      var states = [this.pageStates.gap];
      // feature => hideGaps
      if (this.features.hideGaps) {
        states.push(this.pageStates.hide);
      }
      // left side
      if (innerEdgeLeft > outerEdgeLeft) {
        var order = this.currentPage - this.options.innerPagesCount - 1;
        var page = new Page(order, label, states);
        this.pages.push(page);
      }
      // right side
      if (outerEdgeRight > innerEdgeRight) {
        var _order = this.currentPage + this.options.innerPagesCount;
        var _page = new Page(_order, label, states);
        this.pages.push(_page);
      }
    }
  }, {
    key: 'buildAllPages',
    value: function buildAllPages() {
      var outerEdgeLeft = this.firstPage + this.options.outerPagesCount;
      var outerEdgeRight = this.lastPage - this.options.outerPagesCount;
      var innerEdgeLeft = this.currentPage - this.options.innerPagesCount;
      var innerEdgeRight = this.currentPage + this.options.innerPagesCount;
      for (var i = 1; i <= this.totalPages; i++) {
        if (i < outerEdgeLeft || i > outerEdgeRight || i >= innerEdgeLeft && i <= innerEdgeRight) {
          // Determine page class and name
          var states = [];
          var label = i;
          if (i === this.currentPage) {
            states.push(this.pageStates.current);
          }
          if (i === this.firstPage) {
            label = this.labels.firstPage;
            states.push(this.pageStates.first);
          }
          if (i === this.lastPage) {
            label = this.labels.lastPage;
            states.push(this.pageStates.last);
          }
          // Push page
          var page = new Page(i, label, states, { page: i });
          this.pages.push(page);
        }
      }
    }
  }, {
    key: 'clearPages',
    value: function clearPages() {
      this.pages = [];
    }

    // Generate DOM and populate targeted element
    // TODO use this only for DOM render and another method to build full Pages array

  }, {
    key: 'render',
    value: function render(containerSelector) {
      // feature => hideAdjacent
      if (this.features.hideAuto && this.totalPages < 2) {
        return;
      }

      // Find the pagination elements we want to fill in
      var containers = document.querySelectorAll(containerSelector);

      // Create DOM list
      var list = document.createElement('ul');
      // This would contain all list pages

      var self = this; // TODO should be able to remove this when refactoring

      // recalculate in case the user has tampered with the object
      this.calculateTotalPages(); // this.totalPages
      this.calculatePreviousPage(); // this.previousPage
      this.calculateNextPage(); // this.nextPage

      this.clearPages();
      this.buildAllPages();
      this.buildPreviousPage(0); // default to first position
      this.buildNextPage(this.totalPages + 1); // default to last position
      this.buildGaps();

      this.sortPages();

      for (var i = 0; i < self.pages.length; i++) {
        list.appendChild(self.pages[i].node);
      }
      // Append the new DOM structure to all matched container
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = containers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var container = _step.value;

          // clear the container for fresh render
          container.innerHTML = '';
          // copy the created nodes
          var listCopy = list.cloneNode(true);
          container.appendChild(listCopy);
          // add event listeners
          var links = container.querySelectorAll('a'); // NB returns a static NodeList, not live/dynamic NodeList, but it's more flexible to work with
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = links[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var link = _step2.value;

              if (self.callback) {
                link.addEventListener('click', function () {
                  var page = parseInt(this.dataset.page); // the clicked page in integer
                  self.callback({
                    page: page,
                    itemsRange: self.getItemsRange(page)
                  });
                });
              } else {
                // TODO same url and attach page variable at the end
                // or just make your own callback that does that
                // if user one is missing; this might be better
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: 'update',
    value: function update(containerSelector) {
      // Find the pagination elements we want to fill in
      var containers = document.querySelectorAll(containerSelector);
      // Drop current contents
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = containers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var container = _step3.value;

          container.innerHTML = '';
        }
        // re-render
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      this.render(containerSelector);
    }
  }]);

  return Paginator;
}();