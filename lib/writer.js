var var_length_buffer = require(__dirname+'/utils.js').var_length_buffer;

function MIDImalEvent(deltaTime) {
	this.deltaTime = deltaTime;
}

function MIDImalWriter(stream) {
	var _this = this;
	
	this.stream = stream;
	this.tracks = [];
	
	var writeHeader = function() {
		stream.write(new Buffer([0x4D, 0x54, 0x68, 0x64, 0x00, 0x00, 0x00, 0x06, 0x00, 0x01])); //'MThd' + Header length (6) + type (multitrack)
		var tracks = new Buffer(2);
		tracks.writeUInt16BE(_this.tracks.length);
		stream.write(tracks);
		stream.write(new Buffer([0xE7, 0x28])); //All time-deltas are in miliseconds
	};
	var writeTrack = function(track) {
		
	};
	
	this.track = function() {
		var track = {events: []};
		var lastEvent = null
		_this.tracks.push(track);
		
		var addEvent = function(event) {
			track.events.push(event);
			lastEvent = event;
		};
		return {
			note: function(note, duration, delta) {
				this.notes([{note: note, duration: duration, delta: delta}]);
			},
			notes: function(notes) {
				
			};
		};
	};
}

module.exports = MIDImalWriter;