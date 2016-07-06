/**
 * Whether an item is empty, defined as falsy or empty string
 * @param {Thing} item   input item to test
 * @returns {Boolean} whether the item is empty
 */
module.exports = function(item) {
  return (
       item !== null
    && item !== undefined
    && item !== ""
  );
};
