
var options = {
  callback: yourCallback,
  totalItems: 100,
  itemsPerPage: 10,
  currentPage: 2,
  options: {
    outerPagesCount: 2,
    innerPagesCount: 2
  },
  labels: {
    currentPage:  "*",
    previousPage: "❮",
    nextPage:     "❯",
    firstPage:    "first",
    lastPage:     "last",
    gapPage:      "…"
  },
  features: {
    hideAuto: false,
    hideGaps: false,
    hideAdjacent: false,
    hideDisabled: true
  }
};
var paginator1 = new Paginator(options);
paginator1.render("#pagination1");

//options.labels.previousPage = "previous";
//options.labels.nextPage = "next";
//options.options.outerPagesCount = 0;
//options.options.innerPagesCount = 0;
//var paginator2 = new Paginator(options);
//paginator2.render(""#pagination2");

options.labels.previousPage = null;
options.labels.nextPage = null;
options.labels.firstPage = "first";
options.labels.lastPage = "last";
options.options.outerPagesCount = 2;
options.options.innerPagesCount = 2;
var paginator3 = new Paginator(options);
paginator3.render("#pagination3");

//var options = {
//  callback: yourCallback,
//  totalItems: 100,
//  itemsPerPage: 10,
//  currentPage: 1,
//  features: {
//    autoHide: true,
//    hideDisabled: true
//  }
//};
//var paginator4 = new Paginator(options);
//paginator4.render(""#pagination4");

function yourCallback(args = {}) {
  console.log(args);
  paginator1.currentPage = args.page;
  paginator1.update("#pagination1");
  //return args;
}
