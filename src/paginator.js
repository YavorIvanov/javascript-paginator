function Paginator(params) {

  // normalize params
  if (!params.labels)   { params.labels   = {}; }
  if (!params.features) { params.features = {}; }

  // -- parameter defaults --

  this.totalItems         = params.total_items;         // !!! required
  this.currentPage        = params.current_page || 1;   // !!! required
  this.itemsPerPage       = params.items_per_page || 10;
  this.totalPages         = this.calculateTotalPages();
  this.previousPage       = this.calculatePreviousPage();
  this.nextPage           = this.calculateNextPage();
  this.firstPage          = 1;
  this.lastPage           = this.totalPages;

  // user perferences
  this.outerWindow        = params.outer_window; // !!! required
  this.innerWindow        = params.inner_window; // !!! required

  this.labels = {
    previousPage:   params.labels.previous_page   || '❮',
    nextPage:       params.labels.next_page       || '❯',
    firstPage:      params.labels.first_page      || this.firstPage,
    lastPage:       params.labels.last_page       || this.lastPage,
  };

  // feature switches
  this.features = {
    autoHide:       params.features.auto_hide      || false,
    hideDisabled:   params.features.hide_disabled  || false
  };


  //this.page           = params.page || 'page';

  // -- non prototype --

  // Generate DOM and populate targeted element
  this.render = function(containerSelector) {
    // TODO refactor this to become smaller

    var self = this;

    // check if autoHide feature is on
    if (this.features.autoHide && this.totalPages === 1) { return; }

    // Find the pagination elements we want to fill in
    var containers = document.querySelectorAll(containerSelector);
    // Create DOM list
    var list = document.createElement('ul');
    // This would contain all list items ( pages )
    var items = [];
    // Push all pages
    for (i = 1; i <= this.totalPages; i++) {
      debugger;
      if (
        ( i < this.firstPage + this.outerWindow ) || // left edge
        ( i > this.lastPage  - this.outerWindow ) || // right edge
        ( // around current page
          ( i >= this.currentPage - this.innerWindow ) &&
          ( i <= this.currentPage + this.innerWindow )
        )
      ) {
        // Determine page class and name
        var classNames = [];
        var textName = i;
        if (i === this.currentPage) {
          classNames.push('current');
        }
        if (i === this.firstPage) {
          textName = this.labels.firstPage;
          classNames.push('first');
        }
        if (i === this.lastPage) {
          textName = this.labels.lastPage;
          classNames.push('last');
        }
        // Push page
        items.push(this.generateListItem(i, textName, classNames));
      }
    };
    // Push previous page
    var classNames = ['previous'];
    if (this.previousPage === null) {
      classNames.push('disabled');
    }
    if (!(this.features.hideDisabled && classNames.includes('disabled'))) {
      items.unshift(this.generateListItem(
        this.previousPage,
        this.labels.previousPage,
        classNames
      ));
    }
    // Push next page
    var classNames = ['next'];
    if (this.nextPage === null) {
      classNames.push('disabled');
    }
    if (!(this.features.hideDisabled && classNames.includes('disabled'))) {
      items.push(this.generateListItem(
        this.nextPage,
        this.labels.nextPage,
        classNames
      ));
    }
    // Attach all pages to DOM list
    for (i = 0; i < items.length; i++) {
      list.appendChild(items[i]);
    }
    // Append the new DOM structure to all matched container
    containers.forEach( function(container) {
      var listCopy = list.cloneNode(true);
      container.appendChild(listCopy);
      // add event listeners
      var links = container.querySelectorAll('a'); // NB returns a static NodeList, not live/dynamic NodeList, but it's more flexible to work with
      links.forEach( function(link) {
        if (params.callback) {
          link.addEventListener('click', function() {
            var page = parseInt(this.dataset.page); // the clicked page in integer
            params.callback({
              page: page,
              itemsRange: self.getItemsRange(page)
            });
          });
        } else {
          // TODO same url and attach page variable at the end
          // or just make your own callback that does that
          // if user one is missing; this might be better
        }
      });
    });
  };

};

// -- prototype --
Paginator.prototype = {

  // What is the previous page from the current one
  calculatePreviousPage: function() {
    if (this.currentPage <= this.totalPages && this.currentPage > 1) {
      return (this.currentPage-1);
    } else {
      return null;
    }
  },

  // What is the next page from the current one
  calculateNextPage: function() {
    if (this.currentPage < this.totalPages && this.totalPages > 1) {
      return (this.currentPage+1);
    } else {
      return null;
    }
  },

  // Calculate the maximum pages the pagination should have
  calculateTotalPages: function() {
    return Math.ceil(this.totalItems/this.itemsPerPage);
  },

  // Generate functional DOM links for list
  generateListItem: function(pageNumber, label, classNames) {
    var item = document.createElement('li');
    var link = document.createElement('a');
    var text = document.createTextNode(label);

    if (classNames) { link.className = classNames.join(' '); }

    link.dataset.page = pageNumber;

    link.appendChild(text);
    item.appendChild(link);
    return item;
  },

  // Pass item range for user appplication query purposes
  getItemsRange: function(page = this.currentPage) {
    var start = ((page - 1) * this.itemsPerPage);
    var end = (start + this.itemsPerPage);
    return {
      start: start,
      end: end
    };
  }

};
