function yourCallback(args = {}) {
  console.log(args);
  return args;
}

var options = {
  callback: yourCallback,
  totalItems: 100,
  itemsPerPage: 10,
  currentPage: 5,
  options: {
    outerWindow: 1,
    innerWindow: 1,
  },
  features: {
    autoHide: true,
    hideDisabled: true,
  }
};
var paginator = new Paginator(options);
paginator.render('#pagination');
console.log(paginator.getItemsRange());
