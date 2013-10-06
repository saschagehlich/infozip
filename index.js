var exec = require('child_process').exec
  , Entry = require('./lib/entry');

function ZipInfo(file, options) {
  if (!file) throw new Error('No file given');
  this.file = file;

  this.options = options || {};

  if(!this.options.unzip) this.options.unzip = 'unzip';
  if(!this.options.zip) this.options.zip = 'zip';
}

/**
 * Reads the .zip file and returns information (e.g. entries) about it
 * @param  {Function} callback
 */
ZipInfo.prototype.read = function(callback) {
  exec(this.options.unzip + ' -v ' + this.file,
    function (err, stdout, stderr) {
      if (err) return callback(err);

      var lines = stdout.split('\n')
        , labelsLine = lines[1]
        , entries = lines.slice(3, -3)
        , labels = []
        , response = { entries: [], size: 0 };

      // Parse the labels
      labels = labelsLine.trim().replace(/\s{2,}/g, ' ').split(' ');

      // Iterate over entries, create objects for them
      for (var i in entries) {
        var fileLine = entries[i]
          , fileAttributes = fileLine.trim().replace(/\s{2,}/g, ' ').split(' ', labels.length)
          , tempEntry = {}, entry = {};

        // Map the labels to the attributes
        for (var i in labels) {
          var label = labels[i];
          tempEntry[label] = fileAttributes[i];
        }

        // Build an entry
        entry = new Entry({
          name: tempEntry['Name'],
          size: parseInt(tempEntry['Length']),
          crc:  tempEntry['CRC-32'],
          isDirectory: tempEntry['Name'].substr(-1) == '/'
        });

        // P-push it real good
        response.entries.push(entry);
      }

      callback(null, response);
    });
};

ZipInfo.prototype.extractTo = function(path, entries, callback) {
  var entryNames, command;

  // Entries are optional
  if (typeof entries === 'function') {
    callback = entries;
    entries = null;
  }

  // Get the entries' `name` properties
  if (entries) {
    entryNames = entries.map(function (entry) {
      return entry.name;
    });
  } else {
    entryNames = [];
  }

  // Extract
  command = this.options.unzip + ' -o ' + this.file + ' ' + entryNames.join(' ') + ' -d ' + path;
  exec(command,
    function (err, stdout, stderr) {
      if (err) return callback(err);

      callback();
    });
};

module.exports = ZipInfo;
