window['Slide'] = (function() {
	var Event = (function() {
		var init = function(type, src) {
			this.type = type;
			this.src = src;
			this.queue = [];
		};
		init.prototype = {
			add: function(fn) {
				this.queue.push(fn);
			},
			fire: function() {
				var i;

				for (i in this.queue) {
					this.queue[i]();
				}
			}
		};

		return init;
	})(),
	Slide = (function() {
		var image, list = [],
		activeSrc = null,
		preload = function(src){
			var image = document.createElement('img');
			image.addEventListener('load', function(){
				image.parentNode.removeChild(image);
			}, false);
			image.src = src;
			document.body.appendChild(image);
		},
		fire = function(src, type) {
			var i;
			for (i in list) {
				if (list[i].src == src && list[i].type == type) {
					list[i].fire();
				}
			}
		},
		init = function(src) {
			if (!image) {
				image = document.createElement('img');
				activeSrc = image.src = src;
				document.body.appendChild(image);

				image.addEventListener('click', function() {
					fire(activeSrc, 'click');
				}, false);
			}else{
			//	var pre = document.createElement('img');
			//	pre.src = src;
			}
			this.src = src;
		};

		init.resetAll = function() {
			if (image) {
				image.parentNode.removeChild(image);
			}
			image = null;
			activeSrc = null;
			list = [];
		}

		init.prototype = {
			src: null,
			activeEvent: null,
			click: function() {
				list.push(this.activeEvent = new Event('click', this.src));

				return this;
			},
			add: function(fn) {
				if (this.activeEvent) {
					this.activeEvent.add(fn);
				} else {
					fn();
				}
			},
			open: function(src) {
				this.add(function() {
					activeSrc = image.src = src;
				});

				//Open will always be the last action in an event chain
				this.activeEvent = null;
				
				return this;
			},
			pause: function(duration) {
				var duration = (duration) ? duration * 1000 : 500;

				this.add(function() {
					var start = new Date(),
						now;

					do {
						now = new Date();
					}
					while (now - start < duration);
				});

				return this;
			}
		};

		return init;
	})();

	return Slide;
})();