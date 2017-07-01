# JavaScript Paginator

Simple yet flexible pagination in JavaScript

Checkout javascript-paginator
[site](https://yavorivanov.github.io/javascript-paginator/)
or
[github repo](https://github.com/YavorIvanov/javascript-paginator/)
for more information.


## Code Example

```javascript
function yourCallback(args = {}) {
  console.log(args);
}
var yourAppPreferences = {
  totalItemsCount: 1000,
  currentPage: 5
};

var options = {
  callback: yourCallback,
  total_items: yourAppPreferences.totalItemsCount,
  current_page: 5
};
var paginator = new Paginator(options);
paginator.render('#pagination');
```

## Installation

TODO Provide code examples and explanations of how to get the project.
