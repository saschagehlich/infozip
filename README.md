infozip
=======

A node.js wrapper for the Unix `unzip` and `zip` commands.

## Usage

```js
var InfoZip = require('infozip')
  , zip = new ZipInfo(__dirname + '/test.zip');

  zip.read(function (err, entries) {
    if (err) throw err;

    /**
     * `entries` contains an object that looks like this:
     *
     * - `size` - An integer with the total file size
     * - `files` - A list of ZipInfo.Entry objects
     */
  });

  var options = {
    junkPaths: false
  };
  zip.extractTo(__dirname + '/extracted', ['hello.txt'], options, function (err) {
    if (err) throw err;

    /**
     * The file 'hello.txt' has been extracted to `__dirname + '/extracted'`
     */
  });
```

### ZipInfo.Entry

Represents an entry (file or directory). It has the following properties:

* `name` - A string containing the filename (including path)
* `size` - An integer with the file size
* `crc` - A string containing the CRC code
* `isDirectory` - A boolean

## License

The MIT License (MIT)

Copyright (c) 2013 Sascha Gehlich and FILSH Media GmbH

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
