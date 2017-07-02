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
  return args;
}

var options = {
  callback: yourCallback,
  total_items: 100,
  items_per_page: 10,
  current_page: 1,
  features: {
    auto_hide: true,
    hide_disabled: true
  }
};
var paginator = new Paginator(options);
paginator.render('#pagination');
console.log(paginator.getItemsRange());
```
## Options
| Name                  | Type       | State         | Description                                                |
|-----------------------|------------|---------------|------------------------------------------------------------|
| `total_items`         | `Integer`  | **Required**  | The total number of items.                                 |
| `current_page`        | `Integer`  | **Required**  |  The current page. Default: `1`                            |
| `callback`            | `Function` | **Important** |  Return call with parameters.                              |
| `items_per_page`      | `Integer`  | Optional      | Adjust the number of items shown per page. Default: `10`   |
| `previous_page_label` | `String`   | Optional      | Label for the `previous` button. Default: `❮`              |
| `next_page_label`     | `String`   | Optional      | Label for the `next` button. Default: `❯`                  |
| `first_page_label`    | `String`   | Optional      | Label for the `first` button. Default: `1`                 |
| `last_page_label`     | `String`   | Optional      | Label for the `last` button. Defaults to total page count. |

## Installation

TODO Provide code examples and explanations of how to get the project.
