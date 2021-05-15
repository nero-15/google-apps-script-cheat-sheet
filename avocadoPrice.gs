function renameSpreadsheet() {
  var mySS = SpreadsheetApp.getActiveSpreadsheet();
  mySS.rename("2017 Avocado Prices in Portland, Seattle");
}

function duplicateAndOrganizeActiveSheet() {
  var mySS = SpreadsheetApp.getActiveSpreadsheet();
  var duplicateSheet = mySS.duplicateActiveSheet();
}
