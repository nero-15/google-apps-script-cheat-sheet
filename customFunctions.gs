/**
 * Converts US dollars to Swiss francs.
 *
 * @param {number} dollars The total number of dollars.
 * @return {number} swissFrancs The converted total of Swiss francs.
 * @customfunction
 */
function USDTOCHF(dollars){
  var swissFrancs = dollars * .99; 
  return swissFrancs;
}
