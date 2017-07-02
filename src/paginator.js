function Paginator(params = {}) {

  // -- parameter defaults --

  this.totalItems         = params.total_items;
  this.itemsPerPage       = params.items_per_page || 10;
  this.totalPages         = params.total_pages || this.calculateTotalPages();
  this.currentPage        = params.current_page || 1;
  this.previousPage       = this.calculatePreviousPage();
  this.nextPage           = this.calculateNextPage();
  this.firstPage          = 1;
  this.lastPage           = this.totalPages;

  // user perferences
  this.outerWindow        = params.outer_window || 1; // 0 to hide first & last
  this.innerWindow        = params.inner_window || 1; // around current

  this.previousPageLabel  = params.previous_page_label  || '❮';
  this.nextPageLabel      = params.next_page_label      || '❯';
  this.firstPageLabel     = params.first_page_label     || this.firstPage;
  this.lastPageLabel      = params.last_page_label      || this.lastPage;


  //this.page           = params.page || 'page';

  // -- non prototype --

  // Generate DOM and populate targeted element
  this.render = function(containerSelector) {
    // TODO refactor this to become smaller

    // Find the pagination elements we want to fill in
    var containers = document.querySelectorAll(containerSelector);
    // Create DOM list
    var list = document.createElement('ul');
    // This would contain all list items ( pages )
    var items = [];
    // Push all pages
    for (i = 1; i <= this.totalPages; i++) {
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
          textName = this.firstPageLabel;
          classNames.push('first');
        }
        if (i === this.lastPage) {
          textName = this.lastPageLabel;
          classNames.push('last');
        }
        // Push page
        items.push(this.generateListItem(i, textName, classNames));
      }
    };
    // Push previous page
    if (this.previousPage !== null) {
      items.unshift(this.generateListItem(
        this.previousPage,
        this.previousPageLabel,
        ['previous'])
      );
    }
    // Push next page
    if (this.nextPage !== null) {
      items.push(this.generateListItem(
        this.nextPage,
        this.nextPageLabel,
        ['next']
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
            params.callback({
              page: this.dataset.page
            });
          });
        } else {
          // TODO same url and attack page variable at the end
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
    if (this.currentPage < this.totalPages && this.currentPage > 1) {
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
  }

};