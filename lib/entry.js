function Entry(data) {
  var self = this;

  ['name', 'size', 'crc', 'isDirectory'].forEach(function (prop) {
    self[prop] = data[prop]
  });
}

module.exports = Entry;
