function test(args = {}) {
  console.log(args);
  return args;
}
var app_top = {
  totalItemsCount: 1000
};

var options_top = {
  callback: test,
  total_items: app_top.totalItemsCount,
  items_per_page: 10,
  current_page: 5,
  first_page_label: 'first',
  last_page_label: 'last'
};
var paginator_top = new Paginator(options_top);
paginator_top.render('#pagination-top');



var app_bottom = {
  totalItemsCount: 100
};

var options_bottom = {
  total_items: app_bottom.totalItemsCount,
  items_per_page: 10,
  current_page: 1
};
var paginator_bottom = new Paginator(options_bottom);
paginator_bottom.render('#pagination-bottom');
