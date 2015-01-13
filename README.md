# jQuery table slice

Slice a table into smaller tables.

## Example

```js
var $firstColumn = $('.example').tableSlice(0, 1);
var $remainingColumns = $('.example').tableSlice(1);
```

## Usage

```js
$('table').tableSlice(start[, end[, options]]);
```

`$.fn.tableSlice()` returns a clone of the original table with only the columns within the slice.
Cells which span a slice boundary will be duplicated.

### Options

Default values are retrieved from `$.fn.tableSlice.defaults`.

* `rowSelector` (default: 'tr')
* `cellSelector` (default: 'th, td')
* `colspanAttr` (default 'colspan')

## License

[MIT license](LICENSE).