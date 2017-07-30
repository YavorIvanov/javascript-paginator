document.addEventListener('DOMContentLoaded', function() {
  var options = {
    callback: yourCallback,
    totalItems: 1000,
    itemsPerPage: 10,
    currentPage: 50,
    options: {
      outerPagesCount: 2,
      innerPagesCount: 2
    },
    labels: {
      currentPage:  '*',
      previousPage: '❮',
      nextPage:     '❯',
      firstPage:    'first',
      lastPage:     'last',
      gapPage:      '…'
    },
    features: {
      hideAuto: false,
      hideGaps: false,
      hideAdjacent: false,
      hideDisabled: true
    }
  };

  var paginator = new Paginator(options);
  paginator.render('#pagination');

  function yourCallback(args = {}) {
    console.info(args);
    paginator.currentPage = args.page;
    paginator.update('#pagination');
    return args;
  }
});
