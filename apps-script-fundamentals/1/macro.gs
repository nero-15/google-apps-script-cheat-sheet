/** @OnlyCurrentDoc */

function Header() {
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getActiveSheet();
  sheet.getRange(spreadsheet.getCurrentCell().getRow(), 1, 1, 10).activate(); /* sheet.getMaxColumns() replaced with 10.*/
  spreadsheet.getActiveRangeList().setBackground('#afeeee')/* #4c1130 replaced with #afeeee.*/
  .setFontColor('#191970')/* #ffffff replaced with #191970.*/
  .setFontWeight('bold');
  spreadsheet.getActiveSheet().setFrozenRows(1);
};
