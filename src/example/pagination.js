function yourCallback(args = {}) {
  console.log(args);
  return args;
}

var options = {
  callback: yourCallback,
  total_items: 100,
  items_per_page: 10,
  current_page: 5,
  outer_window: 1,
  inner_window: 1,
  features: {
    auto_hide: true,
    hide_disabled: true,
  }
};
var paginator = new Paginator(options);
paginator.render('#pagination');
console.log(paginator.getItemsRange());
