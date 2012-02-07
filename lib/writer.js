var var_length_buffer = require(__dirname+'/utils.js').var_length_buffer;

function MIDImalEvent(deltaTime, type, data) {
	if(data.toVal) {
		data = data.toVal();
	}
	this.deltaTime = deltaTime;
	this.type = type;
	this.data = data;
}

MIDImalEvent.prototype.toBuffer = function() {
	var time = var_length_buffer(this.deltaTime);
	var rest = MIDImalEvent.buffers[this.type](this.data);
	var result = new Buffer(time.length+rest.length);
	time.copy(result);
	rest.copy(result, time.length);
	return result;
};

MIDImalEvent.buffers = {
	'on': function(data) {
		var result = new Buffer(3);
		result.writeUInt8(0x90|data.channel, 0);
		result.writeUInt8(data.key, 1);
		result.writeUInt8(data.velocity, 2);
		return result;
	},
	'off': function(data) {
		var result = new Buffer(3);
		result.writeUInt8(0x80|data.channel, 0);
		result.writeUInt8(data.key, 1);
		result.writeUInt8(data.velocity, 2);
		return result;
	},
	'instrument': function(data) {
		var result = new Buffer(2);
		result.writeUInt8(0xC0|data.channel, 0);
		result.writeUInt8(data.id, 1);
		return result;
	}
};

var beats_per_minute = 120;
var ticks_per_beat = 60000/beats_per_minute; //All time-deltas are in miliseconds

function MIDImalWriter(stream) {
	var _this = this;
	
	this.stream = stream;
	this.tracks = [];
	
	var writeHeader = function() {
		stream.write(new Buffer([0x4D, 0x54, 0x68, 0x64, 0x00, 0x00, 0x00, 0x06, 0x00, 0x01])); //'MThd' + Header length (6) + type (multitrack)
		var tracks = new Buffer(2);
		tracks.writeUInt16BE(_this.tracks.length, 0);
		stream.write(tracks);
		var timing = new Buffer(2);
		timing.writeUInt16BE(ticks_per_beat, 0);
		stream.write(timing);
	};
	var writeTrack = function(track) {
		var totalLength = 4;
		var buffers = [];
		track.forEach(function(event) {
			var buf = event.toBuffer();
			buffers.push(buf);
			totalLength += buf.length;
		});
		stream.write(new Buffer([0x4D, 0x54, 0x72, 0x6B]));
		var length = new Buffer(4);
		length.writeUInt32BE(totalLength, 0);
		stream.write(length);
		buffers.forEach(function(buf) {
			stream.write(buf);
		});
		stream.write(new Buffer([0x00, 0xFF, 0x2F, 0x00])); //End-of-track event
	};
	
	this.track = function() {
		var track = [];
		var percussionInstrument = null;
		var trackNumber = _this.tracks.length;
		_this.tracks.push(track);

		return {
			note: function(note, duration, delta) {
				this.notes([{note: note, duration: duration, delta: delta}]);
			},
			notes: function(notes) {
				var events = [];
				var absolutePosition = 0;
				notes.forEach(function(note_info) {
					if(note_info.note.toVal) {
						note_info.note = note_info.note.toVal();
					}
					if(percussionInstrument !== null) {
						if(!note_info.note.force) {
							note_info.note.key = percussionInstrument;
						}
						note_info.note.channel = 9;
					} else if(note_info.note.channel === -1) {
						note_info.note.channel = trackNumber%16;
					}
					absolutePosition += note_info.delta; //Absolutize deltas to make the events sortable
					var on = new MIDImalEvent(absolutePosition, 'on', note_info.note);
					var off = new MIDImalEvent(absolutePosition+note_info.duration, 'off', note_info.note);
					events.push(on, off);
				});
				notes.sort(function(evt1, evt2) {
					return evt1.deltaTime - evt2.deltaTime;
				});
				var previousDelta = 0;
				events.forEach(function(event) {
					event.deltaTime -= previousDelta;
					previousDelta += event.deltaTime; //Convert back to relative deltas
					track.push(event);
				});
			},
			instrument: function(instrument) {
				if(instrument.toVal) {
					instrument = instrument.toVal();
				}
				if(instrument.channel === -1) {
					instrument.channel = trackNumber%16;
				}
				if(instrument.isPercussion) {
					percussionInstrument = instrument.id;
				} else {
					percussionInstrument = null;
					track.push(new MIDImalEvent(0, 'instrument', instrument));
				}
			}
		};
	};
	this.write = function() {
		writeHeader();
		_this.tracks.forEach(function(track) {
			writeTrack(track);
		});
	};
}

module.exports = MIDImalWriter;