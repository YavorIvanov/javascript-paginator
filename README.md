# JavaScript Paginator

Simple yet flexible pagination in JavaScript

Checkout javascript-paginator
[site](https://yavorivanov.github.io/javascript-paginator/)
or
[github repo](https://github.com/YavorIvanov/javascript-paginator/)
for more information.

## Code Example

Full usage with all settings
```javascript
function yourCallback(args = {}) {
  paginator.currentPage = args.page;
  paginator.update("#pagination");
  return args;
}

var options = {
  callback: yourCallback,
  totalItems: 100,
  itemsPerPage: 10,
  currentPage: 1,
  options: {
    outerPagesCount: 2,
    innerPagesCount: 2
  },
  labels: {
    currentPage:  "*",
    previousPage: "prev",
    nextPage:     "next",
    firstPage:    "first",
    lastPage:     "last",
    gapPage:      " "
  },
  features: {
    hideAuto: false,
    hideGaps: false,
    hideAdjacent: false,
    hideDisabled: false
  }
};
var paginator = new Paginator(options);
paginator.render('#pagination');
console.log(paginator.getItemsRange());
```

## Options

| Name                    | Type        | State         | Description                                                 |
|-------------------------|-------------|---------------|-------------------------------------------------------------|
|`totalItems`             | `Integer`   | **Required**  | The total number of items.                                  |
|`currentPage`            | `Integer`   | **Required**  | The current page. Default: `1`                              |
|`callback`               | `Function`  | **Required**  | Return call with parameters.                                |
|`itemsPerPage`           | `Integer`   | Optional      | Adjust the number of items shown per page. Default: `10`    |
|`options.outerPagesCount`| `Integer`   | Optional      | How many pages to show next to edges. Default: 1            |
|`options.innerPagesCount`| `Integer`   | Optional      | How many pages to show around the current page. Default: 1  |
|`labels.currentPage`     | `String`    | Optional      | Label for the `current` button. Default: `Integer`          |
|`labels.previousPage`    | `String`    | Optional      | Label for the `previous` button. Default: `❮`               |
|`labels.nextPage`        | `String`    | Optional      | Label for the `next` button. Default: `❯`                   |
|`labels.firstPage`       | `String`    | Optional      | Label for the `first` button. Default: `1`                  |
|`labels.lastPage`        | `String`    | Optional      | Label for the `last` button. Defaults to total page count.  |
|`labels.gapPage`         | `String`    | Optional      | Label for the `gap` spacing. Default: `...``                |
|`features.hideAuto`      | `Boolean`   | Optional      | Hide pagination if only one page is present.                |
|`features.hideGaps`      | `Boolean`   | Optional      | Hide the gaps between outer and inner pages.                |
|`features.hideAdjacent`  | `Boolean`   | Optional      | Hide next or previous page.                                 |
|`features.hideDisabled`  | `Boolean`   | Optional      | Hide pages that aren't clickable. (next and previous)       |

## Installation

TBD

## Ideology

- The pagination shouldn't really understand your data (objects)
- It should be able to generate viable pagination just with basic data
- It should be highly customizable and extendable with features
- It should work for SPA and non-SPA
- Code should be KISS compliant so that it is extendable by other people easily
- Should follow ECMA standards but provide backward compatibility
- Should try to `mildly force` developers into using better standards

## TODO

* Refactor. Split into multiple classes.
* Provide code examples and explanations of how to get the project.
* Provide many styles of pagination (CSS)
