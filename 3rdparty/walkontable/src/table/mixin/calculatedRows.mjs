import { defineGetter } from "../../../../../helpers/object.mjs";
var MIXIN_NAME = 'calculatedRows';
/**
 * Mixin for the subclasses of `Table` with implementations of
 * helper methods that are related to rows.
 * This mixin is meant to be applied in the subclasses of `Table`
 * that use virtual rendering in the vertical axis.
 *
 * @type {object}
 */

var calculatedRows = {
  /**
   * Get the source index of the first rendered row. If no rows are rendered, returns an error code: -1.
   *
   * @returns {number}
   */
  getFirstRenderedRow: function getFirstRenderedRow() {
    var startRow = this.wot.wtViewport.rowsRenderCalculator.startRow;

    if (startRow === null) {
      return -1;
    }

    return startRow;
  },

  /**
   * Get the source index of the first row fully visible in the viewport. If no rows are fully visible, returns an error code: -1.
   *
   * @returns {number}
   */
  getFirstVisibleRow: function getFirstVisibleRow() {
    var startRow = this.wot.wtViewport.rowsVisibleCalculator.startRow;

    if (startRow === null) {
      return -1;
    }

    return startRow;
  },

  /**
   * Get the source index of the last rendered row. If no rows are rendered, returns an error code: -1.
   *
   * @returns {number}
   */
  getLastRenderedRow: function getLastRenderedRow() {
    var endRow = this.wot.wtViewport.rowsRenderCalculator.endRow;

    if (endRow === null) {
      return -1;
    }

    return endRow;
  },

  /**
   * Get the source index of the last row fully visible in the viewport. If no rows are fully visible, returns an error code: -1.
   *
   * @returns {number}
   */
  getLastVisibleRow: function getLastVisibleRow() {
    var endRow = this.wot.wtViewport.rowsVisibleCalculator.endRow;

    if (endRow === null) {
      return -1;
    }

    return endRow;
  },

  /**
   * Get the number of rendered rows.
   *
   * @returns {number}
   */
  getRenderedRowsCount: function getRenderedRowsCount() {
    return this.wot.wtViewport.rowsRenderCalculator.count;
  },

  /**
   * Get the number of fully visible rows in the viewport.
   *
   * @returns {number}
   */
  getVisibleRowsCount: function getVisibleRowsCount() {
    return this.wot.wtViewport.rowsVisibleCalculator.count;
  }
};
defineGetter(calculatedRows, 'MIXIN_NAME', MIXIN_NAME, {
  writable: false,
  enumerable: false
});
export default calculatedRows;