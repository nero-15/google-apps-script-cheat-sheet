/**
 * Converts US dollars to Swiss francs.
 *
 * @param {number} dollars The total number of dollars.
 * @return {string} swissFrancs The provided value in Swiss francs.
 * @customfunction
 */
function USDTOCHF(dollars){
  var swissFrancs = dollars * .99;
  return 'CHF' + swissFrancs;
}
