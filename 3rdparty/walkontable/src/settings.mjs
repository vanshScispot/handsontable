function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { fastInnerText } from "./../../../helpers/dom/element.mjs";
import { objectEach } from "./../../../helpers/object.mjs";
/**
 * @class Settings
 */

var Settings = /*#__PURE__*/function () {
  /**
   * @param {Walkontable} wotInstance The Walkontable instance.
   * @param {object} settings The user defined settings.
   */
  function Settings(wotInstance, settings) {
    var _this = this;

    _classCallCheck(this, Settings);

    this.wot = wotInstance; // legacy support

    this.instance = wotInstance; // default settings. void 0 means it is required, null means it can be empty

    this.defaults = {
      table: void 0,
      // Determines whether the Walkontable instance is used as dataset viewer. When its instance is used as
      // a context menu, autocomplete list, etc, the returned value is `false`.
      isDataViewInstance: true,
      // presentation mode
      externalRowCalculator: false,
      stretchH: 'none',
      // values: all, last, none
      currentRowClassName: null,
      currentColumnClassName: null,
      preventOverflow: function preventOverflow() {
        return false;
      },
      preventWheel: false,
      // data source
      data: void 0,
      freezeOverlays: false,
      // Number of renderable columns for the left overlay.
      fixedColumnsLeft: 0,
      // Number of renderable rows for the top overlay.
      fixedRowsTop: 0,
      // Number of renderable rows for the bottom overlay.
      fixedRowsBottom: 0,
      // Enable the left overlay when conditions are met.
      shouldRenderLeftOverlay: function shouldRenderLeftOverlay() {
        return _this.getSetting('fixedColumnsLeft') > 0 || _this.getSetting('rowHeaders').length > 0;
      },
      // Enable the top overlay when conditions are met.
      shouldRenderTopOverlay: function shouldRenderTopOverlay() {
        return _this.getSetting('fixedRowsTop') > 0 || _this.getSetting('columnHeaders').length > 0;
      },
      // Enable the bottom overlay when conditions are met.
      shouldRenderBottomOverlay: function shouldRenderBottomOverlay() {
        return _this.getSetting('fixedRowsBottom') > 0;
      },
      minSpareRows: 0,
      // this must be array of functions: [function (row, TH) {}]
      rowHeaders: function rowHeaders() {
        return [];
      },
      // this must be array of functions: [function (column, TH) {}]
      columnHeaders: function columnHeaders() {
        return [];
      },
      totalRows: void 0,
      totalColumns: void 0,
      cellRenderer: function cellRenderer(row, column, TD) {
        var cellData = _this.getSetting('data', row, column);

        fastInnerText(TD, cellData === void 0 || cellData === null ? '' : cellData);
      },
      // columnWidth: 50,
      columnWidth: function columnWidth() {// return undefined means use default size for the rendered cell content
      },
      rowHeight: function rowHeight() {// return undefined means use default size for the rendered cell content
      },
      defaultRowHeight: 23,
      defaultColumnWidth: 50,
      selections: null,
      hideBorderOnMouseDownOver: false,
      viewportRowCalculatorOverride: null,
      viewportColumnCalculatorOverride: null,
      // callbacks
      onCellMouseDown: null,
      onCellContextMenu: null,
      onCellMouseOver: null,
      onCellMouseOut: null,
      onCellMouseUp: null,
      //    onCellMouseOut: null,
      onCellDblClick: null,
      onCellCornerMouseDown: null,
      onCellCornerDblClick: null,
      beforeDraw: null,
      onDraw: null,
      onBeforeRemoveCellClassNames: null,
      onAfterDrawSelection: null,
      onBeforeDrawBorders: null,
      onScrollVertically: null,
      onScrollHorizontally: null,
      onBeforeTouchScroll: null,
      onAfterMomentumScroll: null,
      onBeforeStretchingColumnWidth: function onBeforeStretchingColumnWidth(width) {
        return width;
      },
      onModifyRowHeaderWidth: null,
      onModifyGetCellCoords: null,
      onBeforeHighlightingRowHeader: function onBeforeHighlightingRowHeader(sourceRow) {
        return sourceRow;
      },
      onBeforeHighlightingColumnHeader: function onBeforeHighlightingColumnHeader(sourceCol) {
        return sourceCol;
      },
      onWindowResize: null,
      // constants
      scrollbarWidth: 10,
      scrollbarHeight: 10,
      renderAllRows: false,
      groups: false,
      rowHeaderWidth: null,
      columnHeaderHeight: null,
      headerClassName: null
    }; // reference to settings

    this.settings = {};
    objectEach(this.defaults, function (value, key) {
      if (settings[key] !== void 0) {
        _this.settings[key] = settings[key];
      } else if (value === void 0) {
        throw new Error("A required setting \"".concat(key, "\" was not provided"));
      } else {
        _this.settings[key] = value;
      }
    });
  }
  /**
   * Update settings.
   *
   * @param {object} settings The singular settings to update or if passed as object to merge with.
   * @param {*} value The value to set if the first argument is passed as string.
   * @returns {Walkontable}
   */


  _createClass(Settings, [{
    key: "update",
    value: function update(settings, value) {
      var _this2 = this;

      if (value === void 0) {
        // settings is object
        objectEach(settings, function (settingValue, key) {
          _this2.settings[key] = settingValue;
        });
      } else {
        // if value is defined then settings is the key
        this.settings[settings] = value;
      }

      return this.wot;
    }
    /**
     * Get setting by name.
     *
     * @param {string} key The settings key to retrieve.
     * @param {*} [param1] Additional parameter passed to the options defined as function.
     * @param {*} [param2] Additional parameter passed to the options defined as function.
     * @param {*} [param3] Additional parameter passed to the options defined as function.
     * @param {*} [param4] Additional parameter passed to the options defined as function.
     * @returns {*}
     */

  }, {
    key: "getSetting",
    value: function getSetting(key, param1, param2, param3, param4) {
      if (typeof this.settings[key] === 'function') {
        // this is faster than .apply - https://github.com/handsontable/handsontable/wiki/JavaScript-&-DOM-performance-tips
        return this.settings[key](param1, param2, param3, param4);
      } else if (param1 !== void 0 && Array.isArray(this.settings[key])) {
        // perhaps this can be removed, it is only used in tests
        return this.settings[key][param1];
      }

      return this.settings[key];
    }
    /**
     * Checks if setting exists.
     *
     * @param {boolean} key The settings key to check.
     * @returns {boolean}
     */

  }, {
    key: "has",
    value: function has(key) {
      return !!this.settings[key];
    }
  }]);

  return Settings;
}();

export default Settings;