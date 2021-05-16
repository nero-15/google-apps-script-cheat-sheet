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

/**
 * Create a Slides presentation and export
 * all the embedded charts in this spreadsheet
 * to it, one chart per slide.
 */
function exportChartsToSlides() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Fetch a list of all embedded charts in this
  // spreadsheet.
  var charts = [];
  var sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    charts = charts.concat(sheets[i].getCharts());
  }
  
  // If there aren't any charts, display a toast
  // message and return without doing anything
  // else.
  if (charts.length == 0) {
    ss.toast('No charts to export!');
    return;
  }
  
  // Create a Slides presentation, removing the default
  // title slide.
  var presentationTitle =
    ss.getName() + " Presentation";
  var slides = SlidesApp.create(presentationTitle);
  slides.getSlides()[0].remove();  
  
  // Add charts to the presentation, one chart per slide.
  var position = {left: 40, top: 30};
  var size = {height: 340, width: 430};
  for (var i = 0; i < charts.length; i++) {
    var newSlide = slides.appendSlide();
    newSlide.insertSheetsChart(
      charts[i],
      position.left,
      position.top,
      size.width,
      size.height);   
  }
  
  // Create and display a dialog telling the user where to
  // find the new presentation.
  var slidesUrl = slides.getUrl();
  var html = "<p>Find it in your home Drive folder:</p>"
      + "<p><a href=\"" + slidesUrl + "\" target=\"_blank\">"
      + presentationTitle + "</a></p>";
  
  SpreadsheetApp.getUi().showModalDialog(
    HtmlService.createHtmlOutput(html)
      .setHeight(120)
      .setWidth(350),
      "Created a presentation!"
  );
}
