/** @OnlyCurrentDoc */

function Header() {
  var spreadsheet = SpreadsheetApp.getActive();
  var sheet = spreadsheet.getActiveSheet();
  sheet.getRange(spreadsheet.getCurrentCell().getRow(), 1, 1, sheet.getMaxColumns()).activate();
  spreadsheet.getActiveRangeList().setBackground('#4c1130')
  .setFontColor('#ffffff')
  .setFontWeight('bold');
  spreadsheet.getActiveSheet().setFrozenRows(1);
};
