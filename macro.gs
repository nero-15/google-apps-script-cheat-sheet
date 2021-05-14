/** @OnlyCurrentDoc */

function Header() {
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getActiveSheet();
  sheet.getRange(spreadsheet.getCurrentCell().getRow(), 1, 1, 10).activate(); /* sheet.getMaxColumns() replaced with 10.*/
  spreadsheet.getActiveRangeList().setBackground('#4c1130')
  .setFontColor('#ffffff')
  .setFontWeight('bold');
  spreadsheet.getActiveSheet().setFrozenRows(1);
};
