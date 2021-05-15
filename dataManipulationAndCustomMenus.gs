/**
 * A special function that runs when the spreadsheet is first
 * opened or reloaded. onOpen() is used to add custom menu
 * items to the spreadsheet.
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Book-list')
    .addItem('Load Book-list', 'loadBookList')
    .addSeparator()
    .addItem(
      'Separate title/author at first comma', 'splitAtFirstComma')
    .addItem(
      'Separate title/author at last "by"', 'splitAtLastBy')
    .addSeparator()
    .addItem(
      'Fill in blank titles and author cells', 'fillInTheBlanks')
    .addToUi();
}

/** 
 * Creates a template book list based on the
 * provided 'codelab-book-list' sheet.
 */
function loadBookList(){
  // Gets the active sheet.
  var sheet = SpreadsheetApp.getActiveSheet();
  
  // Gets a different spreadsheet from Drive using
  // the spreadsheet's ID. 
  var bookSS = SpreadsheetApp.openById(
    "1c0GvbVUDeBmhTpq_A3vJh2xsebtLuwGwpBYqcOBqGvo" 
  );

  // Gets the sheet, data range, and values of the
  // spreadsheet stored in bookSS.
  var bookSheet = bookSS.getSheetByName("codelab-book-list");
  var bookRange = bookSheet.getDataRange();
  var bookListValues = bookRange.getValues();

  // Add those values to the active sheet in the current
  // spreadsheet. This overwrites any values already there.
  sheet.getRange(1, 1, bookRange.getHeight(), bookRange.getWidth()) 
    .setValues(bookListValues);
  
  // Rename the destination sheet and resize the data
  // columns for easier reading.
  sheet.setName("Book-list");
  sheet.autoResizeColumns(1, 3);
}
