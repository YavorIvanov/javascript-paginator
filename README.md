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
  current_page: yourAppPreferences.currentPage
};
var paginator = new Paginator(options);
paginator.render('#pagination');
```
## Options
| Name                      | Type        | Description                                               |
| ---                       | ---         | ---                                                       |
| `total_items`             | `Number`    | **Required.** The total number of items.                  |
| `current_page`            | `Number`    | **Required.** The current page. Default: `1`              |
| `callback`                | `Function`  | **Important.** Return call with parameters.               |
| `items_per_page`          | `Number`    | Adjust the number of items shown per page. Default: `10`  |
| `previous_page_label`     | `String`    | Label for the `previous` button. Default: `❮`             |
| `next_page_label`         | `String`    | Label for the `next` button. Default: `❯`                 |
| `first_page_label`        | `String`    | Label for the `first` button. Default: `1`                |
| `last_page_label`         | `String`    | Label for the `last` button. Defaults to total page count.|

## Installation

TODO Provide code examples and explanations of how to get the project.
