function yourCallback(args = {}) {
  console.log(args);
  return args;
}

var options = {
  callback: yourCallback,
  total_items: 100,
  items_per_page: 10,
  current_page: 1,
  auto_hide: true
};
var paginator = new Paginator(options);
paginator.render('#pagination');
console.log(paginator.getItemsRange());
