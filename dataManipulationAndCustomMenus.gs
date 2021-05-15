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

/**
 * Helper function to retrieve book data from the Open Library
 * public API.
 *
 * @param {number} ISBN - The ISBN number of the book to find.
 * @return {object} The book's data, in JSON format.
 */
function fetchBookData_(ISBN){
  // Connect to the public API.
  var url = "https://openlibrary.org/api/books?bibkeys=ISBN:"
      + ISBN + "&jscmd=details&format=json";
  var response = UrlFetchApp.fetch(
      url, {'muteHttpExceptions': true});
  
  // Make request to API and get response before this point.
  var json = response.getContentText();
  var bookData = JSON.parse(json); 
  
  // Return only the data we're interested in.
  return bookData['ISBN:' + ISBN];
}

/**
 * Fills in missing title and author data using Open Library API
 * calls.
 */ 
function fillInTheBlanks(){
  // Constants that identify the index of the title, author,
  // and ISBN columns (in the 2D bookValues array below). 
  var TITLE_COLUMN = 0;
  var AUTHOR_COLUMN = 1;
  var ISBN_COLUMN = 2;

  // Get the existing book information in the active sheet. The data
  // is placed into a 2D array.
  var dataRange = SpreadsheetApp.getActiveSpreadsheet()
    .getDataRange();
  var bookValues = dataRange.getValues();

  // Examine each row of the data (excluding the header row).
  // If an ISBN is present, and a title or author is missing,
  // use the fetchBookData_(isbn) method to retrieve the
  // missing data from the Open Library API. Fill in the
  // missing titles or authors when they're found.
  for(var row = 1; row < bookValues.length; row++){   
    var isbn = bookValues[row][ISBN_COLUMN];
    var title = bookValues[row][TITLE_COLUMN];
    var author = bookValues[row][AUTHOR_COLUMN];
   
    if(isbn != "" && (title === "" || author === "") ){
      // Only call the API if you have an ISBN number and
      // either the title or author is missing.
      var bookData = fetchBookData_(isbn);

      // Sometimes the API doesn't return the information needed.
      // In those cases, don't attempt to update the row.
      if (!bookData || !bookData.details) {
        continue;
      }

      // The API might not return a title, so only fill it in
      // if the response has one and if the title is blank in
      // the sheet.
      if(title === "" && bookData.details.title){
        bookValues[row][TITLE_COLUMN] = bookData.details.title; 
      }

      // The API might not return an author name, so only fill it in
      // if the response has one and if the author is blank in
      // the sheet.
      if(author === "" && bookData.details.authors
          && bookData.details.authors[0].name){
        bookValues[row][AUTHOR_COLUMN] =
          bookData.details.authors[0].name; 
      }
    }
  }
  
  // Insert the updated book data values into the spreadsheet.
  dataRange.setValues(bookValues);
}
