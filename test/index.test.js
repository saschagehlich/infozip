var ZipInfo = require('../')
  , path = require('path')
  , exec = require('child_process').exec
  , fs = require('fs')
  , utils = require('./utils.js');

describe('unzip#read', function () {
  it('should correctly list the compressed files of a .zip file', function (done) {
    var zip = new ZipInfo(path.resolve(__dirname, 'files/test.zip'));
    zip.read(function (err, data) {
      if (err) throw err;

      data.entries.length.should.equal(3);

      data.entries[0].name.should.equal('test/');
      data.entries[0].size.should.equal(0);
      data.entries[0].isDirectory.should.be.true;

      data.entries[1].name.should.equal('test/test.txt');
      data.entries[1].size.should.equal(17);
      data.entries[1].isDirectory.should.be.false;

      data.entries[2].name.should.equal('hello.txt');
      data.entries[2].size.should.equal(18);
      data.entries[2].isDirectory.should.be.false;

      done();
    });
  });
});

describe('unzip#extractTo', function () {
  beforeEach(function () {
    utils.clearDirectory(path.resolve(__dirname, 'extracted'));
  });

  describe('without a list of files', function () {
    it('should correctly extract all files to the given destination', function (done) {
      var zip = new ZipInfo(path.resolve(__dirname, 'files/test.zip'))
        , extractedPath = path.resolve(__dirname, 'extracted');

      zip.extractTo(extractedPath, null, null, function (err) {
        if (err) throw err;

        fs.existsSync(path.resolve(extractedPath, 'hello.txt')).should.be.true;
        fs.existsSync(path.resolve(extractedPath, 'test/test.txt')).should.be.true;

        done();
      });
    });
  });

  describe('with a list of files', function () {
    it('should correctly extract the given files to the given destination', function (done) {
      var zip = new ZipInfo(path.resolve(__dirname, 'files/test.zip'))
        , extractedPath = path.resolve(__dirname, 'extracted');

      zip.extractTo(extractedPath, ['hello.txt'], null, function (err) {
        if (err) throw err;

        fs.existsSync(path.resolve(extractedPath, 'hello.txt')).should.be.true;

        done();
      });
    });

    it('should not create directories if `junkPaths` option is set to true', function (done) {
      var zip = new ZipInfo(path.resolve(__dirname, 'files/test.zip'))
        , extractedPath = path.resolve(__dirname, 'extracted')
        , options = {
          junkPaths: true
        };

      zip.extractTo(extractedPath, ['test/test.txt'], options, function (err) {
        if (err) throw err;

        fs.existsSync(path.resolve(extractedPath, 'test.txt')).should.be.true;

        done();
      });
    });
  });
});
