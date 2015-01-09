(function ($) {

var CONTROLLER_KEY = 'tableslice-controller';

/* Controller constructor */

var Controller = function ($el, options) {
	this.$el = $el;
	this.config(options);
};

/* Controller static functions */

Controller.getElementController = function (el) {
	var controller = $(el).data(CONTROLLER_KEY);
	return controller || null;
};

Controller.setElementController = function (el, controller) {
	$(el).data(CONTROLLER_KEY, controller);
};

Controller.ensureElementController = function (el, options) {
	var $el = $(el);
	var controller = Controller.getElementController($el);
	if (!controller) {
		controller = new Controller($el, options);
		Controller.setElementController($el, controller);
	}
	return controller;
};

/* Controller methods */

var $Controller = Controller.prototype = {
	settings: null
};

$Controller.config = function (key, value) {
	var options;
	if (!this.settings) {
		this.settings = $.extend({}, $.fn.tableSlice.defaults);
	}
	if (typeof key === 'undefined') {
		return;
	}
	if (typeof key === 'string') {
		// get operation
		if (arguments.length < 2) {
			return this.settings[key];
		}
		// set operation
		else {
			this.settings[key] = value;
			return;
		}
	}
	else if ($.isPlainObject(key)) {
		options = key;
		$.extend(this.settings, options);
	}
	else {
		throw new Error('Unsupported configuration arguments');
	}
};

$Controller.tableSlice = function (table, start, end) {
	var rowSelector = this.config('rowSelector');
	var $table = $(table).clone();
	var $rows = $table.find(rowSelector);
	var controller = this;
	$rows.each(function () {
		controller.rowSlice(this, start, end);
	});
	return $table;
};

$Controller.rowSlice = function (row, start, end) {
	var cellSelector = this.config('cellSelector');
	var colspanAttr = this.config('colspanAttr');
	var $row = $(row);
	var $cells = $row.find(cellSelector);
	var indexBefore = 0;
	var controller = this;
	var $cell, colspan, indexAfter, diff;
	if (!end) {
		end = this.getRowTotal(row);
	}
	$cells.each(function () {
		$cell = $(this);
		colspan = controller.getCellColspan($cell);
		indexAfter = indexBefore + colspan;
		// split by slice start
		if (indexBefore < start && indexAfter > start) {
			diff = colspan - (start - indexBefore);
			$cell.attr(colspanAttr, diff);
		}
		// split by slice end
		else if (indexBefore < end && indexAfter > end) {
			diff = colspan - (end - indexAfter);
			$cell.attr(colspanAttr, diff);
		}
		// remove
		else if (indexBefore < start || indexAfter > end) {
			$cell.remove();
		}
		indexBefore = indexAfter;
	});
};

$Controller.getRowTotal = function (row) {
	var cellSelector = this.config('cellSelector');
	var $row = $(row);
	var $cells = $row.find(cellSelector);
	var total = 0;
	var controller = this;
	$cells.each(function () {
		total += controller.getCellColspan(this);
	});
	return total;
};

$Controller.getCellColspan = function (cell) {
	var colspanAttr = this.config('colspanAttr');
	var result = $(cell).attr(colspanAttr);
	result = Number(result) || 1;
	return result;
};

/* Expose jQuery plugin */

$.fn.tableSlice = function (start, end, options) {
	var $result, controller;
	var $table = this.first();
	if (typeof end !== 'number') {
		options = end;
		end = null;
	}
	controller = Controller.ensureElementController($table, options);
	$result = controller.tableSlice($table, start, end);
	return $result;
};

$.fn.tableSlice.Controller = Controller;

$.fn.tableSlice.defaults = {
	rowSelector: 'tr',
	cellSelector: 'th, td',
	colspanAttr: 'colspan'
};

})(jQuery);