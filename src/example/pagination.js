function yourCallback(args = {}) {
  console.log(args);
  return args;
}

var options = {
  callback: yourCallback,
  totalItems: 100,
  itemsPerPage: 10,
  currentPage: 5
};
var paginator1 = new Paginator(options);
paginator1.render('#pagination1');

options.labels.previousPage = 'previous';
options.labels.nextPage = 'next';
options.options.outerPagesCount = 0;
options.options.innerPagesCount = 0;

var paginator2 = new Paginator(options);
paginator2.render('#pagination2');

options.labels.previousPage = null;
options.labels.nextPage = null;
options.labels.firstPage = 'first';
options.labels.lastPage = 'last';
options.options.outerPagesCount = 2;
options.options.innerPagesCount = 2;
var paginator3 = new Paginator(options);
paginator3.render('#pagination3');

var options = {
  callback: yourCallback,
  totalItems: 100,
  itemsPerPage: 10,
  currentPage: 1,
  features: {
    autoHide: true,
    hideDisabled: true
  }
};
var paginator4 = new Paginator(options);
paginator4.render('#pagination4');
