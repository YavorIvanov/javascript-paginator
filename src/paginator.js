class Paginator {
  constructor(params) {
    // normalize params
    if (!params.options)  { params.options   = {}; }
    if (!params.labels)   { params.labels   = {}; }
    if (!params.features) { params.features = {}; }

    // parameter defaults
    this.callback     = params.callback;
    this.totalItems   = params.totalItems;
    this.currentPage  = params.currentPage  || 1;
    this.itemsPerPage = params.itemsPerPage || 10;

    this.calculateTotalPages();   // this.totalPages
    this.calculatePreviousPage(); // this.previousPage
    this.calculateNextPage();     // this.nextPage

    this.firstPage   = 1;
    this.lastPage    = this.totalPages;

    // user preferences
    this.options = {
      innerPagesCount: this.setValue(params.options.innerPagesCount, 1),
      outerPagesCount: this.setValue(params.options.outerPagesCount, 1)
    };

    this.labels = {
      previousPage: params.labels.previousPage  || '❮',
      nextPage:     params.labels.nextPage      || '❯',
      firstPage:    params.labels.firstPage     || this.firstPage,
      lastPage:     params.labels.lastPage      || this.lastPage,
    };

    // feature switches
    this.features = {
      autoHide:     params.features.autoHide      || false,
      hideDisabled: params.features.hideDisabled  || false
    };
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.totalItems/this.itemsPerPage);
  }

  calculatePreviousPage() {
    if (this.currentPage <= this.totalPages && this.currentPage > 1) {
      this.previousPage = (this.currentPage-1);
    } else {
      this.previousPage = null;
    }
  }

  calculateNextPage() {
    if (this.currentPage < this.totalPages && this.totalPages > 1) {
      this.nextPage = (this.currentPage+1);
    } else {
      this.nextPage = null;
    }
  }

  setValue(integerValue, defaultValue) {
    if ( isNaN(parseInt(integerValue)) ) {
      return defaultValue;
    } else {
      return integerValue;
    }
  }

  // Generate functional DOM links for list
  generateListItem(pageNumber, label, classNames) {
    let item = document.createElement('li');
    let link = document.createElement('a');
    let text = document.createTextNode(label);
    if (classNames) {
      link.className = classNames.join(' ');
    }
    link.dataset.page = pageNumber;
    link.appendChild(text);
    item.appendChild(link);
    return item;
  }

  // Pass item range for user appplication query purposes
  getItemsRange(page = this.currentPage) {
    var start = ((page - 1) * this.itemsPerPage);
    var end = (start + this.itemsPerPage);
    return {
      start: start,
      end: end
    };
  }

  // Generate DOM and populate targeted element
  render(containerSelector) {
    // TODO refactor this to become smaller

    var self = this; // TODO should be able to remove this when refactoring

    // check if autoHide feature is on
    if (this.features.autoHide && this.totalPages === 1) { return; }

    // Find the pagination elements we want to fill in
    let containers = document.querySelectorAll(containerSelector);

    // Create DOM list
    let list = document.createElement('ul');
    // This would contain all list items ( pages )
    let items = [];
    
    // Push all pages
    for (let i = 1; i <= this.totalPages; i++) {
      if (
        ( i < self.firstPage + self.options.outerPagesCount ) || // left edge
        ( i > self.lastPage  - self.options.outerPagesCount ) || // right edge
        ( // around current page
          ( i >= self.currentPage - self.options.innerPagesCount ) &&
          ( i <= self.currentPage + self.options.innerPagesCount )
        )
      ) {
        // Determine page class and name
        let classNames = [];
        let textName = i;
        if (i === self.currentPage) {
          classNames.push('current');
        }
        if (i === self.firstPage) {
          textName = self.labels.firstPage;
          classNames.push('first');
        }
        if (i === self.lastPage) {
          textName = self.labels.lastPage;
          classNames.push('last');
        }
        // Push page
        items.push(self.generateListItem(i, textName, classNames));
      }
    };
    // Push previous page
    {
      let classNames = ['previous'];
      if (this.previousPage === null) {
        classNames.push('disabled');
      }
      if (!(this.features.hideDisabled && classNames.includes('disabled'))) {
        items.unshift(self.generateListItem(
          this.previousPage,
          this.labels.previousPage,
          classNames
        ));
      }
    }
    // Push next page
    {
      let classNames = ['next'];
      if (this.nextPage === null) {
        classNames.push('disabled');
      }
      if (!(this.features.hideDisabled && classNames.includes('disabled'))) {
        items.push(self.generateListItem(
          this.nextPage,
          this.labels.nextPage,
          classNames
        ));
      }
    }
    // Attach all pages to DOM list
    //for(let i of items.length) {
    //  list.appendChild(items[i]);
    //}
    for (let i = 0; i < items.length; i++) {
      list.appendChild(items[i]);
    }
    // Append the new DOM structure to all matched container
    containers.forEach( function(container) {
      let listCopy = list.cloneNode(true);
      container.appendChild(listCopy);
      // add event listeners
      let links = container.querySelectorAll('a'); // NB returns a static NodeList, not live/dynamic NodeList, but it's more flexible to work with
      links.forEach( function(link) {
        if (self.callback) {
          link.addEventListener('click', function() {
            let page = parseInt(this.dataset.page); // the clicked page in integer
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
      });
    });

    //for (let container of containers) {
    //  container.innerText = 'test';
    //}
  }
}
