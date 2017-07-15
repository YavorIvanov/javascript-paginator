class Paginator {

  constructor(params) {

    // normalize params object
    if (!params.options)  { params.options  = {}; }
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
      currentPage:  params.labels.currentPage   || this.currentPage,
      previousPage: params.labels.previousPage  || "❮",
      nextPage:     params.labels.nextPage      || "❯",
      firstPage:    params.labels.firstPage     || this.firstPage,
      lastPage:     params.labels.lastPage      || this.lastPage,
      gapPage:      params.labels.gapPage       || "…"
    };

    // feature switches
    this.features = {
      hideAuto:     params.features.hideAuto      || false, // hide the whole pagination if it's one page
      hideGaps:     params.features.hideGaps      || false, // hide the gaps between outer and inner pages
      hideAdjacent: params.features.hideAdjacent  || false, // hide the next and previous page
      hideDisabled: params.features.hideDisabled  || false, // hide all pages with page state disabled
    };

    // internals
    this.pageStates = {
      disabled: "disabled",
      hide:     "hide",
      current:  "current",
      first:    "first",
      last:     "last",
      previous: "previous",
      next:     "next",
      gap:      "gap"
    };
    // up to date Pages array of Page objects
    this.pages = [];
    // TODO make this another class and use real objects
    // NB filled with page object:
    //page = {
    //  order: 0
    //  label: "previous",
    //  state: ["disabled", "previous"],
    //  node: <DOM/NODE>
    //};
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

  // Pass item range for user appplication query purposes
  getItemsRange(page = this.currentPage) {
    var start = ((page - 1) * this.itemsPerPage);
    var end = (start + this.itemsPerPage);
    return {
      start: start,
      end: end
    };
  }

  // Generate page hash for pages array
  generatePage(order, label, states, node) {
    const hash = {
      order: order,
      label: label,
      state: states,
      node: node
    };
    return hash;
  }

  // Generate functional DOM link for the page hash
  generateNode(pageNumber, label, classNames) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    const text = document.createTextNode(label);
    if (classNames) {
      link.className = classNames.join(" ");
    }
    link.dataset.page = pageNumber;
    link.appendChild(text);
    item.appendChild(link);
    return item;
  }

  sortPages() {
    this.pages.sort(function (a, b) {
      return (a.order - b.order);
    });
  }

  buildPreviousPage(order) {
    const dataset = this.previousPage;
    const label = this.labels.previousPage;
    const classNames = [this.pageStates.previous];
    if (this.previousPage == null) {
      classNames.push(this.pageStates.disabled);
    }
    // feature => hideAdjacent
    if (this.features.hideAdjacent) {
      classNames.push(this.pageStates.hide);
    }
    // feature => hideDisabled
    if (this.features.hideDisabled && classNames.includes(this.pageStates.disabled)) {
      classNames.push(this.pageStates.hide);
    }
    const node = this.generateNode(dataset, label, classNames);
    const page = this.generatePage(order,   label, classNames, node);
    this.pages.unshift(page);
  }

  buildNextPage(order) {
    const dataset = this.nextPage;
    const label = this.labels.nextPage;
    const classNames = [this.pageStates.next];
    if (this.nextPage == null) {
      classNames.push(this.pageStates.disabled);
    }
    // feature => hideAdjacent
    if (this.features.hideAdjacent) {
      classNames.push(this.pageStates.hide);
    }
    // feature => hideDisabled
    if (this.features.hideDisabled && classNames.includes(this.pageStates.disabled)) {
      classNames.push(this.pageStates.hide);
    }
    const node = this.generateNode(dataset, label, classNames);
    const page = this.generatePage(order,   label, classNames, node);
    this.pages.push(page);
  }

  buildGaps() {
    const outerEdgeLeft  = this.firstPage + this.options.outerPagesCount;
    const outerEdgeRight = this.lastPage  - this.options.outerPagesCount;
    const innerEdgeLeft  = this.currentPage - this.options.innerPagesCount;
    const innerEdgeRight = this.currentPage + this.options.innerPagesCount;

    const label = this.labels.gapPage;
    const classNames = [this.pageStates.gap];
    // feature => hideGaps
    if (this.features.hideGaps) {
      classNames.push(this.pageStates.hide);
    }
    // left side
    if (innerEdgeLeft > outerEdgeLeft) {
      const order = (this.currentPage - this.options.innerPagesCount - 1);
      const node = this.generateNode("",  label, classNames);
      const page = this.generatePage(order, label, classNames, node);
      this.pages.push(page);
    }
    // right side
    if (outerEdgeRight > innerEdgeRight) {
      const order = (this.currentPage + this.options.innerPagesCount);
      const node = this.generateNode("",  label, classNames);
      const page = this.generatePage(order, label, classNames, node);
      this.pages.push(page);
    }
  }

  buildAllPages() {
    const outerEdgeLeft  = this.firstPage + this.options.outerPagesCount;
    const outerEdgeRight = this.lastPage  - this.options.outerPagesCount;
    const innerEdgeLeft  = this.currentPage - this.options.innerPagesCount;
    const innerEdgeRight = this.currentPage + this.options.innerPagesCount;
    for (let i = 1; i <= this.totalPages; i++) {
      if (
        ( i <  outerEdgeLeft || i >  outerEdgeRight ) ||
        ( i >= innerEdgeLeft && i <= innerEdgeRight )
      ) {
        // Determine page class and name
        const classNames = [];
        let textName = i;
        if (i === this.currentPage) {
          classNames.push(this.pageStates.current);
        }
        if (i === this.firstPage) {
          textName = this.labels.firstPage;
          classNames.push(this.pageStates.first);
        }
        if (i === this.lastPage) {
          textName = this.labels.lastPage;
          classNames.push(this.pageStates.last);
        }
        // Push page
        const node = this.generateNode(i, textName, classNames);
        const page = this.generatePage(i, textName, classNames, node);
        this.pages.push(page);
      }
    }
  }

  clearPages() {
    this.pages = [];
  }

  // Generate DOM and populate targeted element
  // TODO use this only for DOM render and another method to build full Pages array
  render(containerSelector) {
    // feature => hideAdjacent
    if (this.features.hideAuto && this.totalPages < 2) {
      return;
    }

    // Find the pagination elements we want to fill in
    const containers = document.querySelectorAll(containerSelector);

    // Create DOM list
    const list = document.createElement("ul");
    // This would contain all list pages

    var self = this; // TODO should be able to remove this when refactoring

    // recalculate in case the user has tampered with the object
    this.calculateTotalPages();   // this.totalPages
    this.calculatePreviousPage(); // this.previousPage
    this.calculateNextPage();     // this.nextPage

    this.clearPages();
    this.buildAllPages();
    this.buildPreviousPage(0); // default to first position
    this.buildNextPage(this.totalPages+1); // default to last position
    this.buildGaps();

    this.sortPages();

    for (let i = 0; i < self.pages.length; i++) {
      list.appendChild(self.pages[i].node);
    }
    // Append the new DOM structure to all matched container
    for (const container of containers) {
      // clear the container for fresh render
      container.innerHTML = "";
      // copy the created nodes
      const listCopy = list.cloneNode(true);
      container.appendChild(listCopy);
      // add event listeners
      const links = container.querySelectorAll("a"); // NB returns a static NodeList, not live/dynamic NodeList, but it"s more flexible to work with
      for (const link of links) {
        if (self.callback) {
          link.addEventListener("click", function() {
            const page = parseInt(this.dataset.page); // the clicked page in integer
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
    }
  }

  update(containerSelector) {
    // Find the pagination elements we want to fill in
    const containers = document.querySelectorAll(containerSelector);
    // Drop current contents
    for (const container of containers) {
      container.innerHTML = "";
    }
    // re-render
    this.render(containerSelector);
  }

}
