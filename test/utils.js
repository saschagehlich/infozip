var fs = require('fs')
  , path = require('path');

var Utils = {
  clearDirectory: function (directory) {
    var files = fs.readdirSync(directory)
      , self  = this;

    files.forEach(function (file) {
      if (file.substr(0, 1) === '.') return;

      var filePath = path.resolve(directory, file)
        , stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        self.clearDirectory(filePath);
      } else {
        fs.unlinkSync(filePath);
      }
    });
  }
};

module.exports = Utils
