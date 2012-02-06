exports.var_length_buffer = function(value) {
	var helper = value & 0x7F
	  , count = 1;
	
	while((value >>= 7) > 0) {
		helper <<= 8;
		helper |= (value & 0x7F) | 0x80;
		count++;
	}
	
	var buffer = new Buffer(count)
	  , offset = 0;
	
	while(offset < count) {
		buffer.writeUInt8(helper&0xff, offset++);
		helper >>= 8;
	}
	
	return buffer;
};

exports.note = function() {
	var props = {
		channel: 0,
		key: 0,
		velocity: 0
	}
	
	var result = {
		
		//Velocity shortcuts
		fast: function() {
			return this.velocity(127);
		},
		normal: function() {
			return this.velocity(63);
		},
		slow: function() {
			return this.velocity(0);
		}
	};
	
	var k;
	for(k in props) {
		result[k] = function(value) {
			if(arguments.length) {
				props[k] = value;
				return this;
			}
			return props[k];
		};
		result[k].valueOf = function() {
			return props[k];
		};
	}
	return result;
};