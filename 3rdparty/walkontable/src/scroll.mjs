function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { innerHeight, innerWidth, getScrollLeft, getScrollTop, offset } from "./../../../helpers/dom/element.mjs";
/**
 * @class Scroll
 */

var Scroll = /*#__PURE__*/function () {
  /**
   * @param {Walkontable} wotInstance The Walkontable instance.
   */
  function Scroll(wotInstance) {
    _classCallCheck(this, Scroll);

    this.wot = wotInstance;
  }
  /**
   * Scrolls viewport to a cell.
   *
   * @param {CellCoords} coords The cell coordinates.
   * @param {boolean} [snapToTop] If `true`, viewport is scrolled to show the cell on the top of the table.
   * @param {boolean} [snapToRight] If `true`, viewport is scrolled to show the cell on the right of the table.
   * @param {boolean} [snapToBottom] If `true`, viewport is scrolled to show the cell on the bottom of the table.
   * @param {boolean} [snapToLeft] If `true`, viewport is scrolled to show the cell on the left of the table.
   * @returns {boolean}
   */


  _createClass(Scroll, [{
    key: "scrollViewport",
    value: function scrollViewport(coords, snapToTop, snapToRight, snapToBottom, snapToLeft) {
      if (coords.col < 0 || coords.row < 0) {
        return false;
      }

      var scrolledHorizontally = this.scrollViewportHorizontally(coords.col, snapToRight, snapToLeft);
      var scrolledVertically = this.scrollViewportVertically(coords.row, snapToTop, snapToBottom);
      return scrolledHorizontally || scrolledVertically;
    }
    /**
     * Scrolls viewport to a column.
     *
     * @param {number} column Visual column index.
     * @param {boolean} [snapToRight] If `true`, viewport is scrolled to show the cell on the right of the table.
     * @param {boolean} [snapToLeft] If `true`, viewport is scrolled to show the cell on the left of the table.
     * @returns {boolean}
     */

  }, {
    key: "scrollViewportHorizontally",
    value: function scrollViewportHorizontally(column, snapToRight, snapToLeft) {
      if (!this.wot.drawn) {
        return false;
      }

      var _this$_getVariables = this._getVariables(),
          fixedColumnsLeft = _this$_getVariables.fixedColumnsLeft,
          leftOverlay = _this$_getVariables.leftOverlay,
          totalColumns = _this$_getVariables.totalColumns;

      var result = false;

      if (column >= 0 && column <= Math.max(totalColumns - 1, 0)) {
        var firstVisibleColumn = this.getFirstVisibleColumn();
        var lastVisibleColumn = this.getLastVisibleColumn();

        if (column >= fixedColumnsLeft && firstVisibleColumn > -1 && (column < firstVisibleColumn || snapToLeft)) {
          result = leftOverlay.scrollTo(column);
        } else if (lastVisibleColumn === -1 || lastVisibleColumn > -1 && (column > lastVisibleColumn || snapToRight)) {
          result = leftOverlay.scrollTo(column, true);
        }
      }

      return result;
    }
    /**
     * Scrolls viewport to a row.
     *
     * @param {number} row Visual row index.
     * @param {boolean} [snapToTop] If `true`, viewport is scrolled to show the cell on the top of the table.
     * @param {boolean} [snapToBottom] If `true`, viewport is scrolled to show the cell on the bottom of the table.
     * @returns {boolean}
     */

  }, {
    key: "scrollViewportVertically",
    value: function scrollViewportVertically(row, snapToTop, snapToBottom) {
      if (!this.wot.drawn) {
        return false;
      }

      var _this$_getVariables2 = this._getVariables(),
          fixedRowsBottom = _this$_getVariables2.fixedRowsBottom,
          fixedRowsTop = _this$_getVariables2.fixedRowsTop,
          topOverlay = _this$_getVariables2.topOverlay,
          totalRows = _this$_getVariables2.totalRows;

      var result = false;

      if (row >= 0 && row <= Math.max(totalRows - 1, 0)) {
        var firstVisibleRow = this.getFirstVisibleRow();
        var lastVisibleRow = this.getLastVisibleRow();

        if (row >= fixedRowsTop && firstVisibleRow > -1 && (row < firstVisibleRow || snapToTop)) {
          result = topOverlay.scrollTo(row);
        } else if (lastVisibleRow === -1 || lastVisibleRow > -1 && (row > lastVisibleRow && row < totalRows - fixedRowsBottom || snapToBottom)) {
          result = topOverlay.scrollTo(row, true);
        }
      }

      return result;
    }
    /**
     * Get first visible row based on virtual dom and how table is visible in browser window viewport.
     *
     * @returns {number}
     */

  }, {
    key: "getFirstVisibleRow",
    value: function getFirstVisibleRow() {
      var _this$_getVariables3 = this._getVariables(),
          topOverlay = _this$_getVariables3.topOverlay,
          wtTable = _this$_getVariables3.wtTable,
          wtViewport = _this$_getVariables3.wtViewport,
          totalRows = _this$_getVariables3.totalRows,
          fixedRowsTop = _this$_getVariables3.fixedRowsTop;

      var rootWindow = this.wot.rootWindow;
      var firstVisibleRow = wtTable.getFirstVisibleRow();

      if (topOverlay.mainTableScrollableElement === rootWindow) {
        var rootElementOffset = offset(wtTable.wtRootElement);
        var totalTableHeight = innerHeight(wtTable.hider);
        var windowHeight = innerHeight(rootWindow);
        var windowScrollTop = getScrollTop(rootWindow, rootWindow); // Only calculate firstVisibleRow when table didn't filled (from up) whole viewport space

        if (rootElementOffset.top + totalTableHeight - windowHeight <= windowScrollTop) {
          var rowsHeight = wtViewport.getColumnHeaderHeight();
          rowsHeight += topOverlay.sumCellSizes(0, fixedRowsTop);

          for (var row = totalRows; row > 0; row--) {
            rowsHeight += topOverlay.sumCellSizes(row - 1, row);

            if (rootElementOffset.top + totalTableHeight - rowsHeight <= windowScrollTop) {
              // Return physical row + 1
              firstVisibleRow = row;
              break;
            }
          }
        }
      }

      return firstVisibleRow;
    }
    /**
     * Get last visible row based on virtual dom and how table is visible in browser window viewport.
     *
     * @returns {number}
     */

  }, {
    key: "getLastVisibleRow",
    value: function getLastVisibleRow() {
      var _this$_getVariables4 = this._getVariables(),
          topOverlay = _this$_getVariables4.topOverlay,
          wtTable = _this$_getVariables4.wtTable,
          wtViewport = _this$_getVariables4.wtViewport,
          totalRows = _this$_getVariables4.totalRows;

      var rootWindow = this.wot.rootWindow;
      var lastVisibleRow = wtTable.getLastVisibleRow();

      if (topOverlay.mainTableScrollableElement === rootWindow) {
        var rootElementOffset = offset(wtTable.wtRootElement);
        var windowScrollTop = getScrollTop(rootWindow, rootWindow); // Only calculate lastVisibleRow when table didn't filled (from bottom) whole viewport space

        if (rootElementOffset.top > windowScrollTop) {
          var windowHeight = innerHeight(rootWindow);
          var rowsHeight = wtViewport.getColumnHeaderHeight();

          for (var row = 1; row <= totalRows; row++) {
            rowsHeight += topOverlay.sumCellSizes(row - 1, row);

            if (rootElementOffset.top + rowsHeight - windowScrollTop >= windowHeight) {
              // Return physical row - 1 (-2 because rangeEach gives row index + 1 - sumCellSizes requirements)
              lastVisibleRow = row - 2;
              break;
            }
          }
        }
      }

      return lastVisibleRow;
    }
    /**
     * Get first visible column based on virtual dom and how table is visible in browser window viewport.
     *
     * @returns {number}
     */

  }, {
    key: "getFirstVisibleColumn",
    value: function getFirstVisibleColumn() {
      var _this$_getVariables5 = this._getVariables(),
          leftOverlay = _this$_getVariables5.leftOverlay,
          wtTable = _this$_getVariables5.wtTable,
          wtViewport = _this$_getVariables5.wtViewport,
          totalColumns = _this$_getVariables5.totalColumns;

      var rootWindow = this.wot.rootWindow;
      var firstVisibleColumn = wtTable.getFirstVisibleColumn();

      if (leftOverlay.mainTableScrollableElement === rootWindow) {
        var rootElementOffset = offset(wtTable.wtRootElement);
        var totalTableWidth = innerWidth(wtTable.hider);
        var windowWidth = innerWidth(rootWindow);
        var windowScrollLeft = getScrollLeft(rootWindow, rootWindow); // Only calculate firstVisibleColumn when table didn't filled (from left) whole viewport space

        if (rootElementOffset.left + totalTableWidth - windowWidth <= windowScrollLeft) {
          var columnsWidth = wtViewport.getRowHeaderWidth();

          for (var column = totalColumns; column > 0; column--) {
            columnsWidth += leftOverlay.sumCellSizes(column - 1, column);

            if (rootElementOffset.left + totalTableWidth - columnsWidth <= windowScrollLeft) {
              // Return physical column + 1
              firstVisibleColumn = column;
              break;
            }
          }
        }
      }

      return firstVisibleColumn;
    }
    /**
     * Get last visible column based on virtual dom and how table is visible in browser window viewport.
     *
     * @returns {number}
     */

  }, {
    key: "getLastVisibleColumn",
    value: function getLastVisibleColumn() {
      var _this$_getVariables6 = this._getVariables(),
          leftOverlay = _this$_getVariables6.leftOverlay,
          wtTable = _this$_getVariables6.wtTable,
          wtViewport = _this$_getVariables6.wtViewport,
          totalColumns = _this$_getVariables6.totalColumns;

      var rootWindow = this.wot.rootWindow;
      var lastVisibleColumn = wtTable.getLastVisibleColumn();

      if (leftOverlay.mainTableScrollableElement === rootWindow) {
        var rootElementOffset = offset(wtTable.wtRootElement);
        var windowScrollLeft = getScrollLeft(rootWindow, rootWindow); // Only calculate lastVisibleColumn when table didn't filled (from right) whole viewport space

        if (rootElementOffset.left > windowScrollLeft) {
          var windowWidth = innerWidth(rootWindow);
          var columnsWidth = wtViewport.getRowHeaderWidth();

          for (var column = 1; column <= totalColumns; column++) {
            columnsWidth += leftOverlay.sumCellSizes(column - 1, column);

            if (rootElementOffset.left + columnsWidth - windowScrollLeft >= windowWidth) {
              // Return physical column - 1 (-2 because rangeEach gives column index + 1 - sumCellSizes requirements)
              lastVisibleColumn = column - 2;
              break;
            }
          }
        }
      }

      return lastVisibleColumn;
    }
    /**
     * Returns collection of variables used to rows and columns visibility calculations.
     *
     * @returns {object}
     * @private
     */

  }, {
    key: "_getVariables",
    value: function _getVariables() {
      var wot = this.wot;
      var topOverlay = wot.wtOverlays.topOverlay;
      var leftOverlay = wot.wtOverlays.leftOverlay;
      var wtTable = wot.wtTable;
      var wtViewport = wot.wtViewport;
      var totalRows = wot.getSetting('totalRows');
      var totalColumns = wot.getSetting('totalColumns');
      var fixedRowsTop = wot.getSetting('fixedRowsTop');
      var fixedRowsBottom = wot.getSetting('fixedRowsBottom');
      var fixedColumnsLeft = wot.getSetting('fixedColumnsLeft');
      return {
        topOverlay: topOverlay,
        leftOverlay: leftOverlay,
        wtTable: wtTable,
        wtViewport: wtViewport,
        totalRows: totalRows,
        totalColumns: totalColumns,
        fixedRowsTop: fixedRowsTop,
        fixedRowsBottom: fixedRowsBottom,
        fixedColumnsLeft: fixedColumnsLeft
      };
    }
  }]);

  return Scroll;
}();

export default Scroll;