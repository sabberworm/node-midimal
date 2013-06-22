# midimal

Minimal MIDI File Writing Library for Node

## Usage Example

```javascript
var midimal = require('midimal');
var midi = new midimal.MIDI({volume: 127});
var track = midi.track();
track.instrument(midimal.utils.instrument().Glockenspiel());
track.note(midimal.utils.note().from_frequency(440), 400, 200);
track.note(midimal.utils.note().from_name('c', 2, '♯'), 500, 20);
track.instrument(midimal.utils.instrument().from_name('Bass'));
track.note(midimal.utils.note().from_name('d', 2, '♭'), 500, 200);
midi.write(process.stdout);
```

Also see the [source](https://github.com/sabberworm/node-iff-parser/blob/6b3a8a5eae72edcec1121b6bb71c747036a02342/lib/utils.js#L99) for the smus-to-midi converter.

## License

midimal is freely distributable under the terms of an MIT-style license.

Copyright (c) 2011 Raphael Schweikert, http://ra-phi.ch/

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.