/**
 * A special function that runs when the spreadsheet is opened
 * or reloaded, used to add a custom menu to the spreadsheet.
 */
function onOpen() {
  // Get the Ui object. 
  var ui = SpreadsheetApp.getUi();
  
  // Create a custom menu. 
  ui.createMenu('Present dataset')
    .addItem(
      'Chart "Dates and USD Exchange Rates dataset"',
      "createEmbeddedLineChart")
    .addItem("Export charts to Slides","exportChartsToSlides")
    .addToUi();
}
