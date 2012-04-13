var Levenshtein = require('levenshtein');

exports.var_length_buffer = function(value) {
	var helper = (value & 0x7F);
	var count = 1;
	
	while((value >>= 7) > 0) {
		helper <<= 8;
		helper |= (value & 0x7F) | 0x80;
		count++;
	}
	
	var buffer = new Buffer(count);
	var offset = 0;
	
	while(offset < count) {
		buffer.writeUInt8(helper&0xff, offset++);
		helper >>= 8;
	}
	
	return buffer;
};

var a4_freq = 440;
var a4_key = 69;
var notes = {c: -9, d: -7, e: -5, f: -4, g: -2, a: 0, b: 2};

exports.note = function() {
	var props = {
		channel: -1,
		key: 0,
		velocity: 63,
		force: false //Use the set value for „key“ even when using percussion instruments
	};
	
	var result = {
		//Key shortcuts
		from_frequency: function(hertz) {
			var half_steps_from_a4 = Math.round((12 * Math.log(hertz/a4_freq))/Math.log(2));
			return this.key(a4_key+half_steps_from_a4);
		},
		from_name: function(name, octave, suffix) {
			name = name.toLowerCase(), suffix = suffix.toLowerCase();
			if(name === 'h') {
				name = 'b';
			}
			var offset = notes[name];
			if(suffix) {
				if(suffix === '#' || suffix == 'is' || suffix == '♯') {
					offset++;
				} else {
					offset--;
				}
			}
			offset += (octave - 4) * 12;
			this.key(a4_key+offset);
			return this;
		},

		//Velocity shortcuts
		fast: function() {
			return this.velocity(127);
		},
		normal: function() {
			return this.velocity(63);
		},
		slow: function() {
			return this.velocity(0);
		},

		toVal: function() {
			return props;
		}
	};
	
	var k;
	for(k in props) {
		(function(k) {
			result[k] = function(value) {
				if(arguments.length) {
					props[k] = value;
					return this;
				}
				return props[k];
			};
		})(k);
	}
	return result;
};

var instruments = {
	"Acoustic Grand Piano": 1,
	"Bright Acoustic Piano": 2,
	"Electric Grand Piano": 3,
	"Honky-tonk Piano": 4,
	"Electric Piano 1": 5,
	"Electric Piano 2": 6,
	"Harpsichord": 7,
	"Clavi": 8,
	"Celesta": 9,
	"Glockenspiel": 10,
	"Music Box": 11,
	"Vibraphone": 12,
	"Marimba": 13,
	"Xylophone": 14,
	"Tubular Bells": 15,
	"Dulcimer": 16,
	"Drawbar Organ": 17,
	"Percussive Organ": 18,
	"Rock Organ": 19,
	"Church Organ": 20,
	"Reed Organ": 21,
	"Accordion": 22,
	"Harmonica": 23,
	"Tango Accordion": 24,
	"Guitar (nylon)": 25,
	"Acoustic Guitar (steel)": 26,
	"Electric Guitar (jazz)": 27,
	"Electric Guitar (clean)": 28,
	"Electric Guitar (muted)": 29,
	"Overdriven Guitar": 30,
	"Distortion Guitar": 31,
	"Guitar harmonics": 32,
	"Acoustic Bass": 33,
	"Electric Bass (finger)": 34,
	"Electric Bass (pick)": 35,
	"Fretless Bass": 36,
	"Slap Bass 1": 37,
	"Slap Bass 2": 38,
	"Synth Bass 1": 39,
	"Synth Bass 2": 40,
	"Violin": 41,
	"Viola": 42,
	"Cello": 43,
	"Contrabass": 44,
	"Tremolo Strings": 45,
	"Pizzicato Strings": 46,
	"Orchestral Harp": 47,
	"Timpani": 48,
	"String Ensemble 1": 49,
	"String Ensemble 2": 50,
	"SynthStrings 1": 51,
	"SynthStrings 2": 52,
	"Choir Aahs": 53,
	"Voice Oohs": 54,
	"Synth Voice": 55,
	"Orchestra Hit": 56,
	"Trumpet": 57,
	"Trombone": 58,
	"Tuba": 59,
	"Muted Trumpet": 60,
	"French Horn": 61,
	"Brass Section": 62,
	"SynthBrass 1": 63,
	"SynthBrass 2": 64,
	"Soprano Sax": 65,
	"Alto Sax": 66,
	"Tenor Sax": 67,
	"Baritone Sax": 68,
	"Oboe": 69,
	"English Horn": 70,
	"Bassoon": 71,
	"Clarinet": 72,
	"Piccolo": 73,
	"Flute": 74,
	"Recorder": 75,
	"Pan Flute": 76,
	"Blown Bottle": 77,
	"Shakuhachi": 78,
	"Whistle": 79,
	"Ocarina": 80,
	"Lead 1 (square)": 81,
	"Lead 2 (sawtooth)": 82,
	"Lead 3 (calliope)": 83,
	"Lead 4 (chiff)": 84,
	"Lead 5 (charang)": 85,
	"Lead 6 (voice)": 86,
	"Lead 7 (fifths)": 87,
	"Lead 8 (bass+lead)": 88,
	"Pad 1 (new age)": 89,
	"Pad 2 (warm)": 90,
	"Pad 3 (polysynth)": 91,
	"Pad 4 (choir)": 92,
	"Pad 5 (bowed)": 93,
	"Pad 6 (metallic)": 94,
	"Pad 7 (halo)": 95,
	"Pad 8 (sweep)": 96,
	"FX 1 (rain)": 97,
	"FX 2 (soundtrack)": 98,
	"FX 3 (crystal)": 99,
	"FX 4 (atmosphere)": 100,
	"FX 5 (brightness)": 101,
	"FX 6 (goblins)": 102,
	"FX 7 (echoes)": 103,
	"FX 8 (sci-fi)": 104,
	"Sitar": 105,
	"Banjo": 106,
	"Shamisen": 107,
	"Koto": 108,
	"Kalimba": 109,
	"Bag pipe": 110,
	"Fiddle": 111,
	"Shanai": 112,
	"Tinkle Bell": 113,
	"Agogo": 114,
	"Steel Drums": 115,
	"Woodblock": 116,
	"Taiko drum": 117,
	"Melodic Tom": 118,
	"Synth Drum": 119,
	"Reverse Cymbal": 120,
	"Guitar Fret Noise": 121,
	"Breath Noise": 122,
	"Seashore": 123,
	"Bird Tweet": 124,
	"Telephone Ring": 125,
	"Helicopter": 126,
	"Applause": 127,
	"Gunshot ": 128
};

var percussion = {
	"Bass Drum 2": 35,
	"Bass Drum 1": 36,
	"Side Stick/Rimshot": 37,
	"Snare Drum 1": 38,
	"Hand Clap": 39,
	"Snare Drum 2": 40,
	"Low Tom 2": 41,
	"Closed Hi-hat": 42,
	"Low Tom 1": 43,
	"Pedal Hi-hat": 44,
	"Mid Tom 2": 45,
	"Open Hi-hat": 46,
	"Mid Tom 1": 47,
	"High Tom 2": 48,
	"Crash Cymbal 1": 49,
	"High Tom 1": 50,
	"Ride Cymbal 1": 51,
	"Chinese Cymbal": 52,
	"Ride Bell": 53,
	"Tambourine": 54,
	"Splash Cymbal": 55,
	"Cowbell": 56,
	"Crash Cymbal 2": 57,
	"Vibra Slap": 58,
	"Ride Cymbal 2": 59,
	"High Bongo": 60,
	"Low Bongo": 61,
	"Mute High Conga": 62,
	"Open High Conga": 63,
	"Low Conga": 64,
	"High Timbale": 65,
	"Low Timbale": 66,
	"High Agogô": 67,
	"Low Agogô": 68,
	"Cabasa": 69,
	"Maracas": 70,
	"Short Whistle": 71,
	"Long Whistle": 72,
	"Short Güiro": 73,
	"Long Güiro": 74,
	"Claves": 75,
	"High Wood Block": 76,
	"Low Wood Block": 77,
	"Mute Cuíca": 78,
	"Open Cuíca": 79,
	"Mute Triangle": 80,
	"Open Triangle": 81
};

exports.instrument = function() {
	var props = {
		id: 0,
		channel: -1,
		isPercussion: false
	};
	
	var result = {
		from_name: function(name) {
			if(instruments[name]) {
				this.id(instruments[name]-1);
				this.isPercussion(false);
			} else if(percussion[name]) {
				this.id(percussion[name]);
				this.isPercussion(true);
			} else {
				var smallest = null;
				var k;
				for(k in instruments) {
					var dist = (new Levenshtein(name, k)).distance;
					if(smallest === null || smallest.dist > dist) {
						smallest = {dist: dist, instrument: k};
					}
				}
				for(k in percussion) {
					var dist = (new Levenshtein(name, k)).distance;
					if(smallest === null || smallest.dist > dist) {
						smallest = {dist: dist, percussion: k};
					}
				}
				if(smallest.instrument) {
					this.id(instruments[smallest.instrument]-1);
					this.isPercussion(false);
				} else {
					this.id(percussion[smallest.percussion]);
					this.isPercussion(true);
				}
			}
			return this;
		},

		toVal: function() {
			return props;
		}
	};
	
	var k;
	for(k in props) {
		(function(k) {
			result[k] = function(value) {
				if(arguments.length) {
					props[k] = value;
					return this;
				}
				return props[k];
			};
		})(k);
	}
	for(k in instruments) {
		(function(k) {
			result[k] = function() {
				this.id(instruments[k]);
				return this.isPercussion(false);
			};
		})(k);
	}
	for(k in percussion) {
		(function(k) {
			result[k] = function() {
				this.id(percussion[k]);
				return this.isPercussion(true);
			};
		})(k);
	}
	return result;
};