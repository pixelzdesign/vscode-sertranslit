const toArray = context => Array.prototype.slice.call(context);

exports.toArray = toArray;

module.exports = {
  toArray,
};
