// google.maps.event.addDomListener(window, 'load', init);

var googleMap = (function() {

	var map;

	function init() {
		var mapOptions = {
			center: new google.maps.LatLng(59.299376, 26.530723),
			zoom: 4,
			zoomControl: true,
			zoomControlOptions: {
				style: google.maps.ZoomControlStyle.DEFAULT,
			},
			disableDoubleClickZoom: true,
			mapTypeControl: false,
			scaleControl: false,
			scrollwheel: false,
			panControl: false,
			streetViewControl: false,
			draggable: false,
			overviewMapControl: false,
			overviewMapControlOptions: {
				opened: false,
			},
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			styles: [{
				"featureType": "administrative",
				"elementType": "all",
				"stylers": [{
					"visibility": "simplified"
				}]
			}, {
				"featureType": "landscape",
				"elementType": "geometry",
				"stylers": [{
					"visibility": "simplified"
				}, {
					"color": "#fcfcfc"
				}]
			}, {
				"featureType": "poi",
				"elementType": "geometry",
				"stylers": [{
					"visibility": "simplified"
				}, {
					"color": "#fcfcfc"
				}]
			}, {
				"featureType": "road.highway",
				"elementType": "geometry",
				"stylers": [{
					"visibility": "simplified"
				}, {
					"color": "#dddddd"
				}]
			}, {
				"featureType": "road.arterial",
				"elementType": "geometry",
				"stylers": [{
					"visibility": "simplified"
				}, {
					"color": "#dddddd"
				}]
			}, {
				"featureType": "road.local",
				"elementType": "geometry",
				"stylers": [{
					"visibility": "simplified"
				}, {
					"color": "#eeeeee"
				}]
			}, {
				"featureType": "water",
				"elementType": "geometry",
				"stylers": [{
					"visibility": "simplified"
				}, {
					"color": "#00bfa5"
				}]
			}],
		}
		var mapElement = document.getElementById('map');
		var map = new google.maps.Map(mapElement, mapOptions);
		var locations = [
			['Oleg Korolko', 'undefined', 'undefined', '', 'undefined', 59.9342802, 30.335098600000038, 'https://mapbuildr.com/assets/img/markers/ellipse-red.png']
		];
		for (i = 0; i < locations.length; i++) {
			if (locations[i][1] == 'undefined') {
				description = '';
			} else {
				description = locations[i][1];
			}
			if (locations[i][2] == 'undefined') {
				telephone = '';
			} else {
				telephone = locations[i][2];
			}
			if (locations[i][3] == 'undefined') {
				email = '';
			} else {
				email = locations[i][3];
			}
			if (locations[i][4] == 'undefined') {
				web = '';
			} else {
				web = locations[i][4];
			}
			if (locations[i][7] == 'undefined') {
				markericon = '';
			} else {
				markericon = locations[i][7];
			}
			marker = new google.maps.Marker({
				icon: markericon,
				position: new google.maps.LatLng(locations[i][5], locations[i][6]),
				map: map,
				title: locations[i][0],
				desc: description,
				tel: telephone,
				email: email,
				web: web
			});
			link = '';
			bindInfoWindow(marker, map, locations[i][0], description, telephone, email, web, link);
		}

		function bindInfoWindow(marker, map, title, desc, telephone, email, web, link) {
			var infoWindowVisible = (function() {
				var currentlyVisible = false;
				return function(visible) {
					if (visible !== undefined) {
						currentlyVisible = visible;
					}
					return currentlyVisible;
				};
			}());
			iw = new google.maps.InfoWindow();
			google.maps.event.addListener(marker, 'click', function() {
				if (infoWindowVisible()) {
					iw.close();
					infoWindowVisible(false);
				} else {
					var html = "<div style='color:#000;background-color:#fff;padding:5px;width:150px;'></div>";
					iw = new google.maps.InfoWindow({
						content: html
					});
					iw.open(map, marker);
					infoWindowVisible(true);
				}
			});
			google.maps.event.addListener(iw, 'closeclick', function() {
				infoWindowVisible(false);
			});
		}
	}


	return {
		init: init
	}

	}())

var blogNav = (function() {

	var sidebar = $('.blog-menu-elem');
	var section = $('.blog-article');
	var blogMenu = $('.blog-menu')


	function init() {

		$(sidebar.eq(0)).addClass('active');

		$(window).scroll(function(e) {
			var scroll = $(window).scrollTop();

			section.each(function(index, elem) {
				var topEdge = $(elem).offset().top - scroll;
				var bottomEdge = topEdge + $(elem).height();
				// console.log(scroll +" :" +topEdge + ":" + bottomEdge);
				console.log(topEdge);
				if (topEdge < 100 && bottomEdge > 100) {
					$(sidebar).removeClass('active');
					$(sidebar.eq(index)).addClass('active');
				}
			})
		});

		$('.blog-menu-elem').on('click', function(e) {
			e.preventDefault();
			var id = $(this).data('id')
			var top = $(section.eq(id)).offset().top;
			$(window).scrollTop(top - 100);
			$('.blog-menu-elem').removeClass('active');
			$(sidebar.eq(id)).addClass('active');
		});

		$(window).scroll(function(e) {
			var scroll = $(window).scrollTop();
			var topEdge = $(section.eq(0)).offset().top - scroll;

			if (topEdge < 20) {
				$(blogMenu).addClass('fixed');
			} else {
				$(blogMenu).removeClass('fixed');
			};
		});
	};
	return {
		init: init
	}
})();

var blurPosition = (function() {

	function init() {

		$(window).resize(function() {

			var imgWidth = $('.testimonials__blur').width();
			var blur = $('.form-contact__bg');
			var blurSection = $('.testimonials__blur');

			var posLeft = blurSection.offset().left - blur.offset().left;
			var posTop = blurSection.offset().top - blur.offset().top;

			console.log(imgWidth, posLeft, posTop);

			blur.css({
				// 'background-size': '1200px',
				// 'background-size': 'auto ' + imgWidth,
				// 'background-position': '-300px -500px'
				// 'background-position': posLeft + 'px ' + posTop + 'px',
			});

		});
	};

	return {
		init: init
	}

}());

var preloader = (function() {

	var
	// массив для всех изображений на странице
		_imgs = [],

		// будет использоваться из других модулей, чтобы проверить, отрисованы ли все элементы
		// т.к. document.ready из-за прелоадера срабатывает раньше, когда отрисован прелоадер, а не вся страница
		contentReady = $.Deferred();

	// инициальзация модуля
	function init() {
		_countImages();
		_startPreloader();
	};

	function _countImages() {

		// проходим по всем элементам на странице
		$.each($('*'), function() {
			var $this = $(this),
				background = $this.css('background-image'),
				img = $this.is('img');

			// записываем в массив все пути к бэкграундам
			if (background != 'none') {

				// в chrome в урле есть кавычки, вырезаем с ними. url("...") -> ...
				// в safari в урле нет кавычек, вырезаем без них. url( ... ) -> ...
				var path = background.replace('url("', "").replace('")', "");
				var path = path.replace('url(', "").replace(')', "");

				_imgs.push(path);
			}
			// записываем в массив все пути к картинкам
			if (img) {
				var path = '' + $this.attr('src');
				if ((path) && ($this.css('display') !== 'none')) {
					_imgs.push(path);
				}
			}
		});
	};

	function _startPreloader() {

		$('body').addClass('overflow-hidden');
		// $('.wrapper').css('opacity', '0')

		// загружено 0 картинок
		var loaded = 0;

		// проходим по всем собранным картинкам
		for (var i = 0; i < _imgs.length; i++) {

			var image = $('<img>', {
				attr: {
					src: _imgs[i]
				}
			});

			// загружаем по подной
			$(image).load(function() {
				loaded++;
				var percentLoaded = _countPercent(loaded, _imgs.length);
				_setPercent(percentLoaded);
			});

		};
	}

	// пересчитывает в проценты, сколько картинок загружено
	// current - number, сколько картинок загружено
	// total - number, сколько их всего
	function _countPercent(current, total) {
		return Math.ceil(current / total * 100);
	}

	// записывает процент в div прелоадер
	// percent - number, какую цифру записать
	function _setPercent(percent) {

		$('.preloader_text').text(percent);

		//когда дошли до 100%, скрываем прелоадер и показываем содержимое страницы
		if (percent >= 100) {
			// $('.preloader_container').css('display', 'block');
			$('.preloader_container').delay(600).fadeOut(400);
			$('body').removeClass('overflow-hidden');
			// $('.wrapper').delay(1000).css('opacity', '1')
			_finishPreloader();
		}
	};

	function _finishPreloader() {
		contentReady.resolve();
	};

	return {
		init: init,
		contentReady: contentReady
	};

})();

var parallax = (function() {

	function init() {

		$(document).ready(function() {

			var layer = $('.parallax').find('.parallax__layer'); // Выбираем все parallax__layer в объект

			layer.map(function(key, value) { // Проходимся по всем элементам объекта
				var bottomPosition = ((window.innerHeight / 2) * (key / 100)); // Вычисляем на сколько нам надо опустить вниз наш слой что бы при перемещении по Y не видно было краев
				$(value).css({ // Выбираем элемент и добавляем css
					'bottom': '-' + bottomPosition + 'px', // Выставляем bottom
					'transform': 'translate3d(0px, 0px, 0)', // Подготавливаем browser к трансформации
				});
			});

			$(window).on('mousemove', function(e) { // Навешиваем событие перемещени мыши на window, первым аргументом в функцию-обработчик события отправляется ссылка на объект события
				var mouse_dx = (e.pageX); // Узнаем положение мышки по X
				var mouse_dy = (e.pageY); // Узнаем положение мышки по Y
				// Т.к. мы делим экран на четыре части что бы в центре оказалась точка координат 0, то нам надо знать когда у нас будет -Х и +Х, -Y и +Y
				var w = (window.innerWidth / 2) - mouse_dx; // Вычисляем для x перемещения
				var h = (window.innerHeight / 2) - mouse_dy; // Вычисляем для y перемещения

				layer.map(function(key, value) { // Проходимся по всем элементам объекта
					var bottomPosition = ((window.innerHeight / 2) * (key / 100)); // Вычисляем на сколько нам надо опустить вниз наш слой что бы при перемещении по Y не видно было краев
					var widthPosition = w * (key / 100); // Вычисляем коофицент смешения по X
					var heightPosition = h * (key / 100); // Вычисляем коофицент смешения по Y
					$(value).css({ // Выбираем элемент и добавляем css
						'bottom': '-' + bottomPosition + 'px', // Выставляем bottom
						'transform': 'translate3d(' + widthPosition + 'px, ' + heightPosition + 'px, 0)', // Используем translate3d для более лучшего рендеринга на странице
					});
				});
			});
		})
	};

	return {
		init: init
	}

}());

var flipper = (function() {

	function init() {
		setUpEventListeners();
	}

	function setUpEventListeners() {
		var auth = document.getElementsByClassName('authorize');
		var authElem = auth[0];
		var flip = document.getElementsByClassName('flip');
		var flipElem = flip[0];
		if (authElem != undefined) {
			authElem.addEventListener('click', function(e) {
				flipElem.classList.toggle('flipping');
			});
		}
	}

	return {
		init: init
	}
}());

var scroll = (function() {

	function init() {
		$(document).ready(function() {

			var layer = $('.parallax-scroll__layer'); // Выбираем все parallax__layer в объект

			$(window).on('scroll', function(e) {
				var scrollTop = $(window).scrollTop();
				layer.map(function(key, value) {
					bottomPosition = scrollTop * key / 100;
					heightPosition = -scrollTop * key / 100;

					$(value).css({
						'top': '-' + bottomPosition + 'px',
						'transform': 'translate3d(0,' + heightPosition + 'px, 0)', // Используем translate3d для более лучшего рендеринга на странице
					})
				})
			})

		});


	}

	return {
		init: init
	}

}());

var slider = (function() {

	function init() {

		var main = $('.works__right_top_img');
		var prev = $('.works__right_bottom_left_img');
		var next = $('.works__right_bottom_right_img');
		var mainSlide = $('.works__right_top');
		var prevSlide = $('.works__right_bottom_left');
		var nextSlide = $('.works__right_bottom_right');
		var lastNum = main.length - 1;

		if (main.length != prev.length || main.length != next.length) {
			console.error('Different number of pictures in blocks');
		}

		main.css({
			'top': '0',
			'opacity': '0'
		});
		main.eq(0).css({
			'top': '0',
			'opacity': '1'
		});
		prev.eq(lastNum).css({
			'top': '0'
		});
		next.eq(1).css({
			'top': '0'
		});

		var cssSetup = {
			next: {
				prev: {
					'z-index': '0',
					'top': '100%',
					'transition-property': 'top',
					'transition-duration': '.09s'
				},
				curr: {
					'top': '-100%',
					'transition-property': 'top',
					'transition-duration': '.25s'
				},
				next: {
					'top': '0',
					'z-index': '10',
					'transition-property': 'top',
					'transition-duration': '.25s'
				}
			},
			prev: {
				prev: {
					'z-index': '0',
					'top': '-100%',
					'transition-property': 'top',
					'transition-duration': '.09s'
				},
				curr: {
					'top': '100%',
					'transition-property': 'top',
					'transition-duration': '.25s'
				},
				next: {
					'top': '0',
					'z-index': '10',
					'transition-property': 'top',
					'transition-duration': '.25s'
				}
			},
			main: {
				prev: {
					'opacity': '0',
					'transition-property': 'opacity',
					'transition-duration': '.2s'
				},
				curr: {
					'opacity': '1',
					'transition-property': 'opacity',
					'transition-duration': '.2s'
				}
			}
		};

		var ctrl = (function() {
			nextSlide.click(function(e) {
				e.preventDefault();
				nextSlide.renderNext();
				prevSlide.renderNext();
				mainSLideB.renderNext();
			});
			prevSlide.click(function(e) {
				e.preventDefault();
				nextSlide.renderPrev();
				prevSlide.renderPrev();
				mainSLideB.renderPrev()
			});
			mainSlide.click(function(e) {
				e.preventDefault();
			})
		})();

		function Slide(slide, cssSetup, slideNum) {
			var that = this;
			this.test = 0;
			this.slide = slide;
			this.cssSetup = cssSetup;
			this.slideNum = slideNum;

			this.renderNext = function() {
				this.slideNum += 1;
				if (this.slideNum === 4) {
					this.slideNum = 0;
				}
				this.slide.eq(this.slideNum).css(this.cssSetup.prev);
				this.slide.eq(this.slideNum).one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
					function() {
						that.slide.eq(that.slideNum - 1).css(that.cssSetup.curr);
						that.slide.eq(that.slideNum).css(that.cssSetup.next);
					});
			};

			this.renderPrev = function() {
				this.slideNum -= 1;
				if (this.slideNum === -1) this.slideNum = 3;
				this.slide.eq(this.slideNum).css(cssSetup.prev);
				this.slide.eq(this.slideNum).one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
					function() {
						if (that.slideNum === 3) {
							that.test = -1;
						} else {
							that.test = that.slideNum;
						}
						that.slide.eq(that.test + 1).css(that.cssSetup.curr);
						that.slide.eq(that.slideNum).css(that.cssSetup.next);
					});
			};
		}

		function MainSlideBlock(slide, cssSetup, slideNum, lastNum) {
			var that = this;
			this.lastNum = lastNum;
			this.slide = slide;
			this.cssSetup = cssSetup;
			this.slideNum = slideNum;
			this.num = 0;

			this.renderNext = function() {
				this.slideNum += 1;
				if (this.slideNum === this.lastNum + 1) this.slideNum = 0;

				this.slide.eq(this.slideNum - 1).css(this.cssSetup.prev);

				this.slide.eq(this.slideNum - 1).one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
					function() {
						that.slide.eq(that.slideNum).css(that.cssSetup.curr)
					});
			};

			this.renderPrev = function() {
				this.slideNum -= 1;

				if (this.slideNum === -1) {
					this.num = 0;
				} else {
					this.num = this.slideNum + 1;
				}
				this.slide.eq(this.num).css(this.cssSetup.prev);
				this.slide.eq(this.num).one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
					function() {
						if (that.slideNum === -1) {
							that.slideNum = that.lastNum;
						}
						that.slide.eq(that.slideNum).css(that.cssSetup.curr);
					});
			};
		}

		var mainSLideB;
		mainSLideB = new MainSlideBlock(main, cssSetup.main, 0, lastNum);
		nextSlide = new Slide(next, cssSetup.next, 1);
		prevSlide = new Slide(prev, cssSetup.prev, lastNum)

	}

	return {
		init: init
	}
}())

var sliderText = (function() {
	var titlesContainer = $('.works__left_header');
	var titles = $('.works__left_header_inner');
	var descriptionContainer = $('.works__left_done-with')
	var description = $('.works__left_done-with_inner');
	var nextButton = $('.works__right_bottom_right');
	var prevButton = $('.works__right_bottom_left');
	var titlesArray = [];
	var descriptionArray = [];

	function _process(titles, array) {

		titles.each(function() {
			$this = $(this);
			var text = $this.text();
			$this.html('');
			array.push(_spanify(text));
		});

		$('.works__left_header_inner').remove();
		$('.works__left_done-with_inner').remove();
		$('.works__left_header').append('<div class="works__left_header_inner"></div>')
		$('.works__left_done-with').prepend('<div class="works__left_done-with_inner"></div>')
	}

	function _save(titles, array) {
		titles.each(function() {
			var text = $(this).html();
			array.push(text)
		})
	}

	function _spanify(text) {
		var array = [];
		var wordsArray = text.split(' ');
		var spannedText = '';

		wordsArray.forEach(function(word) {
			var lettersArray = word.split('');
			var spannedWord = '';

			lettersArray.forEach(function(letter) {
				spannedWord += '<span class="letter">' + letter + '</span>';
			});

			spannedText += '<span class="word">' + spannedWord + '</span>';

		});

		array.push(spannedText);
		return array
	}


	function _setEventListeners() {

		var qty = titles.length;
		var current = 0;

		nextButton.click(function(e) {
			e.preventDefault;
			current++;
			current <= (qty - 1) ? current : current = 0;
			_renderTitle(current, titlesArray, $('.works__left_header_inner'));
			_renderText(current, descriptionArray, $('.works__left_done-with_inner'));
		})

		prevButton.on('click', function(e) {
			e.preventDefault;
			current--;
			current < 0 ? current = qty - 1 : current;
			_renderTitle(current, titlesArray, $('.works__left_header_inner'));
			_renderText(current, descriptionArray, $('.works__left_done-with_inner'));
		})
	};

	function _renderTitle(num, array, location) {
		location.html(array[num])
		location.find('.letter').each(function(index) {
			$this = $(this);

			(function(elem) {
				setTimeout(function() {
					elem.addClass('activeLetter')
				}, 20 * index);
			})($this);

		})
	}

	function _renderText(num, array, location) {
		location.html(array[num])
	}

	function init() {
		_process(titles, titlesArray);
		_save(description, descriptionArray);
		_renderTitle(0, titlesArray, $('.works__left_header_inner'));
		_renderText(0, descriptionArray, $('.works__left_done-with_inner'));
		_setEventListeners();
	}

	return {
		init: init
	}

}());

var tab = (function() {

	var links = $('.tabs__control-link');
	var tabs = $('.tabs__list-item');
	var tabsLink = $('.tabs__control-item');

	function _setupEventListeners() {

		tabs.eq(0).addClass('activeTab');
		tabsLink.eq(0).addClass('activeTabLink');

		links.on('click', function() {
			var active = $(this).parent().data('class');
			tabs.removeClass('activeTab');
			tabsLink.removeClass('activeTabLink');
			tabs.eq(active).addClass('activeTab');
			tabsLink.eq(active).addClass('activeTabLink');
		})
	}

	function init() {
		_setupEventListeners();
	}

	return {
		init: init
	}
}())

var diagram = (function() {

	var elem = $('.skills__elems').eq(0);
	var diagramArray = $('.sector');
	var diagramValues;


	function _setEventListeners() {
		$(window).scroll(function(e) {
			var topEdge = $(elem).offset().top
			var scroll = $(window).scrollTop();
			var height = $(window).innerHeight();
			var animationStart = height + scroll - height / 5;
			if (animationStart > topEdge) {
				_animate();
			}
		})
	}


	function _animate() {
		var maxVal = 280;

		diagramArray.each(function() {
			$this = $(this);
			var dataId = $this.data('diagram');
			var elemValue = diagramValues[dataId];
			var dash = (elemValue / 100) * maxVal;

			$this.css({
				'stroke-dasharray': dash + ' ' + maxVal
			})

		})
	}


	function _getValues() {
		$.get('/getdiagram', function(data) {}).done(function(data) {
			diagramValues = data[0];
		});
	}

	function init() {
		_getValues();
		_setEventListeners();
	}

	return {
		init: init
	}
}());

var scrollArrow = (function() {

	function _setEventListeners() {
		$('.arrow-down-icon').on('click', function() {
			var height = $(window).innerHeight();
			$('html, body').animate({
				scrollTop: height
			}, 350);
		})
	}

	function init() {
		_setEventListeners();
	}

	return {
		init: init
	}

}());

var modal = (function() {

	var modal = $('.modal-container');
	var saveButton = $('.admin-button ');
	var modalButton = $('#modalOk');

	function _setupEventListeners() {
		saveButton.click(function(e) {
			e.preventDefault;
			modal.css({
				'display': 'block'
			})
		})

		modalButton.click(function(e) {
			modal.css({
				'display': 'none'
			})
		})
	}

	function init() {
		_setupEventListeners();
	}

	return {
		init: init
	}
}())

function navigation() {
	'use strict';
	$('#nav-icon').click(function() {
		$(this).toggleClass('open');
		$('#overlay').toggleClass('open');
	});
};

$(document).ready(function() {

	var path = window.location.pathname;

	preloader.init();
	navigation();

	if (path === '/' || path === '/index.html') {
		parallax.init();
		flipper.init();
	} else {
		scroll.init();
	}

	if (path === '/blog.html' || path === '/blog') {
		blogNav.init();
	}

	if (path === '/works.html' || path === '/works') {
		slider.init();
		sliderText.init();
		blurPosition.init();
	}

	if (path === '/aboutme.html' || path === '/aboutme') {
		googleMap.init();
		diagram.init();
	}

	if (path === '/admin.html' || path === '/admin') {
		tab.init();
	}

	if (path !== 'admin') {
		scrollArrow.init();
		modal.init();
	}

});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdvb2dsZU1hcC5qcyIsImJsb2dOYXYuanMiLCJibHVyUG9zaXRpb24uanMiLCJwcmVsb2FkZXIuanMiLCJwYXJhbGxheC5qcyIsImZsaXBwZXIuanMiLCJzY3JvbGwuanMiLCJzbGlkZXIuanMiLCJzbGlkZXJUZXh0LmpzIiwidGFiLmpzIiwiZGlhZ3JhbS5qcyIsInNjcm9sbEFycm93LmpzIiwibW9kYWwuanMiLCJhcHAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25LQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZ29vZ2xlLm1hcHMuZXZlbnQuYWRkRG9tTGlzdGVuZXIod2luZG93LCAnbG9hZCcsIGluaXQpO1xuXG52YXIgZ29vZ2xlTWFwID0gKGZ1bmN0aW9uKCkge1xuXG5cdHZhciBtYXA7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHR2YXIgbWFwT3B0aW9ucyA9IHtcblx0XHRcdGNlbnRlcjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZyg1OS4yOTkzNzYsIDI2LjUzMDcyMyksXG5cdFx0XHR6b29tOiA0LFxuXHRcdFx0em9vbUNvbnRyb2w6IHRydWUsXG5cdFx0XHR6b29tQ29udHJvbE9wdGlvbnM6IHtcblx0XHRcdFx0c3R5bGU6IGdvb2dsZS5tYXBzLlpvb21Db250cm9sU3R5bGUuREVGQVVMVCxcblx0XHRcdH0sXG5cdFx0XHRkaXNhYmxlRG91YmxlQ2xpY2tab29tOiB0cnVlLFxuXHRcdFx0bWFwVHlwZUNvbnRyb2w6IGZhbHNlLFxuXHRcdFx0c2NhbGVDb250cm9sOiBmYWxzZSxcblx0XHRcdHNjcm9sbHdoZWVsOiBmYWxzZSxcblx0XHRcdHBhbkNvbnRyb2w6IGZhbHNlLFxuXHRcdFx0c3RyZWV0Vmlld0NvbnRyb2w6IGZhbHNlLFxuXHRcdFx0ZHJhZ2dhYmxlOiBmYWxzZSxcblx0XHRcdG92ZXJ2aWV3TWFwQ29udHJvbDogZmFsc2UsXG5cdFx0XHRvdmVydmlld01hcENvbnRyb2xPcHRpb25zOiB7XG5cdFx0XHRcdG9wZW5lZDogZmFsc2UsXG5cdFx0XHR9LFxuXHRcdFx0bWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUCxcblx0XHRcdHN0eWxlczogW3tcblx0XHRcdFx0XCJmZWF0dXJlVHlwZVwiOiBcImFkbWluaXN0cmF0aXZlXCIsXG5cdFx0XHRcdFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcblx0XHRcdFx0XCJzdHlsZXJzXCI6IFt7XG5cdFx0XHRcdFx0XCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG5cdFx0XHRcdH1dXG5cdFx0XHR9LCB7XG5cdFx0XHRcdFwiZmVhdHVyZVR5cGVcIjogXCJsYW5kc2NhcGVcIixcblx0XHRcdFx0XCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG5cdFx0XHRcdFwic3R5bGVyc1wiOiBbe1xuXHRcdFx0XHRcdFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XCJjb2xvclwiOiBcIiNmY2ZjZmNcIlxuXHRcdFx0XHR9XVxuXHRcdFx0fSwge1xuXHRcdFx0XHRcImZlYXR1cmVUeXBlXCI6IFwicG9pXCIsXG5cdFx0XHRcdFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuXHRcdFx0XHRcInN0eWxlcnNcIjogW3tcblx0XHRcdFx0XHRcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFwiY29sb3JcIjogXCIjZmNmY2ZjXCJcblx0XHRcdFx0fV1cblx0XHRcdH0sIHtcblx0XHRcdFx0XCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuaGlnaHdheVwiLFxuXHRcdFx0XHRcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcblx0XHRcdFx0XCJzdHlsZXJzXCI6IFt7XG5cdFx0XHRcdFx0XCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcImNvbG9yXCI6IFwiI2RkZGRkZFwiXG5cdFx0XHRcdH1dXG5cdFx0XHR9LCB7XG5cdFx0XHRcdFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmFydGVyaWFsXCIsXG5cdFx0XHRcdFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuXHRcdFx0XHRcInN0eWxlcnNcIjogW3tcblx0XHRcdFx0XHRcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFwiY29sb3JcIjogXCIjZGRkZGRkXCJcblx0XHRcdFx0fV1cblx0XHRcdH0sIHtcblx0XHRcdFx0XCJmZWF0dXJlVHlwZVwiOiBcInJvYWQubG9jYWxcIixcblx0XHRcdFx0XCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG5cdFx0XHRcdFwic3R5bGVyc1wiOiBbe1xuXHRcdFx0XHRcdFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XCJjb2xvclwiOiBcIiNlZWVlZWVcIlxuXHRcdFx0XHR9XVxuXHRcdFx0fSwge1xuXHRcdFx0XHRcImZlYXR1cmVUeXBlXCI6IFwid2F0ZXJcIixcblx0XHRcdFx0XCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG5cdFx0XHRcdFwic3R5bGVyc1wiOiBbe1xuXHRcdFx0XHRcdFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XCJjb2xvclwiOiBcIiMwMGJmYTVcIlxuXHRcdFx0XHR9XVxuXHRcdFx0fV0sXG5cdFx0fVxuXHRcdHZhciBtYXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpO1xuXHRcdHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKG1hcEVsZW1lbnQsIG1hcE9wdGlvbnMpO1xuXHRcdHZhciBsb2NhdGlvbnMgPSBbXG5cdFx0XHRbJ09sZWcgS29yb2xrbycsICd1bmRlZmluZWQnLCAndW5kZWZpbmVkJywgJycsICd1bmRlZmluZWQnLCA1OS45MzQyODAyLCAzMC4zMzUwOTg2MDAwMDAwMzgsICdodHRwczovL21hcGJ1aWxkci5jb20vYXNzZXRzL2ltZy9tYXJrZXJzL2VsbGlwc2UtcmVkLnBuZyddXG5cdFx0XTtcblx0XHRmb3IgKGkgPSAwOyBpIDwgbG9jYXRpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAobG9jYXRpb25zW2ldWzFdID09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdGRlc2NyaXB0aW9uID0gJyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkZXNjcmlwdGlvbiA9IGxvY2F0aW9uc1tpXVsxXTtcblx0XHRcdH1cblx0XHRcdGlmIChsb2NhdGlvbnNbaV1bMl0gPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0dGVsZXBob25lID0gJyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0ZWxlcGhvbmUgPSBsb2NhdGlvbnNbaV1bMl07XG5cdFx0XHR9XG5cdFx0XHRpZiAobG9jYXRpb25zW2ldWzNdID09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdGVtYWlsID0gJyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRlbWFpbCA9IGxvY2F0aW9uc1tpXVszXTtcblx0XHRcdH1cblx0XHRcdGlmIChsb2NhdGlvbnNbaV1bNF0gPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0d2ViID0gJyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR3ZWIgPSBsb2NhdGlvbnNbaV1bNF07XG5cdFx0XHR9XG5cdFx0XHRpZiAobG9jYXRpb25zW2ldWzddID09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdG1hcmtlcmljb24gPSAnJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1hcmtlcmljb24gPSBsb2NhdGlvbnNbaV1bN107XG5cdFx0XHR9XG5cdFx0XHRtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcblx0XHRcdFx0aWNvbjogbWFya2VyaWNvbixcblx0XHRcdFx0cG9zaXRpb246IG5ldyBnb29nbGUubWFwcy5MYXRMbmcobG9jYXRpb25zW2ldWzVdLCBsb2NhdGlvbnNbaV1bNl0pLFxuXHRcdFx0XHRtYXA6IG1hcCxcblx0XHRcdFx0dGl0bGU6IGxvY2F0aW9uc1tpXVswXSxcblx0XHRcdFx0ZGVzYzogZGVzY3JpcHRpb24sXG5cdFx0XHRcdHRlbDogdGVsZXBob25lLFxuXHRcdFx0XHRlbWFpbDogZW1haWwsXG5cdFx0XHRcdHdlYjogd2ViXG5cdFx0XHR9KTtcblx0XHRcdGxpbmsgPSAnJztcblx0XHRcdGJpbmRJbmZvV2luZG93KG1hcmtlciwgbWFwLCBsb2NhdGlvbnNbaV1bMF0sIGRlc2NyaXB0aW9uLCB0ZWxlcGhvbmUsIGVtYWlsLCB3ZWIsIGxpbmspO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGJpbmRJbmZvV2luZG93KG1hcmtlciwgbWFwLCB0aXRsZSwgZGVzYywgdGVsZXBob25lLCBlbWFpbCwgd2ViLCBsaW5rKSB7XG5cdFx0XHR2YXIgaW5mb1dpbmRvd1Zpc2libGUgPSAoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBjdXJyZW50bHlWaXNpYmxlID0gZmFsc2U7XG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbih2aXNpYmxlKSB7XG5cdFx0XHRcdFx0aWYgKHZpc2libGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0Y3VycmVudGx5VmlzaWJsZSA9IHZpc2libGU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBjdXJyZW50bHlWaXNpYmxlO1xuXHRcdFx0XHR9O1xuXHRcdFx0fSgpKTtcblx0XHRcdGl3ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coKTtcblx0XHRcdGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmIChpbmZvV2luZG93VmlzaWJsZSgpKSB7XG5cdFx0XHRcdFx0aXcuY2xvc2UoKTtcblx0XHRcdFx0XHRpbmZvV2luZG93VmlzaWJsZShmYWxzZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFyIGh0bWwgPSBcIjxkaXYgc3R5bGU9J2NvbG9yOiMwMDA7YmFja2dyb3VuZC1jb2xvcjojZmZmO3BhZGRpbmc6NXB4O3dpZHRoOjE1MHB4Oyc+PC9kaXY+XCI7XG5cdFx0XHRcdFx0aXcgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XG5cdFx0XHRcdFx0XHRjb250ZW50OiBodG1sXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0aXcub3BlbihtYXAsIG1hcmtlcik7XG5cdFx0XHRcdFx0aW5mb1dpbmRvd1Zpc2libGUodHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0Z29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoaXcsICdjbG9zZWNsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGluZm9XaW5kb3dWaXNpYmxlKGZhbHNlKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cblxuXHR9KCkpXG4iLCJ2YXIgYmxvZ05hdiA9IChmdW5jdGlvbigpIHtcblxuXHR2YXIgc2lkZWJhciA9ICQoJy5ibG9nLW1lbnUtZWxlbScpO1xuXHR2YXIgc2VjdGlvbiA9ICQoJy5ibG9nLWFydGljbGUnKTtcblx0dmFyIGJsb2dNZW51ID0gJCgnLmJsb2ctbWVudScpXG5cblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXG5cdFx0JChzaWRlYmFyLmVxKDApKS5hZGRDbGFzcygnYWN0aXZlJyk7XG5cblx0XHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKGUpIHtcblx0XHRcdHZhciBzY3JvbGwgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cblx0XHRcdHNlY3Rpb24uZWFjaChmdW5jdGlvbihpbmRleCwgZWxlbSkge1xuXHRcdFx0XHR2YXIgdG9wRWRnZSA9ICQoZWxlbSkub2Zmc2V0KCkudG9wIC0gc2Nyb2xsO1xuXHRcdFx0XHR2YXIgYm90dG9tRWRnZSA9IHRvcEVkZ2UgKyAkKGVsZW0pLmhlaWdodCgpO1xuXHRcdFx0XHQvLyBjb25zb2xlLmxvZyhzY3JvbGwgK1wiIDpcIiArdG9wRWRnZSArIFwiOlwiICsgYm90dG9tRWRnZSk7XG5cdFx0XHRcdGNvbnNvbGUubG9nKHRvcEVkZ2UpO1xuXHRcdFx0XHRpZiAodG9wRWRnZSA8IDEwMCAmJiBib3R0b21FZGdlID4gMTAwKSB7XG5cdFx0XHRcdFx0JChzaWRlYmFyKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG5cdFx0XHRcdFx0JChzaWRlYmFyLmVxKGluZGV4KSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdH0pO1xuXG5cdFx0JCgnLmJsb2ctbWVudS1lbGVtJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0dmFyIGlkID0gJCh0aGlzKS5kYXRhKCdpZCcpXG5cdFx0XHR2YXIgdG9wID0gJChzZWN0aW9uLmVxKGlkKSkub2Zmc2V0KCkudG9wO1xuXHRcdFx0JCh3aW5kb3cpLnNjcm9sbFRvcCh0b3AgLSAxMDApO1xuXHRcdFx0JCgnLmJsb2ctbWVudS1lbGVtJykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdFx0JChzaWRlYmFyLmVxKGlkKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuXHRcdH0pO1xuXG5cdFx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbihlKSB7XG5cdFx0XHR2YXIgc2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXHRcdFx0dmFyIHRvcEVkZ2UgPSAkKHNlY3Rpb24uZXEoMCkpLm9mZnNldCgpLnRvcCAtIHNjcm9sbDtcblxuXHRcdFx0aWYgKHRvcEVkZ2UgPCAyMCkge1xuXHRcdFx0XHQkKGJsb2dNZW51KS5hZGRDbGFzcygnZml4ZWQnKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdCQoYmxvZ01lbnUpLnJlbW92ZUNsYXNzKCdmaXhlZCcpO1xuXHRcdFx0fTtcblx0XHR9KTtcblx0fTtcblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cbn0pKCk7XG4iLCJ2YXIgYmx1clBvc2l0aW9uID0gKGZ1bmN0aW9uKCkge1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cblx0XHQkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xuXG5cdFx0XHR2YXIgaW1nV2lkdGggPSAkKCcudGVzdGltb25pYWxzX19ibHVyJykud2lkdGgoKTtcblx0XHRcdHZhciBibHVyID0gJCgnLmZvcm0tY29udGFjdF9fYmcnKTtcblx0XHRcdHZhciBibHVyU2VjdGlvbiA9ICQoJy50ZXN0aW1vbmlhbHNfX2JsdXInKTtcblxuXHRcdFx0dmFyIHBvc0xlZnQgPSBibHVyU2VjdGlvbi5vZmZzZXQoKS5sZWZ0IC0gYmx1ci5vZmZzZXQoKS5sZWZ0O1xuXHRcdFx0dmFyIHBvc1RvcCA9IGJsdXJTZWN0aW9uLm9mZnNldCgpLnRvcCAtIGJsdXIub2Zmc2V0KCkudG9wO1xuXG5cdFx0XHRjb25zb2xlLmxvZyhpbWdXaWR0aCwgcG9zTGVmdCwgcG9zVG9wKTtcblxuXHRcdFx0Ymx1ci5jc3Moe1xuXHRcdFx0XHQvLyAnYmFja2dyb3VuZC1zaXplJzogJzEyMDBweCcsXG5cdFx0XHRcdC8vICdiYWNrZ3JvdW5kLXNpemUnOiAnYXV0byAnICsgaW1nV2lkdGgsXG5cdFx0XHRcdC8vICdiYWNrZ3JvdW5kLXBvc2l0aW9uJzogJy0zMDBweCAtNTAwcHgnXG5cdFx0XHRcdC8vICdiYWNrZ3JvdW5kLXBvc2l0aW9uJzogcG9zTGVmdCArICdweCAnICsgcG9zVG9wICsgJ3B4Jyxcblx0XHRcdH0pO1xuXG5cdFx0fSk7XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cblxufSgpKTtcbiIsInZhciBwcmVsb2FkZXIgPSAoZnVuY3Rpb24oKSB7XG5cblx0dmFyXG5cdC8vINC80LDRgdGB0LjQsiDQtNC70Y8g0LLRgdC10YUg0LjQt9C+0LHRgNCw0LbQtdC90LjQuSDQvdCwINGB0YLRgNCw0L3QuNGG0LVcblx0XHRfaW1ncyA9IFtdLFxuXG5cdFx0Ly8g0LHRg9C00LXRgiDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0YzRgdGPINC40Lcg0LTRgNGD0LPQuNGFINC80L7QtNGD0LvQtdC5LCDRh9GC0L7QsdGLINC/0YDQvtCy0LXRgNC40YLRjCwg0L7RgtGA0LjRgdC+0LLQsNC90Ysg0LvQuCDQstGB0LUg0Y3Qu9C10LzQtdC90YLRi1xuXHRcdC8vINGCLtC6LiBkb2N1bWVudC5yZWFkeSDQuNC3LdC30LAg0L/RgNC10LvQvtCw0LTQtdGA0LAg0YHRgNCw0LHQsNGC0YvQstCw0LXRgiDRgNCw0L3RjNGI0LUsINC60L7Qs9C00LAg0L7RgtGA0LjRgdC+0LLQsNC9INC/0YDQtdC70L7QsNC00LXRgCwg0LAg0L3QtSDQstGB0Y8g0YHRgtGA0LDQvdC40YbQsFxuXHRcdGNvbnRlbnRSZWFkeSA9ICQuRGVmZXJyZWQoKTtcblxuXHQvLyDQuNC90LjRhtC40LDQu9GM0LfQsNGG0LjRjyDQvNC+0LTRg9C70Y9cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRfY291bnRJbWFnZXMoKTtcblx0XHRfc3RhcnRQcmVsb2FkZXIoKTtcblx0fTtcblxuXHRmdW5jdGlvbiBfY291bnRJbWFnZXMoKSB7XG5cblx0XHQvLyDQv9GA0L7RhdC+0LTQuNC8INC/0L4g0LLRgdC10Lwg0Y3Qu9C10LzQtdC90YLQsNC8INC90LAg0YHRgtGA0LDQvdC40YbQtVxuXHRcdCQuZWFjaCgkKCcqJyksIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcblx0XHRcdFx0YmFja2dyb3VuZCA9ICR0aGlzLmNzcygnYmFja2dyb3VuZC1pbWFnZScpLFxuXHRcdFx0XHRpbWcgPSAkdGhpcy5pcygnaW1nJyk7XG5cblx0XHRcdC8vINC30LDQv9C40YHRi9Cy0LDQtdC8INCyINC80LDRgdGB0LjQsiDQstGB0LUg0L/Rg9GC0Lgg0Log0LHRjdC60LPRgNCw0YPQvdC00LDQvFxuXHRcdFx0aWYgKGJhY2tncm91bmQgIT0gJ25vbmUnKSB7XG5cblx0XHRcdFx0Ly8g0LIgY2hyb21lINCyINGD0YDQu9C1INC10YHRgtGMINC60LDQstGL0YfQutC4LCDQstGL0YDQtdC30LDQtdC8INGBINC90LjQvNC4LiB1cmwoXCIuLi5cIikgLT4gLi4uXG5cdFx0XHRcdC8vINCyIHNhZmFyaSDQsiDRg9GA0LvQtSDQvdC10YIg0LrQsNCy0YvRh9C10LosINCy0YvRgNC10LfQsNC10Lwg0LHQtdC3INC90LjRhS4gdXJsKCAuLi4gKSAtPiAuLi5cblx0XHRcdFx0dmFyIHBhdGggPSBiYWNrZ3JvdW5kLnJlcGxhY2UoJ3VybChcIicsIFwiXCIpLnJlcGxhY2UoJ1wiKScsIFwiXCIpO1xuXHRcdFx0XHR2YXIgcGF0aCA9IHBhdGgucmVwbGFjZSgndXJsKCcsIFwiXCIpLnJlcGxhY2UoJyknLCBcIlwiKTtcblxuXHRcdFx0XHRfaW1ncy5wdXNoKHBhdGgpO1xuXHRcdFx0fVxuXHRcdFx0Ly8g0LfQsNC/0LjRgdGL0LLQsNC10Lwg0LIg0LzQsNGB0YHQuNCyINCy0YHQtSDQv9GD0YLQuCDQuiDQutCw0YDRgtC40L3QutCw0Lxcblx0XHRcdGlmIChpbWcpIHtcblx0XHRcdFx0dmFyIHBhdGggPSAnJyArICR0aGlzLmF0dHIoJ3NyYycpO1xuXHRcdFx0XHRpZiAoKHBhdGgpICYmICgkdGhpcy5jc3MoJ2Rpc3BsYXknKSAhPT0gJ25vbmUnKSkge1xuXHRcdFx0XHRcdF9pbWdzLnB1c2gocGF0aCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fTtcblxuXHRmdW5jdGlvbiBfc3RhcnRQcmVsb2FkZXIoKSB7XG5cblx0XHQkKCdib2R5JykuYWRkQ2xhc3MoJ292ZXJmbG93LWhpZGRlbicpO1xuXHRcdC8vICQoJy53cmFwcGVyJykuY3NzKCdvcGFjaXR5JywgJzAnKVxuXG5cdFx0Ly8g0LfQsNCz0YDRg9C20LXQvdC+IDAg0LrQsNGA0YLQuNC90L7QulxuXHRcdHZhciBsb2FkZWQgPSAwO1xuXG5cdFx0Ly8g0L/RgNC+0YXQvtC00LjQvCDQv9C+INCy0YHQtdC8INGB0L7QsdGA0LDQvdC90YvQvCDQutCw0YDRgtC40L3QutCw0Lxcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IF9pbWdzLmxlbmd0aDsgaSsrKSB7XG5cblx0XHRcdHZhciBpbWFnZSA9ICQoJzxpbWc+Jywge1xuXHRcdFx0XHRhdHRyOiB7XG5cdFx0XHRcdFx0c3JjOiBfaW1nc1tpXVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8g0LfQsNCz0YDRg9C20LDQtdC8INC/0L4g0L/QvtC00L3QvtC5XG5cdFx0XHQkKGltYWdlKS5sb2FkKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRsb2FkZWQrKztcblx0XHRcdFx0dmFyIHBlcmNlbnRMb2FkZWQgPSBfY291bnRQZXJjZW50KGxvYWRlZCwgX2ltZ3MubGVuZ3RoKTtcblx0XHRcdFx0X3NldFBlcmNlbnQocGVyY2VudExvYWRlZCk7XG5cdFx0XHR9KTtcblxuXHRcdH07XG5cdH1cblxuXHQvLyDQv9C10YDQtdGB0YfQuNGC0YvQstCw0LXRgiDQsiDQv9GA0L7RhtC10L3RgtGLLCDRgdC60L7Qu9GM0LrQviDQutCw0YDRgtC40L3QvtC6INC30LDQs9GA0YPQttC10L3QvlxuXHQvLyBjdXJyZW50IC0gbnVtYmVyLCDRgdC60L7Qu9GM0LrQviDQutCw0YDRgtC40L3QvtC6INC30LDQs9GA0YPQttC10L3QvlxuXHQvLyB0b3RhbCAtIG51bWJlciwg0YHQutC+0LvRjNC60L4g0LjRhSDQstGB0LXQs9C+XG5cdGZ1bmN0aW9uIF9jb3VudFBlcmNlbnQoY3VycmVudCwgdG90YWwpIHtcblx0XHRyZXR1cm4gTWF0aC5jZWlsKGN1cnJlbnQgLyB0b3RhbCAqIDEwMCk7XG5cdH1cblxuXHQvLyDQt9Cw0L/QuNGB0YvQstCw0LXRgiDQv9GA0L7RhtC10L3RgiDQsiBkaXYg0L/RgNC10LvQvtCw0LTQtdGAXG5cdC8vIHBlcmNlbnQgLSBudW1iZXIsINC60LDQutGD0Y4g0YbQuNGE0YDRgyDQt9Cw0L/QuNGB0LDRgtGMXG5cdGZ1bmN0aW9uIF9zZXRQZXJjZW50KHBlcmNlbnQpIHtcblxuXHRcdCQoJy5wcmVsb2FkZXJfdGV4dCcpLnRleHQocGVyY2VudCk7XG5cblx0XHQvL9C60L7Qs9C00LAg0LTQvtGI0LvQuCDQtNC+IDEwMCUsINGB0LrRgNGL0LLQsNC10Lwg0L/RgNC10LvQvtCw0LTQtdGAINC4INC/0L7QutCw0LfRi9Cy0LDQtdC8INGB0L7QtNC10YDQttC40LzQvtC1INGB0YLRgNCw0L3QuNGG0Ytcblx0XHRpZiAocGVyY2VudCA+PSAxMDApIHtcblx0XHRcdC8vICQoJy5wcmVsb2FkZXJfY29udGFpbmVyJykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cdFx0XHQkKCcucHJlbG9hZGVyX2NvbnRhaW5lcicpLmRlbGF5KDYwMCkuZmFkZU91dCg0MDApO1xuXHRcdFx0JCgnYm9keScpLnJlbW92ZUNsYXNzKCdvdmVyZmxvdy1oaWRkZW4nKTtcblx0XHRcdC8vICQoJy53cmFwcGVyJykuZGVsYXkoMTAwMCkuY3NzKCdvcGFjaXR5JywgJzEnKVxuXHRcdFx0X2ZpbmlzaFByZWxvYWRlcigpO1xuXHRcdH1cblx0fTtcblxuXHRmdW5jdGlvbiBfZmluaXNoUHJlbG9hZGVyKCkge1xuXHRcdGNvbnRlbnRSZWFkeS5yZXNvbHZlKCk7XG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0LFxuXHRcdGNvbnRlbnRSZWFkeTogY29udGVudFJlYWR5XG5cdH07XG5cbn0pKCk7XG4iLCJ2YXIgcGFyYWxsYXggPSAoZnVuY3Rpb24oKSB7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblxuXHRcdCQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXG5cdFx0XHR2YXIgbGF5ZXIgPSAkKCcucGFyYWxsYXgnKS5maW5kKCcucGFyYWxsYXhfX2xheWVyJyk7IC8vINCS0YvQsdC40YDQsNC10Lwg0LLRgdC1IHBhcmFsbGF4X19sYXllciDQsiDQvtCx0YrQtdC60YJcblxuXHRcdFx0bGF5ZXIubWFwKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHsgLy8g0J/RgNC+0YXQvtC00LjQvNGB0Y8g0L/QviDQstGB0LXQvCDRjdC70LXQvNC10L3RgtCw0Lwg0L7QsdGK0LXQutGC0LBcblx0XHRcdFx0dmFyIGJvdHRvbVBvc2l0aW9uID0gKCh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAqIChrZXkgLyAxMDApKTsgLy8g0JLRi9GH0LjRgdC70Y/QtdC8INC90LAg0YHQutC+0LvRjNC60L4g0L3QsNC8INC90LDQtNC+INC+0L/Rg9GB0YLQuNGC0Ywg0LLQvdC40Lcg0L3QsNGIINGB0LvQvtC5INGH0YLQviDQsdGLINC/0YDQuCDQv9C10YDQtdC80LXRidC10L3QuNC4INC/0L4gWSDQvdC1INCy0LjQtNC90L4g0LHRi9C70L4g0LrRgNCw0LXQslxuXHRcdFx0XHQkKHZhbHVlKS5jc3MoeyAvLyDQktGL0LHQuNGA0LDQtdC8INGN0LvQtdC80LXQvdGCINC4INC00L7QsdCw0LLQu9GP0LXQvCBjc3Ncblx0XHRcdFx0XHQnYm90dG9tJzogJy0nICsgYm90dG9tUG9zaXRpb24gKyAncHgnLCAvLyDQktGL0YHRgtCw0LLQu9GP0LXQvCBib3R0b21cblx0XHRcdFx0XHQndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZTNkKDBweCwgMHB4LCAwKScsIC8vINCf0L7QtNCz0L7RgtCw0LLQu9C40LLQsNC10LwgYnJvd3NlciDQuiDRgtGA0LDQvdGB0YTQvtGA0LzQsNGG0LjQuFxuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0XHQkKHdpbmRvdykub24oJ21vdXNlbW92ZScsIGZ1bmN0aW9uKGUpIHsgLy8g0J3QsNCy0LXRiNC40LLQsNC10Lwg0YHQvtCx0YvRgtC40LUg0L/QtdGA0LXQvNC10YnQtdC90Lgg0LzRi9GI0Lgg0L3QsCB3aW5kb3csINC/0LXRgNCy0YvQvCDQsNGA0LPRg9C80LXQvdGC0L7QvCDQsiDRhNGD0L3QutGG0LjRji3QvtCx0YDQsNCx0L7RgtGH0LjQuiDRgdC+0LHRi9GC0LjRjyDQvtGC0L/RgNCw0LLQu9GP0LXRgtGB0Y8g0YHRgdGL0LvQutCwINC90LAg0L7QsdGK0LXQutGCINGB0L7QsdGL0YLQuNGPXG5cdFx0XHRcdHZhciBtb3VzZV9keCA9IChlLnBhZ2VYKTsgLy8g0KPQt9C90LDQtdC8INC/0L7Qu9C+0LbQtdC90LjQtSDQvNGL0YjQutC4INC/0L4gWFxuXHRcdFx0XHR2YXIgbW91c2VfZHkgPSAoZS5wYWdlWSk7IC8vINCj0LfQvdCw0LXQvCDQv9C+0LvQvtC20LXQvdC40LUg0LzRi9GI0LrQuCDQv9C+IFlcblx0XHRcdFx0Ly8g0KIu0LouINC80Ysg0LTQtdC70LjQvCDRjdC60YDQsNC9INC90LAg0YfQtdGC0YvRgNC1INGH0LDRgdGC0Lgg0YfRgtC+INCx0Ysg0LIg0YbQtdC90YLRgNC1INC+0LrQsNC30LDQu9Cw0YHRjCDRgtC+0YfQutCwINC60L7QvtGA0LTQuNC90LDRgiAwLCDRgtC+INC90LDQvCDQvdCw0LTQviDQt9C90LDRgtGMINC60L7Qs9C00LAg0YMg0L3QsNGBINCx0YPQtNC10YIgLdClINC4ICvQpSwgLVkg0LggK1lcblx0XHRcdFx0dmFyIHcgPSAod2luZG93LmlubmVyV2lkdGggLyAyKSAtIG1vdXNlX2R4OyAvLyDQktGL0YfQuNGB0LvRj9C10Lwg0LTQu9GPIHgg0L/QtdGA0LXQvNC10YnQtdC90LjRj1xuXHRcdFx0XHR2YXIgaCA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAtIG1vdXNlX2R5OyAvLyDQktGL0YfQuNGB0LvRj9C10Lwg0LTQu9GPIHkg0L/QtdGA0LXQvNC10YnQtdC90LjRj1xuXG5cdFx0XHRcdGxheWVyLm1hcChmdW5jdGlvbihrZXksIHZhbHVlKSB7IC8vINCf0YDQvtGF0L7QtNC40LzRgdGPINC/0L4g0LLRgdC10Lwg0Y3Qu9C10LzQtdC90YLQsNC8INC+0LHRitC10LrRgtCwXG5cdFx0XHRcdFx0dmFyIGJvdHRvbVBvc2l0aW9uID0gKCh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAqIChrZXkgLyAxMDApKTsgLy8g0JLRi9GH0LjRgdC70Y/QtdC8INC90LAg0YHQutC+0LvRjNC60L4g0L3QsNC8INC90LDQtNC+INC+0L/Rg9GB0YLQuNGC0Ywg0LLQvdC40Lcg0L3QsNGIINGB0LvQvtC5INGH0YLQviDQsdGLINC/0YDQuCDQv9C10YDQtdC80LXRidC10L3QuNC4INC/0L4gWSDQvdC1INCy0LjQtNC90L4g0LHRi9C70L4g0LrRgNCw0LXQslxuXHRcdFx0XHRcdHZhciB3aWR0aFBvc2l0aW9uID0gdyAqIChrZXkgLyAxMDApOyAvLyDQktGL0YfQuNGB0LvRj9C10Lwg0LrQvtC+0YTQuNGG0LXQvdGCINGB0LzQtdGI0LXQvdC40Y8g0L/QviBYXG5cdFx0XHRcdFx0dmFyIGhlaWdodFBvc2l0aW9uID0gaCAqIChrZXkgLyAxMDApOyAvLyDQktGL0YfQuNGB0LvRj9C10Lwg0LrQvtC+0YTQuNGG0LXQvdGCINGB0LzQtdGI0LXQvdC40Y8g0L/QviBZXG5cdFx0XHRcdFx0JCh2YWx1ZSkuY3NzKHsgLy8g0JLRi9Cx0LjRgNCw0LXQvCDRjdC70LXQvNC10L3RgiDQuCDQtNC+0LHQsNCy0LvRj9C10LwgY3NzXG5cdFx0XHRcdFx0XHQnYm90dG9tJzogJy0nICsgYm90dG9tUG9zaXRpb24gKyAncHgnLCAvLyDQktGL0YHRgtCw0LLQu9GP0LXQvCBib3R0b21cblx0XHRcdFx0XHRcdCd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoUG9zaXRpb24gKyAncHgsICcgKyBoZWlnaHRQb3NpdGlvbiArICdweCwgMCknLCAvLyDQmNGB0L/QvtC70YzQt9GD0LXQvCB0cmFuc2xhdGUzZCDQtNC70Y8g0LHQvtC70LXQtSDQu9GD0YfRiNC10LPQviDRgNC10L3QtNC10YDQuNC90LPQsCDQvdCwINGB0YLRgNCw0L3QuNGG0LVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9KVxuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG5cbn0oKSk7XG4iLCJ2YXIgZmxpcHBlciA9IChmdW5jdGlvbigpIHtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdHNldFVwRXZlbnRMaXN0ZW5lcnMoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFVwRXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0dmFyIGF1dGggPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lKCdhdXRob3JpemUnKTtcblx0XHR2YXIgYXV0aEVsZW0gPSBhdXRoWzBdO1xuXHRcdHZhciBmbGlwID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeUNsYXNzTmFtZSgnZmxpcCcpO1xuXHRcdHZhciBmbGlwRWxlbSA9IGZsaXBbMF07XG5cdFx0aWYgKGF1dGhFbGVtICE9IHVuZGVmaW5lZCkge1xuXHRcdFx0YXV0aEVsZW0uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdGZsaXBFbGVtLmNsYXNzTGlzdC50b2dnbGUoJ2ZsaXBwaW5nJyk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxufSgpKTtcbiIsInZhciBzY3JvbGwgPSAoZnVuY3Rpb24oKSB7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblxuXHRcdFx0dmFyIGxheWVyID0gJCgnLnBhcmFsbGF4LXNjcm9sbF9fbGF5ZXInKTsgLy8g0JLRi9Cx0LjRgNCw0LXQvCDQstGB0LUgcGFyYWxsYXhfX2xheWVyINCyINC+0LHRitC10LrRglxuXG5cdFx0XHQkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0dmFyIHNjcm9sbFRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblx0XHRcdFx0bGF5ZXIubWFwKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcblx0XHRcdFx0XHRib3R0b21Qb3NpdGlvbiA9IHNjcm9sbFRvcCAqIGtleSAvIDEwMDtcblx0XHRcdFx0XHRoZWlnaHRQb3NpdGlvbiA9IC1zY3JvbGxUb3AgKiBrZXkgLyAxMDA7XG5cblx0XHRcdFx0XHQkKHZhbHVlKS5jc3Moe1xuXHRcdFx0XHRcdFx0J3RvcCc6ICctJyArIGJvdHRvbVBvc2l0aW9uICsgJ3B4Jyxcblx0XHRcdFx0XHRcdCd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoMCwnICsgaGVpZ2h0UG9zaXRpb24gKyAncHgsIDApJywgLy8g0JjRgdC/0L7Qu9GM0LfRg9C10LwgdHJhbnNsYXRlM2Qg0LTQu9GPINCx0L7Qu9C10LUg0LvRg9GH0YjQtdCz0L4g0YDQtdC90LTQtdGA0LjQvdCz0LAg0L3QsCDRgdGC0YDQsNC90LjRhtC1XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fSlcblx0XHRcdH0pXG5cblx0XHR9KTtcblxuXG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxuXG59KCkpO1xuIiwidmFyIHNsaWRlciA9IChmdW5jdGlvbigpIHtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXG5cdFx0dmFyIG1haW4gPSAkKCcud29ya3NfX3JpZ2h0X3RvcF9pbWcnKTtcblx0XHR2YXIgcHJldiA9ICQoJy53b3Jrc19fcmlnaHRfYm90dG9tX2xlZnRfaW1nJyk7XG5cdFx0dmFyIG5leHQgPSAkKCcud29ya3NfX3JpZ2h0X2JvdHRvbV9yaWdodF9pbWcnKTtcblx0XHR2YXIgbWFpblNsaWRlID0gJCgnLndvcmtzX19yaWdodF90b3AnKTtcblx0XHR2YXIgcHJldlNsaWRlID0gJCgnLndvcmtzX19yaWdodF9ib3R0b21fbGVmdCcpO1xuXHRcdHZhciBuZXh0U2xpZGUgPSAkKCcud29ya3NfX3JpZ2h0X2JvdHRvbV9yaWdodCcpO1xuXHRcdHZhciBsYXN0TnVtID0gbWFpbi5sZW5ndGggLSAxO1xuXG5cdFx0aWYgKG1haW4ubGVuZ3RoICE9IHByZXYubGVuZ3RoIHx8IG1haW4ubGVuZ3RoICE9IG5leHQubGVuZ3RoKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKCdEaWZmZXJlbnQgbnVtYmVyIG9mIHBpY3R1cmVzIGluIGJsb2NrcycpO1xuXHRcdH1cblxuXHRcdG1haW4uY3NzKHtcblx0XHRcdCd0b3AnOiAnMCcsXG5cdFx0XHQnb3BhY2l0eSc6ICcwJ1xuXHRcdH0pO1xuXHRcdG1haW4uZXEoMCkuY3NzKHtcblx0XHRcdCd0b3AnOiAnMCcsXG5cdFx0XHQnb3BhY2l0eSc6ICcxJ1xuXHRcdH0pO1xuXHRcdHByZXYuZXEobGFzdE51bSkuY3NzKHtcblx0XHRcdCd0b3AnOiAnMCdcblx0XHR9KTtcblx0XHRuZXh0LmVxKDEpLmNzcyh7XG5cdFx0XHQndG9wJzogJzAnXG5cdFx0fSk7XG5cblx0XHR2YXIgY3NzU2V0dXAgPSB7XG5cdFx0XHRuZXh0OiB7XG5cdFx0XHRcdHByZXY6IHtcblx0XHRcdFx0XHQnei1pbmRleCc6ICcwJyxcblx0XHRcdFx0XHQndG9wJzogJzEwMCUnLFxuXHRcdFx0XHRcdCd0cmFuc2l0aW9uLXByb3BlcnR5JzogJ3RvcCcsXG5cdFx0XHRcdFx0J3RyYW5zaXRpb24tZHVyYXRpb24nOiAnLjA5cydcblx0XHRcdFx0fSxcblx0XHRcdFx0Y3Vycjoge1xuXHRcdFx0XHRcdCd0b3AnOiAnLTEwMCUnLFxuXHRcdFx0XHRcdCd0cmFuc2l0aW9uLXByb3BlcnR5JzogJ3RvcCcsXG5cdFx0XHRcdFx0J3RyYW5zaXRpb24tZHVyYXRpb24nOiAnLjI1cydcblx0XHRcdFx0fSxcblx0XHRcdFx0bmV4dDoge1xuXHRcdFx0XHRcdCd0b3AnOiAnMCcsXG5cdFx0XHRcdFx0J3otaW5kZXgnOiAnMTAnLFxuXHRcdFx0XHRcdCd0cmFuc2l0aW9uLXByb3BlcnR5JzogJ3RvcCcsXG5cdFx0XHRcdFx0J3RyYW5zaXRpb24tZHVyYXRpb24nOiAnLjI1cydcblx0XHRcdFx0fVxuXHRcdFx0fSxcblx0XHRcdHByZXY6IHtcblx0XHRcdFx0cHJldjoge1xuXHRcdFx0XHRcdCd6LWluZGV4JzogJzAnLFxuXHRcdFx0XHRcdCd0b3AnOiAnLTEwMCUnLFxuXHRcdFx0XHRcdCd0cmFuc2l0aW9uLXByb3BlcnR5JzogJ3RvcCcsXG5cdFx0XHRcdFx0J3RyYW5zaXRpb24tZHVyYXRpb24nOiAnLjA5cydcblx0XHRcdFx0fSxcblx0XHRcdFx0Y3Vycjoge1xuXHRcdFx0XHRcdCd0b3AnOiAnMTAwJScsXG5cdFx0XHRcdFx0J3RyYW5zaXRpb24tcHJvcGVydHknOiAndG9wJyxcblx0XHRcdFx0XHQndHJhbnNpdGlvbi1kdXJhdGlvbic6ICcuMjVzJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRuZXh0OiB7XG5cdFx0XHRcdFx0J3RvcCc6ICcwJyxcblx0XHRcdFx0XHQnei1pbmRleCc6ICcxMCcsXG5cdFx0XHRcdFx0J3RyYW5zaXRpb24tcHJvcGVydHknOiAndG9wJyxcblx0XHRcdFx0XHQndHJhbnNpdGlvbi1kdXJhdGlvbic6ICcuMjVzJ1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0bWFpbjoge1xuXHRcdFx0XHRwcmV2OiB7XG5cdFx0XHRcdFx0J29wYWNpdHknOiAnMCcsXG5cdFx0XHRcdFx0J3RyYW5zaXRpb24tcHJvcGVydHknOiAnb3BhY2l0eScsXG5cdFx0XHRcdFx0J3RyYW5zaXRpb24tZHVyYXRpb24nOiAnLjJzJ1xuXHRcdFx0XHR9LFxuXHRcdFx0XHRjdXJyOiB7XG5cdFx0XHRcdFx0J29wYWNpdHknOiAnMScsXG5cdFx0XHRcdFx0J3RyYW5zaXRpb24tcHJvcGVydHknOiAnb3BhY2l0eScsXG5cdFx0XHRcdFx0J3RyYW5zaXRpb24tZHVyYXRpb24nOiAnLjJzJ1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHZhciBjdHJsID0gKGZ1bmN0aW9uKCkge1xuXHRcdFx0bmV4dFNsaWRlLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRuZXh0U2xpZGUucmVuZGVyTmV4dCgpO1xuXHRcdFx0XHRwcmV2U2xpZGUucmVuZGVyTmV4dCgpO1xuXHRcdFx0XHRtYWluU0xpZGVCLnJlbmRlck5leHQoKTtcblx0XHRcdH0pO1xuXHRcdFx0cHJldlNsaWRlLmNsaWNrKGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRuZXh0U2xpZGUucmVuZGVyUHJldigpO1xuXHRcdFx0XHRwcmV2U2xpZGUucmVuZGVyUHJldigpO1xuXHRcdFx0XHRtYWluU0xpZGVCLnJlbmRlclByZXYoKVxuXHRcdFx0fSk7XG5cdFx0XHRtYWluU2xpZGUuY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHR9KVxuXHRcdH0pKCk7XG5cblx0XHRmdW5jdGlvbiBTbGlkZShzbGlkZSwgY3NzU2V0dXAsIHNsaWRlTnVtKSB7XG5cdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG5cdFx0XHR0aGlzLnRlc3QgPSAwO1xuXHRcdFx0dGhpcy5zbGlkZSA9IHNsaWRlO1xuXHRcdFx0dGhpcy5jc3NTZXR1cCA9IGNzc1NldHVwO1xuXHRcdFx0dGhpcy5zbGlkZU51bSA9IHNsaWRlTnVtO1xuXG5cdFx0XHR0aGlzLnJlbmRlck5leHQgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhpcy5zbGlkZU51bSArPSAxO1xuXHRcdFx0XHRpZiAodGhpcy5zbGlkZU51bSA9PT0gNCkge1xuXHRcdFx0XHRcdHRoaXMuc2xpZGVOdW0gPSAwO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuc2xpZGUuZXEodGhpcy5zbGlkZU51bSkuY3NzKHRoaXMuY3NzU2V0dXAucHJldik7XG5cdFx0XHRcdHRoaXMuc2xpZGUuZXEodGhpcy5zbGlkZU51bSkub25lKCd0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQgTVNUcmFuc2l0aW9uRW5kJyxcblx0XHRcdFx0XHRmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRcdHRoYXQuc2xpZGUuZXEodGhhdC5zbGlkZU51bSAtIDEpLmNzcyh0aGF0LmNzc1NldHVwLmN1cnIpO1xuXHRcdFx0XHRcdFx0dGhhdC5zbGlkZS5lcSh0aGF0LnNsaWRlTnVtKS5jc3ModGhhdC5jc3NTZXR1cC5uZXh0KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH07XG5cblx0XHRcdHRoaXMucmVuZGVyUHJldiA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR0aGlzLnNsaWRlTnVtIC09IDE7XG5cdFx0XHRcdGlmICh0aGlzLnNsaWRlTnVtID09PSAtMSkgdGhpcy5zbGlkZU51bSA9IDM7XG5cdFx0XHRcdHRoaXMuc2xpZGUuZXEodGhpcy5zbGlkZU51bSkuY3NzKGNzc1NldHVwLnByZXYpO1xuXHRcdFx0XHR0aGlzLnNsaWRlLmVxKHRoaXMuc2xpZGVOdW0pLm9uZSgndHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kIE1TVHJhbnNpdGlvbkVuZCcsXG5cdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHRpZiAodGhhdC5zbGlkZU51bSA9PT0gMykge1xuXHRcdFx0XHRcdFx0XHR0aGF0LnRlc3QgPSAtMTtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdHRoYXQudGVzdCA9IHRoYXQuc2xpZGVOdW07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0aGF0LnNsaWRlLmVxKHRoYXQudGVzdCArIDEpLmNzcyh0aGF0LmNzc1NldHVwLmN1cnIpO1xuXHRcdFx0XHRcdFx0dGhhdC5zbGlkZS5lcSh0aGF0LnNsaWRlTnVtKS5jc3ModGhhdC5jc3NTZXR1cC5uZXh0KTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdH07XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gTWFpblNsaWRlQmxvY2soc2xpZGUsIGNzc1NldHVwLCBzbGlkZU51bSwgbGFzdE51bSkge1xuXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuXHRcdFx0dGhpcy5sYXN0TnVtID0gbGFzdE51bTtcblx0XHRcdHRoaXMuc2xpZGUgPSBzbGlkZTtcblx0XHRcdHRoaXMuY3NzU2V0dXAgPSBjc3NTZXR1cDtcblx0XHRcdHRoaXMuc2xpZGVOdW0gPSBzbGlkZU51bTtcblx0XHRcdHRoaXMubnVtID0gMDtcblxuXHRcdFx0dGhpcy5yZW5kZXJOZXh0ID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHRoaXMuc2xpZGVOdW0gKz0gMTtcblx0XHRcdFx0aWYgKHRoaXMuc2xpZGVOdW0gPT09IHRoaXMubGFzdE51bSArIDEpIHRoaXMuc2xpZGVOdW0gPSAwO1xuXG5cdFx0XHRcdHRoaXMuc2xpZGUuZXEodGhpcy5zbGlkZU51bSAtIDEpLmNzcyh0aGlzLmNzc1NldHVwLnByZXYpO1xuXG5cdFx0XHRcdHRoaXMuc2xpZGUuZXEodGhpcy5zbGlkZU51bSAtIDEpLm9uZSgndHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kIE1TVHJhbnNpdGlvbkVuZCcsXG5cdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0XHR0aGF0LnNsaWRlLmVxKHRoYXQuc2xpZGVOdW0pLmNzcyh0aGF0LmNzc1NldHVwLmN1cnIpXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHR9O1xuXG5cdFx0XHR0aGlzLnJlbmRlclByZXYgPSBmdW5jdGlvbigpIHtcblx0XHRcdFx0dGhpcy5zbGlkZU51bSAtPSAxO1xuXG5cdFx0XHRcdGlmICh0aGlzLnNsaWRlTnVtID09PSAtMSkge1xuXHRcdFx0XHRcdHRoaXMubnVtID0gMDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0aGlzLm51bSA9IHRoaXMuc2xpZGVOdW0gKyAxO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRoaXMuc2xpZGUuZXEodGhpcy5udW0pLmNzcyh0aGlzLmNzc1NldHVwLnByZXYpO1xuXHRcdFx0XHR0aGlzLnNsaWRlLmVxKHRoaXMubnVtKS5vbmUoJ3RyYW5zaXRpb25lbmQgd2Via2l0VHJhbnNpdGlvbkVuZCBvVHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCBNU1RyYW5zaXRpb25FbmQnLFxuXHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdFx0aWYgKHRoYXQuc2xpZGVOdW0gPT09IC0xKSB7XG5cdFx0XHRcdFx0XHRcdHRoYXQuc2xpZGVOdW0gPSB0aGF0Lmxhc3ROdW07XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR0aGF0LnNsaWRlLmVxKHRoYXQuc2xpZGVOdW0pLmNzcyh0aGF0LmNzc1NldHVwLmN1cnIpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0fTtcblx0XHR9XG5cblx0XHR2YXIgbWFpblNMaWRlQjtcblx0XHRtYWluU0xpZGVCID0gbmV3IE1haW5TbGlkZUJsb2NrKG1haW4sIGNzc1NldHVwLm1haW4sIDAsIGxhc3ROdW0pO1xuXHRcdG5leHRTbGlkZSA9IG5ldyBTbGlkZShuZXh0LCBjc3NTZXR1cC5uZXh0LCAxKTtcblx0XHRwcmV2U2xpZGUgPSBuZXcgU2xpZGUocHJldiwgY3NzU2V0dXAucHJldiwgbGFzdE51bSlcblxuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cbn0oKSlcbiIsInZhciBzbGlkZXJUZXh0ID0gKGZ1bmN0aW9uKCkge1xuXHR2YXIgdGl0bGVzQ29udGFpbmVyID0gJCgnLndvcmtzX19sZWZ0X2hlYWRlcicpO1xuXHR2YXIgdGl0bGVzID0gJCgnLndvcmtzX19sZWZ0X2hlYWRlcl9pbm5lcicpO1xuXHR2YXIgZGVzY3JpcHRpb25Db250YWluZXIgPSAkKCcud29ya3NfX2xlZnRfZG9uZS13aXRoJylcblx0dmFyIGRlc2NyaXB0aW9uID0gJCgnLndvcmtzX19sZWZ0X2RvbmUtd2l0aF9pbm5lcicpO1xuXHR2YXIgbmV4dEJ1dHRvbiA9ICQoJy53b3Jrc19fcmlnaHRfYm90dG9tX3JpZ2h0Jyk7XG5cdHZhciBwcmV2QnV0dG9uID0gJCgnLndvcmtzX19yaWdodF9ib3R0b21fbGVmdCcpO1xuXHR2YXIgdGl0bGVzQXJyYXkgPSBbXTtcblx0dmFyIGRlc2NyaXB0aW9uQXJyYXkgPSBbXTtcblxuXHRmdW5jdGlvbiBfcHJvY2Vzcyh0aXRsZXMsIGFycmF5KSB7XG5cblx0XHR0aXRsZXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdCR0aGlzID0gJCh0aGlzKTtcblx0XHRcdHZhciB0ZXh0ID0gJHRoaXMudGV4dCgpO1xuXHRcdFx0JHRoaXMuaHRtbCgnJyk7XG5cdFx0XHRhcnJheS5wdXNoKF9zcGFuaWZ5KHRleHQpKTtcblx0XHR9KTtcblxuXHRcdCQoJy53b3Jrc19fbGVmdF9oZWFkZXJfaW5uZXInKS5yZW1vdmUoKTtcblx0XHQkKCcud29ya3NfX2xlZnRfZG9uZS13aXRoX2lubmVyJykucmVtb3ZlKCk7XG5cdFx0JCgnLndvcmtzX19sZWZ0X2hlYWRlcicpLmFwcGVuZCgnPGRpdiBjbGFzcz1cIndvcmtzX19sZWZ0X2hlYWRlcl9pbm5lclwiPjwvZGl2PicpXG5cdFx0JCgnLndvcmtzX19sZWZ0X2RvbmUtd2l0aCcpLnByZXBlbmQoJzxkaXYgY2xhc3M9XCJ3b3Jrc19fbGVmdF9kb25lLXdpdGhfaW5uZXJcIj48L2Rpdj4nKVxuXHR9XG5cblx0ZnVuY3Rpb24gX3NhdmUodGl0bGVzLCBhcnJheSkge1xuXHRcdHRpdGxlcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHRleHQgPSAkKHRoaXMpLmh0bWwoKTtcblx0XHRcdGFycmF5LnB1c2godGV4dClcblx0XHR9KVxuXHR9XG5cblx0ZnVuY3Rpb24gX3NwYW5pZnkodGV4dCkge1xuXHRcdHZhciBhcnJheSA9IFtdO1xuXHRcdHZhciB3b3Jkc0FycmF5ID0gdGV4dC5zcGxpdCgnICcpO1xuXHRcdHZhciBzcGFubmVkVGV4dCA9ICcnO1xuXG5cdFx0d29yZHNBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHdvcmQpIHtcblx0XHRcdHZhciBsZXR0ZXJzQXJyYXkgPSB3b3JkLnNwbGl0KCcnKTtcblx0XHRcdHZhciBzcGFubmVkV29yZCA9ICcnO1xuXG5cdFx0XHRsZXR0ZXJzQXJyYXkuZm9yRWFjaChmdW5jdGlvbihsZXR0ZXIpIHtcblx0XHRcdFx0c3Bhbm5lZFdvcmQgKz0gJzxzcGFuIGNsYXNzPVwibGV0dGVyXCI+JyArIGxldHRlciArICc8L3NwYW4+Jztcblx0XHRcdH0pO1xuXG5cdFx0XHRzcGFubmVkVGV4dCArPSAnPHNwYW4gY2xhc3M9XCJ3b3JkXCI+JyArIHNwYW5uZWRXb3JkICsgJzwvc3Bhbj4nO1xuXG5cdFx0fSk7XG5cblx0XHRhcnJheS5wdXNoKHNwYW5uZWRUZXh0KTtcblx0XHRyZXR1cm4gYXJyYXlcblx0fVxuXG5cblx0ZnVuY3Rpb24gX3NldEV2ZW50TGlzdGVuZXJzKCkge1xuXG5cdFx0dmFyIHF0eSA9IHRpdGxlcy5sZW5ndGg7XG5cdFx0dmFyIGN1cnJlbnQgPSAwO1xuXG5cdFx0bmV4dEJ1dHRvbi5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0O1xuXHRcdFx0Y3VycmVudCsrO1xuXHRcdFx0Y3VycmVudCA8PSAocXR5IC0gMSkgPyBjdXJyZW50IDogY3VycmVudCA9IDA7XG5cdFx0XHRfcmVuZGVyVGl0bGUoY3VycmVudCwgdGl0bGVzQXJyYXksICQoJy53b3Jrc19fbGVmdF9oZWFkZXJfaW5uZXInKSk7XG5cdFx0XHRfcmVuZGVyVGV4dChjdXJyZW50LCBkZXNjcmlwdGlvbkFycmF5LCAkKCcud29ya3NfX2xlZnRfZG9uZS13aXRoX2lubmVyJykpO1xuXHRcdH0pXG5cblx0XHRwcmV2QnV0dG9uLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQ7XG5cdFx0XHRjdXJyZW50LS07XG5cdFx0XHRjdXJyZW50IDwgMCA/IGN1cnJlbnQgPSBxdHkgLSAxIDogY3VycmVudDtcblx0XHRcdF9yZW5kZXJUaXRsZShjdXJyZW50LCB0aXRsZXNBcnJheSwgJCgnLndvcmtzX19sZWZ0X2hlYWRlcl9pbm5lcicpKTtcblx0XHRcdF9yZW5kZXJUZXh0KGN1cnJlbnQsIGRlc2NyaXB0aW9uQXJyYXksICQoJy53b3Jrc19fbGVmdF9kb25lLXdpdGhfaW5uZXInKSk7XG5cdFx0fSlcblx0fTtcblxuXHRmdW5jdGlvbiBfcmVuZGVyVGl0bGUobnVtLCBhcnJheSwgbG9jYXRpb24pIHtcblx0XHRsb2NhdGlvbi5odG1sKGFycmF5W251bV0pXG5cdFx0bG9jYXRpb24uZmluZCgnLmxldHRlcicpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcblx0XHRcdCR0aGlzID0gJCh0aGlzKTtcblxuXHRcdFx0KGZ1bmN0aW9uKGVsZW0pIHtcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRlbGVtLmFkZENsYXNzKCdhY3RpdmVMZXR0ZXInKVxuXHRcdFx0XHR9LCAyMCAqIGluZGV4KTtcblx0XHRcdH0pKCR0aGlzKTtcblxuXHRcdH0pXG5cdH1cblxuXHRmdW5jdGlvbiBfcmVuZGVyVGV4dChudW0sIGFycmF5LCBsb2NhdGlvbikge1xuXHRcdGxvY2F0aW9uLmh0bWwoYXJyYXlbbnVtXSlcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0X3Byb2Nlc3ModGl0bGVzLCB0aXRsZXNBcnJheSk7XG5cdFx0X3NhdmUoZGVzY3JpcHRpb24sIGRlc2NyaXB0aW9uQXJyYXkpO1xuXHRcdF9yZW5kZXJUaXRsZSgwLCB0aXRsZXNBcnJheSwgJCgnLndvcmtzX19sZWZ0X2hlYWRlcl9pbm5lcicpKTtcblx0XHRfcmVuZGVyVGV4dCgwLCBkZXNjcmlwdGlvbkFycmF5LCAkKCcud29ya3NfX2xlZnRfZG9uZS13aXRoX2lubmVyJykpO1xuXHRcdF9zZXRFdmVudExpc3RlbmVycygpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cblxufSgpKTtcbiIsInZhciB0YWIgPSAoZnVuY3Rpb24oKSB7XG5cblx0dmFyIGxpbmtzID0gJCgnLnRhYnNfX2NvbnRyb2wtbGluaycpO1xuXHR2YXIgdGFicyA9ICQoJy50YWJzX19saXN0LWl0ZW0nKTtcblx0dmFyIHRhYnNMaW5rID0gJCgnLnRhYnNfX2NvbnRyb2wtaXRlbScpO1xuXG5cdGZ1bmN0aW9uIF9zZXR1cEV2ZW50TGlzdGVuZXJzKCkge1xuXG5cdFx0dGFicy5lcSgwKS5hZGRDbGFzcygnYWN0aXZlVGFiJyk7XG5cdFx0dGFic0xpbmsuZXEoMCkuYWRkQ2xhc3MoJ2FjdGl2ZVRhYkxpbmsnKTtcblxuXHRcdGxpbmtzLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGFjdGl2ZSA9ICQodGhpcykucGFyZW50KCkuZGF0YSgnY2xhc3MnKTtcblx0XHRcdHRhYnMucmVtb3ZlQ2xhc3MoJ2FjdGl2ZVRhYicpO1xuXHRcdFx0dGFic0xpbmsucmVtb3ZlQ2xhc3MoJ2FjdGl2ZVRhYkxpbmsnKTtcblx0XHRcdHRhYnMuZXEoYWN0aXZlKS5hZGRDbGFzcygnYWN0aXZlVGFiJyk7XG5cdFx0XHR0YWJzTGluay5lcShhY3RpdmUpLmFkZENsYXNzKCdhY3RpdmVUYWJMaW5rJyk7XG5cdFx0fSlcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0X3NldHVwRXZlbnRMaXN0ZW5lcnMoKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG59KCkpXG4iLCJ2YXIgZGlhZ3JhbSA9IChmdW5jdGlvbigpIHtcblxuXHR2YXIgZWxlbSA9ICQoJy5za2lsbHNfX2VsZW1zJykuZXEoMCk7XG5cdHZhciBkaWFncmFtQXJyYXkgPSAkKCcuc2VjdG9yJyk7XG5cdHZhciBkaWFncmFtVmFsdWVzO1xuXG5cblx0ZnVuY3Rpb24gX3NldEV2ZW50TGlzdGVuZXJzKCkge1xuXHRcdCQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oZSkge1xuXHRcdFx0dmFyIHRvcEVkZ2UgPSAkKGVsZW0pLm9mZnNldCgpLnRvcFxuXHRcdFx0dmFyIHNjcm9sbCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblx0XHRcdHZhciBoZWlnaHQgPSAkKHdpbmRvdykuaW5uZXJIZWlnaHQoKTtcblx0XHRcdHZhciBhbmltYXRpb25TdGFydCA9IGhlaWdodCArIHNjcm9sbCAtIGhlaWdodCAvIDU7XG5cdFx0XHRpZiAoYW5pbWF0aW9uU3RhcnQgPiB0b3BFZGdlKSB7XG5cdFx0XHRcdF9hbmltYXRlKCk7XG5cdFx0XHR9XG5cdFx0fSlcblx0fVxuXG5cblx0ZnVuY3Rpb24gX2FuaW1hdGUoKSB7XG5cdFx0dmFyIG1heFZhbCA9IDI4MDtcblxuXHRcdGRpYWdyYW1BcnJheS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0JHRoaXMgPSAkKHRoaXMpO1xuXHRcdFx0dmFyIGRhdGFJZCA9ICR0aGlzLmRhdGEoJ2RpYWdyYW0nKTtcblx0XHRcdHZhciBlbGVtVmFsdWUgPSBkaWFncmFtVmFsdWVzW2RhdGFJZF07XG5cdFx0XHR2YXIgZGFzaCA9IChlbGVtVmFsdWUgLyAxMDApICogbWF4VmFsO1xuXG5cdFx0XHQkdGhpcy5jc3Moe1xuXHRcdFx0XHQnc3Ryb2tlLWRhc2hhcnJheSc6IGRhc2ggKyAnICcgKyBtYXhWYWxcblx0XHRcdH0pXG5cblx0XHR9KVxuXHR9XG5cblxuXHRmdW5jdGlvbiBfZ2V0VmFsdWVzKCkge1xuXHRcdCQuZ2V0KCcvZ2V0ZGlhZ3JhbScsIGZ1bmN0aW9uKGRhdGEpIHt9KS5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdGRpYWdyYW1WYWx1ZXMgPSBkYXRhWzBdO1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRfZ2V0VmFsdWVzKCk7XG5cdFx0X3NldEV2ZW50TGlzdGVuZXJzKCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxufSgpKTtcbiIsInZhciBzY3JvbGxBcnJvdyA9IChmdW5jdGlvbigpIHtcblxuXHRmdW5jdGlvbiBfc2V0RXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0JCgnLmFycm93LWRvd24taWNvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGhlaWdodCA9ICQod2luZG93KS5pbm5lckhlaWdodCgpO1xuXHRcdFx0JCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuXHRcdFx0XHRzY3JvbGxUb3A6IGhlaWdodFxuXHRcdFx0fSwgMzUwKTtcblx0XHR9KVxuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRfc2V0RXZlbnRMaXN0ZW5lcnMoKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG5cbn0oKSk7XG4iLCJ2YXIgbW9kYWwgPSAoZnVuY3Rpb24oKSB7XG5cblx0dmFyIG1vZGFsID0gJCgnLm1vZGFsLWNvbnRhaW5lcicpO1xuXHR2YXIgc2F2ZUJ1dHRvbiA9ICQoJy5hZG1pbi1idXR0b24gJyk7XG5cdHZhciBtb2RhbEJ1dHRvbiA9ICQoJyNtb2RhbE9rJyk7XG5cblx0ZnVuY3Rpb24gX3NldHVwRXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0c2F2ZUJ1dHRvbi5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0O1xuXHRcdFx0bW9kYWwuY3NzKHtcblx0XHRcdFx0J2Rpc3BsYXknOiAnYmxvY2snXG5cdFx0XHR9KVxuXHRcdH0pXG5cblx0XHRtb2RhbEJ1dHRvbi5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRtb2RhbC5jc3Moe1xuXHRcdFx0XHQnZGlzcGxheSc6ICdub25lJ1xuXHRcdFx0fSlcblx0XHR9KVxuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRfc2V0dXBFdmVudExpc3RlbmVycygpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cbn0oKSlcbiIsImZ1bmN0aW9uIG5hdmlnYXRpb24oKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0JCgnI25hdi1pY29uJykuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0JCh0aGlzKS50b2dnbGVDbGFzcygnb3BlbicpO1xuXHRcdCQoJyNvdmVybGF5JykudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcblx0fSk7XG59O1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblxuXHR2YXIgcGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcblxuXHRwcmVsb2FkZXIuaW5pdCgpO1xuXHRuYXZpZ2F0aW9uKCk7XG5cblx0aWYgKHBhdGggPT09ICcvJyB8fCBwYXRoID09PSAnL2luZGV4Lmh0bWwnKSB7XG5cdFx0cGFyYWxsYXguaW5pdCgpO1xuXHRcdGZsaXBwZXIuaW5pdCgpO1xuXHR9IGVsc2Uge1xuXHRcdHNjcm9sbC5pbml0KCk7XG5cdH1cblxuXHRpZiAocGF0aCA9PT0gJy9ibG9nLmh0bWwnIHx8IHBhdGggPT09ICcvYmxvZycpIHtcblx0XHRibG9nTmF2LmluaXQoKTtcblx0fVxuXG5cdGlmIChwYXRoID09PSAnL3dvcmtzLmh0bWwnIHx8IHBhdGggPT09ICcvd29ya3MnKSB7XG5cdFx0c2xpZGVyLmluaXQoKTtcblx0XHRzbGlkZXJUZXh0LmluaXQoKTtcblx0XHRibHVyUG9zaXRpb24uaW5pdCgpO1xuXHR9XG5cblx0aWYgKHBhdGggPT09ICcvYWJvdXRtZS5odG1sJyB8fCBwYXRoID09PSAnL2Fib3V0bWUnKSB7XG5cdFx0Z29vZ2xlTWFwLmluaXQoKTtcblx0XHRkaWFncmFtLmluaXQoKTtcblx0fVxuXG5cdGlmIChwYXRoID09PSAnL2FkbWluLmh0bWwnIHx8IHBhdGggPT09ICcvYWRtaW4nKSB7XG5cdFx0dGFiLmluaXQoKTtcblx0fVxuXG5cdGlmIChwYXRoICE9PSAnYWRtaW4nKSB7XG5cdFx0c2Nyb2xsQXJyb3cuaW5pdCgpO1xuXHRcdG1vZGFsLmluaXQoKTtcblx0fVxuXG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
