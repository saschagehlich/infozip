var spawn = require('child_process').spawn
  , exec  = require('child_process').exec
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

ZipInfo.prototype.extractTo = function(path, entries, options, callback) {
  var entryNames, command, proc, params
    , stderr = ''
    , self = this;

  if (!options) options = {};

  // Get the entries' `name` properties
  if (entries) {
    entryNames = entries.map(function (entry) {
      if (entry instanceof Entry) {
        return entry.name;
      } else if (typeof entry === 'string') {
        return entry;
      }
    });
  } else {
    entryNames = [];
  }

  // Extract
  params = []

  if (options.junkPaths) params.push('-j'); // -j  junk paths (do not make directories)
  if (options.freshenFiles) params.push('-f'); // -f  freshen existing files, create none
  if (options.noOverwrite) params.push('-n'); // -n  never overwrite existing files

  params = params.concat(['-o', this.file]);
  params = params.concat(entryNames);
  params = params.concat(['-d', path]);

  proc = spawn(this.options.unzip, params);
  proc.stderr.on('data', function (data) {
    stderr += data.toString();
  });
  proc.on('exit', function (exitCode) {
    if (exitCode !== 0) return callback(new Error('`' + self.options.unzip + '` exited with code ' + exitCode + ': ' + stderr));

    callback();
  });
};

module.exports = ZipInfo;
