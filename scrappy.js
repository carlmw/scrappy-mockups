/*!
 * Scrappy UI
 * http://sweetnr.com/scrappy
 *
 * Copyright 2010, Carl Whittaker
 * Distributed under the MIT license.
 * http://sweetnr.com/scrappy/license
 */
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
			image.style.display = 'none';
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
				image.id = 'slide';
				activeSrc = image.src = src;
				document.body.appendChild(image);

				image.addEventListener('click', function() {
					fire(activeSrc, 'click');
				}, false);
			}else{
				//Preload our image to avoid white screening
				preload(src);
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
				preload(src);
				this.add(function() {
					activeSrc = image.src = src;
				});

				//Open will always be the last action in an event chain
				this.activeEvent = null;
				
				return this;
			},
			pause: function(duration) {
				var ms = (duration) ? duration * 1000 : 500;

				this.add(function() {
					var start = new Date(),
						now;

					do {
						now = new Date();
					}
					while (now - start < ms);
				});

				return this;
			}
		};

		return init;
	})();

	return Slide;
})();