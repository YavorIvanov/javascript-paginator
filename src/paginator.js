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
    let hash = {
      order: order,
      label: label,
      state: states,
      node: node
    };
    return hash;
  }

  // Generate functional DOM link for the page hash
  generateNode(pageNumber, label, classNames) {
    let item = document.createElement("li");
    let link = document.createElement("a");
    let text = document.createTextNode(label);
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
    let dataset = this.previousPage;
    let label = this.labels.previousPage;
    let classNames = [this.pageStates.previous];
    if (this.previousPage == null) {
      classNames.push(this.pageStates.disabled);
    }
    let node = this.generateNode(dataset, label, classNames);
    let page = this.generatePage(order,   label, classNames, node);
    this.pages.unshift(page);
  }

  buildNextPage(order) {
    let dataset = this.nextPage;
    let label = this.labels.nextPage;
    let classNames = [this.pageStates.next];
    if (this.nextPage == null) {
      classNames.push(this.pageStates.disabled);
    }
    let node = this.generateNode(dataset, label, classNames);
    let page = this.generatePage(order,   label, classNames, node);
    this.pages.push(page);
  }

  buildGaps() {
    let outerEdgeLeft  = this.firstPage + this.options.outerPagesCount;
    let outerEdgeRight = this.lastPage  - this.options.outerPagesCount;
    let innerEdgeLeft  = this.currentPage - this.options.innerPagesCount;
    let innerEdgeRight = this.currentPage + this.options.innerPagesCount;

    let label = this.labels.gapPage;
    let classNames = [this.pageStates.gap];
    // left side
    if (innerEdgeLeft > outerEdgeLeft) {
      let order = (this.currentPage - this.options.innerPagesCount - 1);
      let node = this.generateNode("",  label, classNames);
      let page = this.generatePage(order, label, classNames, node);
      this.pages.push(page);
    }
    // right side
    if (outerEdgeRight > innerEdgeRight) {
      let order = (this.currentPage + this.options.innerPagesCount);
      let node = this.generateNode("",  label, classNames);
      let page = this.generatePage(order, label, classNames, node);
      this.pages.push(page);
    }
  }

  buildAllPages() {
    let outerEdgeLeft  = this.firstPage + this.options.outerPagesCount;
    let outerEdgeRight = this.lastPage  - this.options.outerPagesCount;
    let innerEdgeLeft  = this.currentPage - this.options.innerPagesCount;
    let innerEdgeRight = this.currentPage + this.options.innerPagesCount;
    for (let i = 1; i <= this.totalPages; i++) {
      if (
        ( i <  outerEdgeLeft || i >  outerEdgeRight ) ||
        ( i >= innerEdgeLeft && i <= innerEdgeRight )
      ) {
        // Determine page class and name
        let classNames = [];
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
        let node = this.generateNode(i, textName, classNames);
        let page = this.generatePage(i, textName, classNames, node);
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
    // Find the pagination elements we want to fill in
    let containers = document.querySelectorAll(containerSelector);

    // Create DOM list
    let list = document.createElement("ul");
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
    for (let container of containers) {
      // clear the container for fresh render
      container.innerHTML = "";
      // copy the created nodes
      let listCopy = list.cloneNode(true);
      container.appendChild(listCopy);
      // add event listeners
      let links = container.querySelectorAll("a"); // NB returns a static NodeList, not live/dynamic NodeList, but it"s more flexible to work with
      for (let link of links) {
        if (self.callback) {
          link.addEventListener("click", function() {
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
      }
    }
  }

  update(containerSelector) {
    // Find the pagination elements we want to fill in
    let containers = document.querySelectorAll(containerSelector);
    // Drop current contents
    for (let container of containers) {
      container.innerHTML = "";
    }
    // re-render
    this.render(containerSelector);
  }

}
