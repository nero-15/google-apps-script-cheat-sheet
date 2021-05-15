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

/**
 * Reformats title and author columns by splitting the title column
 * at the first comma, if present.
 */
function splitAtFirstComma(){
  // Get the active (currently highlighted) range.
  var activeRange = SpreadsheetApp.getActiveRange();
  var titleAuthorRange = activeRange.offset(
    0, 0, activeRange.getHeight(), activeRange.getWidth() + 1);

  // Get the current values of the selected title column cells.
  // This is a 2D array.
  var titleAuthorValues = titleAuthorRange.getValues();

  // Update values where commas are found. Assumes the presence
  // of a comma indicates an "authors, title" pattern.
  for (var row = 0; row < titleAuthorValues.length; row++){
    var indexOfFirstComma =
        titleAuthorValues[row][0].indexOf(", ");

    if(indexOfFirstComma >= 0){
      // Found a comma, so split and update the values in
      // the values array.
      var titlesAndAuthors = titleAuthorValues[row][0];

      // Update the title value in the array.
      titleAuthorValues[row][0] =
        titlesAndAuthors.slice(indexOfFirstComma + 2);

      // Update the author value in the array.
      titleAuthorValues[row][1] =
        titlesAndAuthors.slice(0, indexOfFirstComma);
    }
  }

  // Put the updated values back into the spreadsheet.
  titleAuthorRange.setValues(titleAuthorValues);
}

/** 
 * Reformats title and author columns by splitting the title column
 * at the last instance of the string " by ", if present.
 */
function splitAtLastBy(){
  // Get the active (currently highlighted) range.
  var activeRange = SpreadsheetApp.getActiveRange();
  var titleAuthorRange = activeRange.offset(
    0, 0, activeRange.getHeight(), activeRange.getWidth() + 1);

  // Get the current values of the selected title column cells.
  // This is a 2D array.
  var titleAuthorValues = titleAuthorRange.getValues();

  // Update values where " by " substrings are found. Assumes
  // the presence of a " by " indicates a "title by authors"
  // pattern.
  for(var row = 0; row < titleAuthorValues.length; row++){
    var indexOfLastBy =
        titleAuthorValues[row][0].lastIndexOf(" by ");
    
    if(indexOfLastBy >= 0){
      // Found a " by ", so split and update the values in
      // the values array.
      var titlesAndAuthors = titleAuthorValues[row][0];
      
      // Update the title value in the array.
      titleAuthorValues[row][0] =
        titlesAndAuthors.slice(0, indexOfLastBy);
      
      // Update the author value in the array.
      titleAuthorValues[row][1] =
        titlesAndAuthors.slice(indexOfLastBy + 4);
    }
  }

  // Put the updated values back into the spreadsheet.
  titleAuthorRange.setValues(titleAuthorValues);
}
