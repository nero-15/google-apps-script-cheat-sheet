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

/**
 * Creates and inserts an embedded
 * line chart into the active sheet.
 */
function createEmbeddedLineChart() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var chartDataRange = sheet.getRange(
    'Dates and USD Exchange Rates dataset!A2:F102');
  var hAxisOptions = {
    slantedText: true,
    slantedTextAngle: 60,
    gridlines: {
      count: 12
    }
  };
  
  var lineChartBuilder = sheet.newChart().asLineChart();
  var chart = lineChartBuilder
    .addRange(chartDataRange)
    .setPosition(5, 8, 0, 0)
    .setTitle('USD Exchange rates')
    .setNumHeaders(1)
    .setLegendPosition(Charts.Position.RIGHT)
    .setOption('hAxis', hAxisOptions)
    .setOption("useFirstColumnAsDomain", true)
    .build();
 
  sheet.insertChart(chart);  
}
