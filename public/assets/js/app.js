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

  var sideBar = $('.blog-menu');
  var sideBarElem = $('.blog-menu-elem');
  var section = $('.blog-article');

  function _setUpEventListeners() {
    $(window).scroll(function() {
      _scrolled()
    });

    sideBarElem.on('click', function() {
      var id = $(this).data('id');
      var top = $(section.eq(id)).offset().top;

      $('body').animate({
        scrollTop: top
      }, 300);
    });
  }

  function _scrolled() {
    var scroll = $(window).scrollTop();

    var menuTopPos = $(section.eq(0)).offset().top - scroll;
    if (menuTopPos < 10) {
      $(sideBar).addClass('fixed');
    } else {
      $(sideBar).removeClass('fixed');
    }

    section.each(function (index, elem) {
      var elemBottom = $(elem).offset().top + $(elem).height() + 100;
      var windowBottom = scroll + $(window).height();
      var elemBottomPos = windowBottom - elemBottom;
      var elemTopPos = $(elem).offset().top - scroll;

      if (elemTopPos < 200 || elemBottomPos > 0) {
        sideBarElem.removeClass('active');
        sideBarElem.eq(index).addClass('active');
      }
    })
  }

  function init() {
    $(sideBarElem.eq(0)).addClass('active');
    _setUpEventListeners();
  }

  return {
    init: init
  }
})();

var preloader = (function() {

	var
	// массив для всех изображений на странице
		_imgs = [],

		// будет использоваться из других модулей, чтобы проверить, отрисованы ли все элементы
		// т.к. document.ready из-за прелоадера срабатывает раньше, когда отрисован прелоадер, а не вся страница
		contentReady = $.Deferred();

	function init() {
		_countImages();
		_startPreloader();
	}

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
	}

	function _startPreloader() {

		$('body').addClass('overflow-hidden');

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

		}
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
			$('.preloader_container').delay(700).fadeOut(500);
			$('body').removeClass('overflow-hidden');
			_finishPreloader();
		}
	}

	function _finishPreloader() {
		contentReady.resolve();
	}

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
					var widthPosition = w * (key / 80); // Вычисляем коофицент смешения по X
					var heightPosition = h * (key / 80); // Вычисляем коофицент смешения по Y
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
		var authElem = $('.authorize');
		var flipElem = $('.flip');
		var outsideElem = $('.parallax__layer');
		var back = $('#backToMain');


		outsideElem.click(function(e) {
			if(e.target.id != 'authorize' && e.target.id != 'authorize_div') {
				authElem.fadeIn(300);
				flipElem.removeClass('flipping')
			}
		});

		authElem.click(function(e) {
			e.preventDefault();
			authElem.fadeOut(300);
			flipElem.toggleClass('flipping')
		});

		back.click(function(e) {
			e.preventDefault();
			flipElem.removeClass('flipping');
			authElem.fadeIn(300);
		})
	}

	return {
		init: init
	}
}());

var scroll = (function() {

	function init() {

			var layers = $('.parallax-scroll__layer'); // Выбираем все parallax__layer в объект
			var main = $('.main');

			$(window).on('scroll', function() {
				var scrollTop = $(window).scrollTop();

				layers.map(function(key, value) {
					var bottomPosition = scrollTop * key / 90;
					var heightPosition = -scrollTop * key / 90;

					$(value).css({
						'top': '-' + bottomPosition + 'px',
						'transform': 'translate3d(0,' + heightPosition + 'px, 0)' // Используем translate3d для более лучшего рендеринга на странице
					})
				});

				var topPos = scrollTop / 7;
				var bottomPos = -scrollTop / 7;
				main.css({
					'top': '-' + topPos + 'px',
					'transform': 'translate3d(0,' + bottomPos + 'px, 0)'
				})
			})
	}

	return {
		init: init
	}

}());

var slider = (function() {

	//Arrays of images in each slider part
	var mainImages = $('.slider__main-img_container');
	var prevImages = $('.nextSlideImg');
	var nextImages = $('.prevSlideImg');

	// Control buttons
	var nextSlide = $('.slider__next');
	var prevSlide = $('.slider__prev');
	var current = 0;

	var time = 200;
	var anotherState;
	var flag = true;

	// Render function for Main slider part
	var currentSlide = 0;
	function _renderMain(change) {
		anotherState = $.Deferred();

		mainImages.eq(currentSlide).fadeOut(150);

		if(change === 'increase') {
			currentSlide++;
			currentSlide = currentSlide > mainImages.length - 1 ? 0 : currentSlide;
		} else if(change === 'decrease') {
			currentSlide--;
			currentSlide = currentSlide < 0 ? mainImages.length - 1 : currentSlide;
		}

		mainImages.eq(currentSlide).delay(100).fadeIn(150, function() {
			anotherState.resolve();
		});
	}


	var currentNext = 1;
	function _sliderNextButtonNext() {
			nextImages.eq(currentNext).animate({
				top: '-100%'
			}, time );

			currentNext++;
			currentNext = currentNext > mainImages.length - 1 ? 0 : currentNext;

			nextImages.eq(currentNext).animate({
				display: 'none',
				top: '100%'
			}, 0, function() {
				nextImages.eq(currentNext).css('display', 'block');
			});

			nextImages.eq(currentNext).animate({
				top: '0'
			}, time);
	}

	function _sliderNextButtonPrev() {
		nextImages.eq(currentNext).animate({
			top: '+100%'
		}, time );

		currentNext--;
		currentNext = currentNext < 0 ? mainImages.length - 1 : currentNext;

		nextImages.eq(currentNext).animate({
			display: 'none',
			top: '-100%'
		}, 0, function() {
			nextImages.eq(currentNext).css('display', 'block');
		});

		nextImages.eq(currentNext).animate({
			top: '0'
		}, time);
	}


	var currentPrev = mainImages.length - 1;
	function _sliderPrevButtonNext() {
		prevImages.eq(currentPrev).animate({
			top: '+100%'
		}, time );

		currentPrev++;
		currentPrev = currentPrev > mainImages.length - 1 ? 0 : currentPrev;

		prevImages.eq(currentPrev).animate({
			display: 'none',
			top: '-100%'
		}, 0, function() {
			prevImages.eq(currentPrev).css('display', 'block');
		});

		prevImages.eq(currentPrev).animate({
			top: '0'
		}, time);
	}

	function _sliderPrevButtonPrev() {
		prevImages.eq(currentPrev).animate({
			top: '-100%'
		}, time );

		currentPrev--;
		currentPrev = currentPrev < 0 ? mainImages.length - 1 : currentPrev;

		prevImages.eq(currentPrev).animate({
			display: 'none',
			top: '+100%'
		}, 0, function() {
			prevImages.eq(currentPrev).css('display', 'block');
		});

		prevImages.eq(currentPrev).animate({
			top: '0'
		}, time);
	}


	nextSlide.click(function() {
		$.when(_renderMain('increase'), _sliderNextButtonNext(), _sliderPrevButtonNext(),anotherState).done(function () {
			console.log('increased');
		});
	});

	prevSlide.click(function() {
		$.when(_renderMain('decrease'), _sliderNextButtonPrev(), _sliderPrevButtonPrev(),anotherState).done(function () {
			console.log('decreased');
		});
	});


	function init() {
		mainImages.fadeOut(30);
		mainImages.eq(0).fadeIn(30);

		prevImages.eq((mainImages.length - 1)).css({
			'top': '0'
		});
		nextImages.eq(1).css({
			'top': '0'
		});
	}

	return {
		init: init
	}
}());



// var slider = (function() {
//
// 	function init() {
//
// 		var main = $('.works__right_top_img');
// 		var prev = $('.works__right_bottom_left_img');
// 		var next = $('.works__right_bottom_right_img');
// 		var mainSlide = $('.works__right_top');
// 		var prevSlide = $('.works__right_bottom_left');
// 		var nextSlide = $('.works__right_bottom_right');
// 		var lastNum = main.length - 1;
//
// 		if (main.length != prev.length || main.length != next.length) {
// 			console.error('Different number of pictures in blocks');
// 		}
//
// 		main.css({
// 			'top': '0',
// 			'opacity': '0'
// 		});
// 		main.eq(0).css({
// 			'top': '0',
// 			'opacity': '1'
// 		});
// 		prev.eq(lastNum).css({
// 			'top': '0'
// 		});
// 		next.eq(1).css({
// 			'top': '0'
// 		});
//
// 		var cssSetup = {
// 			next: {
// 				prev: {
// 					'z-index': '0',
// 					'top': '100%',
// 					'transition-property': 'top',
// 					'transition-duration': '.09s'
// 				},
// 				curr: {
// 					'top': '-100%',
// 					'transition-property': 'top',
// 					'transition-duration': '.25s'
// 				},
// 				next: {
// 					'top': '0',
// 					'z-index': '10',
// 					'transition-property': 'top',
// 					'transition-duration': '.25s'
// 				}
// 			},
// 			prev: {
// 				prev: {
// 					'z-index': '0',
// 					'top': '-100%',
// 					'transition-property': 'top',
// 					'transition-duration': '.09s'
// 				},
// 				curr: {
// 					'top': '100%',
// 					'transition-property': 'top',
// 					'transition-duration': '.25s'
// 				},
// 				next: {
// 					'top': '0',
// 					'z-index': '10',
// 					'transition-property': 'top',
// 					'transition-duration': '.25s'
// 				}
// 			},
// 			main: {
// 				prev: {
// 					'opacity': '0',
// 					'transition-property': 'opacity',
// 					'transition-duration': '.2s'
// 				},
// 				curr: {
// 					'opacity': '1',
// 					'transition-property': 'opacity',
// 					'transition-duration': '.2s'
// 				}
// 			}
// 		};
//
// 		var ctrl = (function() {
// 			nextSlide.click(function(e) {
// 				e.preventDefault();
// 				nextSlide.renderNext();
// 				prevSlide.renderNext();
// 				mainSLideB.renderNext();
// 			});
// 			prevSlide.click(function(e) {
// 				e.preventDefault();
// 				nextSlide.renderPrev();
// 				prevSlide.renderPrev();
// 				mainSLideB.renderPrev()
// 			});
// 			mainSlide.click(function(e) {
// 				e.preventDefault();
// 			})
// 		})();
//
// 		function Slide(slide, cssSetup, slideNum) {
// 			var that = this;
// 			this.test = 0;
// 			this.slide = slide;
// 			this.cssSetup = cssSetup;
// 			this.slideNum = slideNum;
//
// 			this.renderNext = function() {
// 				this.slideNum += 1;
// 				if (this.slideNum === 4) {
// 					this.slideNum = 0;
// 				}
// 				this.slide.eq(this.slideNum).css(this.cssSetup.prev);
// 				this.slide.eq(this.slideNum).one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
// 					function() {
// 						that.slide.eq(that.slideNum - 1).css(that.cssSetup.curr);
// 						that.slide.eq(that.slideNum).css(that.cssSetup.next);
// 					});
// 			};
//
// 			this.renderPrev = function() {
// 				this.slideNum -= 1;
// 				if (this.slideNum === -1) this.slideNum = 3;
// 				this.slide.eq(this.slideNum).css(cssSetup.prev);
// 				this.slide.eq(this.slideNum).one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
// 					function() {
// 						if (that.slideNum === 3) {
// 							that.test = -1;
// 						} else {
// 							that.test = that.slideNum;
// 						}
// 						that.slide.eq(that.test + 1).css(that.cssSetup.curr);
// 						that.slide.eq(that.slideNum).css(that.cssSetup.next);
// 					});
// 			};
// 		}
//
// 		function MainSlideBlock(slide, cssSetup, slideNum, lastNum) {
// 			var that = this;
// 			this.lastNum = lastNum;
// 			this.slide = slide;
// 			this.cssSetup = cssSetup;
// 			this.slideNum = slideNum;
// 			this.num = 0;
//
// 			this.renderNext = function() {
// 				this.slideNum += 1;
// 				if (this.slideNum === this.lastNum + 1) this.slideNum = 0;
//
// 				this.slide.eq(this.slideNum - 1).css(this.cssSetup.prev);
//
// 				this.slide.eq(this.slideNum - 1).one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
// 					function() {
// 						that.slide.eq(that.slideNum).css(that.cssSetup.curr)
// 					});
// 			};
//
// 			this.renderPrev = function() {
// 				this.slideNum -= 1;
//
// 				if (this.slideNum === -1) {
// 					this.num = 0;
// 				} else {
// 					this.num = this.slideNum + 1;
// 				}
// 				this.slide.eq(this.num).css(this.cssSetup.prev);
// 				this.slide.eq(this.num).one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
// 					function() {
// 						if (that.slideNum === -1) {
// 							that.slideNum = that.lastNum;
// 						}
// 						that.slide.eq(that.slideNum).css(that.cssSetup.curr);
// 					});
// 			};
// 		}
//
// 		var mainSLideB;
// 		mainSLideB = new MainSlideBlock(main, cssSetup.main, 0, lastNum);
// 		nextSlide = new Slide(next, cssSetup.next, 1);
// 		prevSlide = new Slide(prev, cssSetup.prev, lastNum)
//
// 	}
//
// 	return {
// 		init: init
// 	}
// }())

var sliderText = (function() {
	var titlesContainer = $('.works__left_header');
	var titles = $('.works__left_header_inner');
	var titleElem = $('.works__left_header_inner').eq(0);

	var descriptionContainer = $('.works__left_done-with');
	var description = $('.works__left_done-with_inner');
	var descriptionElem = $('.works__left_done-with_inner').eq(0);

	//control buttons
	var nextButton = $('.slider__next');
	var prevButton = $('.slider__prev');

	//arrays with titles and description
	var titlesArray = [];
	var descriptionArray = [];

	// Saves all titles into array
	function _processTitles(titles, array) {
		titles.each(function() {
			$this = $(this);
			var text = $this.text();
			$this.html('');
			array.push(_spanify(text));
		});

		//removes all elements except one from DOM
		descriptionContainer.empty();
		descriptionContainer.append(descriptionElem);
		titlesContainer.empty();
		titlesContainer.append(titleElem);
	}

	// Saves all descriptions into array
	function _processDescription(titles, array) {
		titles.each(function() {
			var text = $(this).html();
			array.push(text)
		})
	}

	// Function adds span with .word class to each word and span with .letter class
	// to each letter
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

	//Shows selected title
	function _renderTitle(num, array, elem) {
		elem.html(array[num]);
		elem.find('.letter').each(function(index) {
			$this = $(this);

			(function(elem) {
				setTimeout(function() {
					elem.addClass('activeLetter')
				}, 10 * index);
			})($this);

		})
	}

	//Shows selected description
	function _renderDescription(num, array, elem) {
		elem.html(array[num])
	}

	function _setEventListeners() {
		var qty = titles.length;
		var counter = 0;

		nextButton.click(function() {
			counter++;
			counter = counter <= (qty - 1) ? counter : 0;
			_renderTitle(counter, titlesArray, titleElem);
			_renderDescription(counter, descriptionArray, descriptionElem);
		});

		prevButton.click(function() {
			counter--;
			counter = counter < 0 ? (qty - 1) : counter;
			_renderTitle(counter, titlesArray, titleElem);
			_renderDescription(counter, descriptionArray, descriptionElem);
		})
	}

	function init() {
		_processTitles(titles, titlesArray);
		_processDescription(description, descriptionArray);
		_renderTitle(0, titlesArray, titleElem);
		_renderDescription(0, descriptionArray, descriptionElem);
		_setEventListeners();
	}

	return {
		init: init
	}

}());

var tab = (function() {

	var tabs = $('.tabs__list-item');
	var tabsLink = $('.tabs__control-item');

	function _setupEventListeners() {
		tabs.eq(0).addClass('activeTab');
		tabsLink.eq(0).addClass('activeTabLink');

		tabsLink.on('click', function() {
			var active = $(this).data('class');
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
}());

var diagram = (function() {

	var elem = $('.skills__elems').eq(0);
	var diagramArray = $('.sector');
	var diagramValues;

	function _setEventListeners() {
		$(window).scroll(function() {
			var topEdge = $(elem).offset().top;
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
			var $this = $(this);
			var dataId = $this.data('diagram');
			var elemValue = diagramValues[dataId];
			var dash = (elemValue / 100) * maxVal;
			$this.css({
				'stroke-dasharray': dash + ' ' + maxVal
			})

		})
	}

	function _getValues() {
		$.get('/getdiagram', function(data) {
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
			}, 800);
		})
	}

	function init() {
		_setEventListeners();
	}

	return {
		init: init
	}

}());

var validation = (function() {

  var modalContainerRobot = $('#index-modal-container-robots');
  var modalContainerField = $('#index-modal-container-field');
  var allModals = $('.index-modal-container');
  var activeModal = 'index-modal-active';
  var isHuman = $('#isHuman');
  var notRobot = $('#radio1');
  var login = $('#index_login');
  var pass = $('#index_pass');

  function init() {
    _setUpEventListeners();
  }

  function _setUpEventListeners() {

    $('#authorize').click(function(e) {
      e.preventDefault();

      if(!isHuman.prop('checked') || !notRobot.prop('checked')) {
        _showModal(modalContainerRobot);
      } else if (login.val() === '' || pass.val() === '') {
        _showModal(modalContainerField);
      } else {
          var form = $('.auth_form');
          var defObj = _ajaxForm(form, './login');
          if (defObj) {
            defObj.done(function(res) {
              var status = res.status;
              if (status === 'OK'){
                window.location.href = '/admin';
              }
            });
            defObj.fail(function(res){
              console.error(res)
            })
          }
        }
    });

    $('.index-modal-block-button').click(function(e) {
      e.preventDefault();
      _hideModal(allModals);
    })
  }

  function _showModal(element) {
    element.addClass(activeModal);
  }
  function _hideModal(element) {
    element.removeClass(activeModal)
  }
  function _ajaxForm(form, url){
    var data = form.serialize();
    var defObj = $.ajax({
      type : "POST",
      url : url,
      data: data
    });

    return defObj;
  }

  return {
    init: init
  }
}());
var admin = (function() {

  var modal = $('.modal-container');
  var okButton = $('.modalOk');
  var backToMain = $('.admin_header_return');
  var saveDiagram = $('#saveDiagram');

  function _showModal(result) {
    if (result === 'success') {
      modal.eq(0).css('display', 'block');
    } else {
      modal.eq(1).css('display', 'block');
    }
  }

  function _logOut() {
    defObj = $.ajax({
      type: "POST",
      url: './logout'
    }).fail(function () {
      console.log('error');
    }).complete(function () {
      window.location.href = '/';
    })
  }

  function _addNewWork() {
    var formData = new FormData($('#uploadForm')[0]);

    $.ajax({
      type: "POST",
      processData: false,
      contentType: false,
      url: "./upload",
      data:  formData
      })
      .done(function() {
        _showModal('success')
      }).fail(function() {
      _showModal('fail')
    })
  }

  function _postDiagramValues() {
    var elements = $('.tabs__list_block-elem');
    var text = $('.tabs__list-text');
    var value = $('.tabs__list-input');
    var diagramValues = {};

    elements.each(function () {
      var name = $(this).find(text).text().toLowerCase().replace('.', '');
      diagramValues[name] = $(this).find(value).val();
    });

    $.post("/diagram", diagramValues).done(function () {
      _showModal('success')
    }).fail(function () {
      _showModal('fail')
    })
  }

  function _setupEventListeners() {
    okButton.click(function () {
      modal.css('display', 'none')
    });

    backToMain.click(_logOut);
    saveDiagram.click(_postDiagramValues);

    $('#uploadForm').on('submit', function(e) {
      e.preventDefault();
			console.log('qweqweqwe')
      _addNewWork();
    });

    $('#blogPost').on('submit', function(e) {
      e.preventDefault();
      var data = $(this).serialize();

      $.post("./addblogpost", data).done(function() {
        _showModal('success')
				$('#blogPost')[0].reset();
      }).fail(function() {
        _showModal('fail')
      });
    })
  }

  function init() {
    _setupEventListeners();
  }

  return {
    init: init
  }
}());

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
		validation.init();
	} else {
		scroll.init();
	}

	if (path === '/blog.html' || path === '/blog') {
		blogNav.init();
	}

	if (path === '/works.html' || path === '/works') {
		slider.init();
		sliderText.init();
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
		admin.init();
	}

});

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdvb2dsZU1hcC5qcyIsImJsb2dOYXYuanMiLCJwcmVsb2FkZXIuanMiLCJwYXJhbGxheC5qcyIsImZsaXBwZXIuanMiLCJzY3JvbGwuanMiLCJzbGlkZXIuanMiLCJzbGlkZXJUZXh0LmpzIiwidGFiLmpzIiwiZGlhZ3JhbS5qcyIsInNjcm9sbEFycm93LmpzIiwidmFsaWRhdGlvbi5qcyIsImFkbWluLmpzIiwiYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3RWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGdvb2dsZS5tYXBzLmV2ZW50LmFkZERvbUxpc3RlbmVyKHdpbmRvdywgJ2xvYWQnLCBpbml0KTtcblxudmFyIGdvb2dsZU1hcCA9IChmdW5jdGlvbigpIHtcblxuXHR2YXIgbWFwO1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0dmFyIG1hcE9wdGlvbnMgPSB7XG5cdFx0XHRjZW50ZXI6IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoNTkuMjk5Mzc2LCAyNi41MzA3MjMpLFxuXHRcdFx0em9vbTogNCxcblx0XHRcdHpvb21Db250cm9sOiB0cnVlLFxuXHRcdFx0em9vbUNvbnRyb2xPcHRpb25zOiB7XG5cdFx0XHRcdHN0eWxlOiBnb29nbGUubWFwcy5ab29tQ29udHJvbFN0eWxlLkRFRkFVTFQsXG5cdFx0XHR9LFxuXHRcdFx0ZGlzYWJsZURvdWJsZUNsaWNrWm9vbTogdHJ1ZSxcblx0XHRcdG1hcFR5cGVDb250cm9sOiBmYWxzZSxcblx0XHRcdHNjYWxlQ29udHJvbDogZmFsc2UsXG5cdFx0XHRzY3JvbGx3aGVlbDogZmFsc2UsXG5cdFx0XHRwYW5Db250cm9sOiBmYWxzZSxcblx0XHRcdHN0cmVldFZpZXdDb250cm9sOiBmYWxzZSxcblx0XHRcdGRyYWdnYWJsZTogZmFsc2UsXG5cdFx0XHRvdmVydmlld01hcENvbnRyb2w6IGZhbHNlLFxuXHRcdFx0b3ZlcnZpZXdNYXBDb250cm9sT3B0aW9uczoge1xuXHRcdFx0XHRvcGVuZWQ6IGZhbHNlLFxuXHRcdFx0fSxcblx0XHRcdG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVAsXG5cdFx0XHRzdHlsZXM6IFt7XG5cdFx0XHRcdFwiZmVhdHVyZVR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZVwiLFxuXHRcdFx0XHRcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXG5cdFx0XHRcdFwic3R5bGVyc1wiOiBbe1xuXHRcdFx0XHRcdFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuXHRcdFx0XHR9XVxuXHRcdFx0fSwge1xuXHRcdFx0XHRcImZlYXR1cmVUeXBlXCI6IFwibGFuZHNjYXBlXCIsXG5cdFx0XHRcdFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuXHRcdFx0XHRcInN0eWxlcnNcIjogW3tcblx0XHRcdFx0XHRcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFwiY29sb3JcIjogXCIjZmNmY2ZjXCJcblx0XHRcdFx0fV1cblx0XHRcdH0sIHtcblx0XHRcdFx0XCJmZWF0dXJlVHlwZVwiOiBcInBvaVwiLFxuXHRcdFx0XHRcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcblx0XHRcdFx0XCJzdHlsZXJzXCI6IFt7XG5cdFx0XHRcdFx0XCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcImNvbG9yXCI6IFwiI2ZjZmNmY1wiXG5cdFx0XHRcdH1dXG5cdFx0XHR9LCB7XG5cdFx0XHRcdFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmhpZ2h3YXlcIixcblx0XHRcdFx0XCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG5cdFx0XHRcdFwic3R5bGVyc1wiOiBbe1xuXHRcdFx0XHRcdFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XCJjb2xvclwiOiBcIiNkZGRkZGRcIlxuXHRcdFx0XHR9XVxuXHRcdFx0fSwge1xuXHRcdFx0XHRcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5hcnRlcmlhbFwiLFxuXHRcdFx0XHRcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcblx0XHRcdFx0XCJzdHlsZXJzXCI6IFt7XG5cdFx0XHRcdFx0XCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcImNvbG9yXCI6IFwiI2RkZGRkZFwiXG5cdFx0XHRcdH1dXG5cdFx0XHR9LCB7XG5cdFx0XHRcdFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmxvY2FsXCIsXG5cdFx0XHRcdFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuXHRcdFx0XHRcInN0eWxlcnNcIjogW3tcblx0XHRcdFx0XHRcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFwiY29sb3JcIjogXCIjZWVlZWVlXCJcblx0XHRcdFx0fV1cblx0XHRcdH0sIHtcblx0XHRcdFx0XCJmZWF0dXJlVHlwZVwiOiBcIndhdGVyXCIsXG5cdFx0XHRcdFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuXHRcdFx0XHRcInN0eWxlcnNcIjogW3tcblx0XHRcdFx0XHRcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFwiY29sb3JcIjogXCIjMDBiZmE1XCJcblx0XHRcdFx0fV1cblx0XHRcdH1dLFxuXHRcdH1cblx0XHR2YXIgbWFwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKTtcblx0XHR2YXIgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChtYXBFbGVtZW50LCBtYXBPcHRpb25zKTtcblx0XHR2YXIgbG9jYXRpb25zID0gW1xuXHRcdFx0WydPbGVnIEtvcm9sa28nLCAndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcsICcnLCAndW5kZWZpbmVkJywgNTkuOTM0MjgwMiwgMzAuMzM1MDk4NjAwMDAwMDM4LCAnaHR0cHM6Ly9tYXBidWlsZHIuY29tL2Fzc2V0cy9pbWcvbWFya2Vycy9lbGxpcHNlLXJlZC5wbmcnXVxuXHRcdF07XG5cdFx0Zm9yIChpID0gMDsgaSA8IGxvY2F0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKGxvY2F0aW9uc1tpXVsxXSA9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRkZXNjcmlwdGlvbiA9ICcnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGVzY3JpcHRpb24gPSBsb2NhdGlvbnNbaV1bMV07XG5cdFx0XHR9XG5cdFx0XHRpZiAobG9jYXRpb25zW2ldWzJdID09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHRlbGVwaG9uZSA9ICcnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGVsZXBob25lID0gbG9jYXRpb25zW2ldWzJdO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGxvY2F0aW9uc1tpXVszXSA9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRlbWFpbCA9ICcnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZW1haWwgPSBsb2NhdGlvbnNbaV1bM107XG5cdFx0XHR9XG5cdFx0XHRpZiAobG9jYXRpb25zW2ldWzRdID09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHdlYiA9ICcnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0d2ViID0gbG9jYXRpb25zW2ldWzRdO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGxvY2F0aW9uc1tpXVs3XSA9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRtYXJrZXJpY29uID0gJyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtYXJrZXJpY29uID0gbG9jYXRpb25zW2ldWzddO1xuXHRcdFx0fVxuXHRcdFx0bWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG5cdFx0XHRcdGljb246IG1hcmtlcmljb24sXG5cdFx0XHRcdHBvc2l0aW9uOiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxvY2F0aW9uc1tpXVs1XSwgbG9jYXRpb25zW2ldWzZdKSxcblx0XHRcdFx0bWFwOiBtYXAsXG5cdFx0XHRcdHRpdGxlOiBsb2NhdGlvbnNbaV1bMF0sXG5cdFx0XHRcdGRlc2M6IGRlc2NyaXB0aW9uLFxuXHRcdFx0XHR0ZWw6IHRlbGVwaG9uZSxcblx0XHRcdFx0ZW1haWw6IGVtYWlsLFxuXHRcdFx0XHR3ZWI6IHdlYlxuXHRcdFx0fSk7XG5cdFx0XHRsaW5rID0gJyc7XG5cdFx0XHRiaW5kSW5mb1dpbmRvdyhtYXJrZXIsIG1hcCwgbG9jYXRpb25zW2ldWzBdLCBkZXNjcmlwdGlvbiwgdGVsZXBob25lLCBlbWFpbCwgd2ViLCBsaW5rKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBiaW5kSW5mb1dpbmRvdyhtYXJrZXIsIG1hcCwgdGl0bGUsIGRlc2MsIHRlbGVwaG9uZSwgZW1haWwsIHdlYiwgbGluaykge1xuXHRcdFx0dmFyIGluZm9XaW5kb3dWaXNpYmxlID0gKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgY3VycmVudGx5VmlzaWJsZSA9IGZhbHNlO1xuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24odmlzaWJsZSkge1xuXHRcdFx0XHRcdGlmICh2aXNpYmxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdGN1cnJlbnRseVZpc2libGUgPSB2aXNpYmxlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gY3VycmVudGx5VmlzaWJsZTtcblx0XHRcdFx0fTtcblx0XHRcdH0oKSk7XG5cdFx0XHRpdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KCk7XG5cdFx0XHRnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoaW5mb1dpbmRvd1Zpc2libGUoKSkge1xuXHRcdFx0XHRcdGl3LmNsb3NlKCk7XG5cdFx0XHRcdFx0aW5mb1dpbmRvd1Zpc2libGUoZmFsc2UpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhciBodG1sID0gXCI8ZGl2IHN0eWxlPSdjb2xvcjojMDAwO2JhY2tncm91bmQtY29sb3I6I2ZmZjtwYWRkaW5nOjVweDt3aWR0aDoxNTBweDsnPjwvZGl2PlwiO1xuXHRcdFx0XHRcdGl3ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xuXHRcdFx0XHRcdFx0Y29udGVudDogaHRtbFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGl3Lm9wZW4obWFwLCBtYXJrZXIpO1xuXHRcdFx0XHRcdGluZm9XaW5kb3dWaXNpYmxlKHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKGl3LCAnY2xvc2VjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpbmZvV2luZG93VmlzaWJsZShmYWxzZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG5cblx0fSgpKVxuIiwidmFyIGJsb2dOYXYgPSAoZnVuY3Rpb24oKSB7XG5cbiAgdmFyIHNpZGVCYXIgPSAkKCcuYmxvZy1tZW51Jyk7XG4gIHZhciBzaWRlQmFyRWxlbSA9ICQoJy5ibG9nLW1lbnUtZWxlbScpO1xuICB2YXIgc2VjdGlvbiA9ICQoJy5ibG9nLWFydGljbGUnKTtcblxuICBmdW5jdGlvbiBfc2V0VXBFdmVudExpc3RlbmVycygpIHtcbiAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xuICAgICAgX3Njcm9sbGVkKClcbiAgICB9KTtcblxuICAgIHNpZGVCYXJFbGVtLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGlkID0gJCh0aGlzKS5kYXRhKCdpZCcpO1xuICAgICAgdmFyIHRvcCA9ICQoc2VjdGlvbi5lcShpZCkpLm9mZnNldCgpLnRvcDtcblxuICAgICAgJCgnYm9keScpLmFuaW1hdGUoe1xuICAgICAgICBzY3JvbGxUb3A6IHRvcFxuICAgICAgfSwgMzAwKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9zY3JvbGxlZCgpIHtcbiAgICB2YXIgc2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgdmFyIG1lbnVUb3BQb3MgPSAkKHNlY3Rpb24uZXEoMCkpLm9mZnNldCgpLnRvcCAtIHNjcm9sbDtcbiAgICBpZiAobWVudVRvcFBvcyA8IDEwKSB7XG4gICAgICAkKHNpZGVCYXIpLmFkZENsYXNzKCdmaXhlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKHNpZGVCYXIpLnJlbW92ZUNsYXNzKCdmaXhlZCcpO1xuICAgIH1cblxuICAgIHNlY3Rpb24uZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsZW0pIHtcbiAgICAgIHZhciBlbGVtQm90dG9tID0gJChlbGVtKS5vZmZzZXQoKS50b3AgKyAkKGVsZW0pLmhlaWdodCgpICsgMTAwO1xuICAgICAgdmFyIHdpbmRvd0JvdHRvbSA9IHNjcm9sbCArICQod2luZG93KS5oZWlnaHQoKTtcbiAgICAgIHZhciBlbGVtQm90dG9tUG9zID0gd2luZG93Qm90dG9tIC0gZWxlbUJvdHRvbTtcbiAgICAgIHZhciBlbGVtVG9wUG9zID0gJChlbGVtKS5vZmZzZXQoKS50b3AgLSBzY3JvbGw7XG5cbiAgICAgIGlmIChlbGVtVG9wUG9zIDwgMjAwIHx8IGVsZW1Cb3R0b21Qb3MgPiAwKSB7XG4gICAgICAgIHNpZGVCYXJFbGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgc2lkZUJhckVsZW0uZXEoaW5kZXgpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAkKHNpZGVCYXJFbGVtLmVxKDApKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgX3NldFVwRXZlbnRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdDogaW5pdFxuICB9XG59KSgpO1xuIiwidmFyIHByZWxvYWRlciA9IChmdW5jdGlvbigpIHtcblxuXHR2YXJcblx0Ly8g0LzQsNGB0YHQuNCyINC00LvRjyDQstGB0LXRhSDQuNC30L7QsdGA0LDQttC10L3QuNC5INC90LAg0YHRgtGA0LDQvdC40YbQtVxuXHRcdF9pbWdzID0gW10sXG5cblx0XHQvLyDQsdGD0LTQtdGCINC40YHQv9C+0LvRjNC30L7QstCw0YLRjNGB0Y8g0LjQtyDQtNGA0YPQs9C40YUg0LzQvtC00YPQu9C10LksINGH0YLQvtCx0Ysg0L/RgNC+0LLQtdGA0LjRgtGMLCDQvtGC0YDQuNGB0L7QstCw0L3RiyDQu9C4INCy0YHQtSDRjdC70LXQvNC10L3RgtGLXG5cdFx0Ly8g0YIu0LouIGRvY3VtZW50LnJlYWR5INC40Lct0LfQsCDQv9GA0LXQu9C+0LDQtNC10YDQsCDRgdGA0LDQsdCw0YLRi9Cy0LDQtdGCINGA0LDQvdGM0YjQtSwg0LrQvtCz0LTQsCDQvtGC0YDQuNGB0L7QstCw0L0g0L/RgNC10LvQvtCw0LTQtdGALCDQsCDQvdC1INCy0YHRjyDRgdGC0YDQsNC90LjRhtCwXG5cdFx0Y29udGVudFJlYWR5ID0gJC5EZWZlcnJlZCgpO1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0X2NvdW50SW1hZ2VzKCk7XG5cdFx0X3N0YXJ0UHJlbG9hZGVyKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBfY291bnRJbWFnZXMoKSB7XG5cblx0XHQvLyDQv9GA0L7RhdC+0LTQuNC8INC/0L4g0LLRgdC10Lwg0Y3Qu9C10LzQtdC90YLQsNC8INC90LAg0YHRgtGA0LDQvdC40YbQtVxuXHRcdCQuZWFjaCgkKCcqJyksIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKSxcblx0XHRcdFx0YmFja2dyb3VuZCA9ICR0aGlzLmNzcygnYmFja2dyb3VuZC1pbWFnZScpLFxuXHRcdFx0XHRpbWcgPSAkdGhpcy5pcygnaW1nJyk7XG5cblx0XHRcdC8vINC30LDQv9C40YHRi9Cy0LDQtdC8INCyINC80LDRgdGB0LjQsiDQstGB0LUg0L/Rg9GC0Lgg0Log0LHRjdC60LPRgNCw0YPQvdC00LDQvFxuXHRcdFx0aWYgKGJhY2tncm91bmQgIT0gJ25vbmUnKSB7XG5cblx0XHRcdFx0Ly8g0LIgY2hyb21lINCyINGD0YDQu9C1INC10YHRgtGMINC60LDQstGL0YfQutC4LCDQstGL0YDQtdC30LDQtdC8INGBINC90LjQvNC4LiB1cmwoXCIuLi5cIikgLT4gLi4uXG5cdFx0XHRcdC8vINCyIHNhZmFyaSDQsiDRg9GA0LvQtSDQvdC10YIg0LrQsNCy0YvRh9C10LosINCy0YvRgNC10LfQsNC10Lwg0LHQtdC3INC90LjRhS4gdXJsKCAuLi4gKSAtPiAuLi5cblx0XHRcdFx0dmFyIHBhdGggPSBiYWNrZ3JvdW5kLnJlcGxhY2UoJ3VybChcIicsIFwiXCIpLnJlcGxhY2UoJ1wiKScsIFwiXCIpO1xuXHRcdFx0XHR2YXIgcGF0aCA9IHBhdGgucmVwbGFjZSgndXJsKCcsIFwiXCIpLnJlcGxhY2UoJyknLCBcIlwiKTtcblxuXHRcdFx0XHRfaW1ncy5wdXNoKHBhdGgpO1xuXHRcdFx0fVxuXHRcdFx0Ly8g0LfQsNC/0LjRgdGL0LLQsNC10Lwg0LIg0LzQsNGB0YHQuNCyINCy0YHQtSDQv9GD0YLQuCDQuiDQutCw0YDRgtC40L3QutCw0Lxcblx0XHRcdGlmIChpbWcpIHtcblx0XHRcdFx0dmFyIHBhdGggPSAnJyArICR0aGlzLmF0dHIoJ3NyYycpO1xuXHRcdFx0XHRpZiAoKHBhdGgpICYmICgkdGhpcy5jc3MoJ2Rpc3BsYXknKSAhPT0gJ25vbmUnKSkge1xuXHRcdFx0XHRcdF9pbWdzLnB1c2gocGF0aCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIF9zdGFydFByZWxvYWRlcigpIHtcblxuXHRcdCQoJ2JvZHknKS5hZGRDbGFzcygnb3ZlcmZsb3ctaGlkZGVuJyk7XG5cblx0XHQvLyDQt9Cw0LPRgNGD0LbQtdC90L4gMCDQutCw0YDRgtC40L3QvtC6XG5cdFx0dmFyIGxvYWRlZCA9IDA7XG5cblx0XHQvLyDQv9GA0L7RhdC+0LTQuNC8INC/0L4g0LLRgdC10Lwg0YHQvtCx0YDQsNC90L3Ri9C8INC60LDRgNGC0LjQvdC60LDQvFxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgX2ltZ3MubGVuZ3RoOyBpKyspIHtcblxuXHRcdFx0dmFyIGltYWdlID0gJCgnPGltZz4nLCB7XG5cdFx0XHRcdGF0dHI6IHtcblx0XHRcdFx0XHRzcmM6IF9pbWdzW2ldXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHQvLyDQt9Cw0LPRgNGD0LbQsNC10Lwg0L/QviDQv9C+0LTQvdC+0Llcblx0XHRcdCQoaW1hZ2UpLmxvYWQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGxvYWRlZCsrO1xuXHRcdFx0XHR2YXIgcGVyY2VudExvYWRlZCA9IF9jb3VudFBlcmNlbnQobG9hZGVkLCBfaW1ncy5sZW5ndGgpO1xuXHRcdFx0XHRfc2V0UGVyY2VudChwZXJjZW50TG9hZGVkKTtcblx0XHRcdH0pO1xuXG5cdFx0fVxuXHR9XG5cblx0Ly8g0L/QtdGA0LXRgdGH0LjRgtGL0LLQsNC10YIg0LIg0L/RgNC+0YbQtdC90YLRiywg0YHQutC+0LvRjNC60L4g0LrQsNGA0YLQuNC90L7QuiDQt9Cw0LPRgNGD0LbQtdC90L5cblx0Ly8gY3VycmVudCAtIG51bWJlciwg0YHQutC+0LvRjNC60L4g0LrQsNGA0YLQuNC90L7QuiDQt9Cw0LPRgNGD0LbQtdC90L5cblx0Ly8gdG90YWwgLSBudW1iZXIsINGB0LrQvtC70YzQutC+INC40YUg0LLRgdC10LPQvlxuXHRmdW5jdGlvbiBfY291bnRQZXJjZW50KGN1cnJlbnQsIHRvdGFsKSB7XG5cdFx0cmV0dXJuIE1hdGguY2VpbChjdXJyZW50IC8gdG90YWwgKiAxMDApO1xuXHR9XG5cblx0Ly8g0LfQsNC/0LjRgdGL0LLQsNC10YIg0L/RgNC+0YbQtdC90YIg0LIgZGl2INC/0YDQtdC70L7QsNC00LXRgFxuXHQvLyBwZXJjZW50IC0gbnVtYmVyLCDQutCw0LrRg9GOINGG0LjRhNGA0YMg0LfQsNC/0LjRgdCw0YLRjFxuXHRmdW5jdGlvbiBfc2V0UGVyY2VudChwZXJjZW50KSB7XG5cblx0XHQkKCcucHJlbG9hZGVyX3RleHQnKS50ZXh0KHBlcmNlbnQpO1xuXG5cdFx0Ly/QutC+0LPQtNCwINC00L7RiNC70Lgg0LTQviAxMDAlLCDRgdC60YDRi9Cy0LDQtdC8INC/0YDQtdC70L7QsNC00LXRgCDQuCDQv9C+0LrQsNC30YvQstCw0LXQvCDRgdC+0LTQtdGA0LbQuNC80L7QtSDRgdGC0YDQsNC90LjRhtGLXG5cdFx0aWYgKHBlcmNlbnQgPj0gMTAwKSB7XG5cdFx0XHQkKCcucHJlbG9hZGVyX2NvbnRhaW5lcicpLmRlbGF5KDcwMCkuZmFkZU91dCg1MDApO1xuXHRcdFx0JCgnYm9keScpLnJlbW92ZUNsYXNzKCdvdmVyZmxvdy1oaWRkZW4nKTtcblx0XHRcdF9maW5pc2hQcmVsb2FkZXIoKTtcblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBfZmluaXNoUHJlbG9hZGVyKCkge1xuXHRcdGNvbnRlbnRSZWFkeS5yZXNvbHZlKCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXQsXG5cdFx0Y29udGVudFJlYWR5OiBjb250ZW50UmVhZHlcblx0fTtcblxufSkoKTtcbiIsInZhciBwYXJhbGxheCA9IChmdW5jdGlvbigpIHtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXG5cdFx0JChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG5cblx0XHRcdHZhciBsYXllciA9ICQoJy5wYXJhbGxheCcpLmZpbmQoJy5wYXJhbGxheF9fbGF5ZXInKTsgLy8g0JLRi9Cx0LjRgNCw0LXQvCDQstGB0LUgcGFyYWxsYXhfX2xheWVyINCyINC+0LHRitC10LrRglxuXG5cdFx0XHRsYXllci5tYXAoZnVuY3Rpb24oa2V5LCB2YWx1ZSkgeyAvLyDQn9GA0L7RhdC+0LTQuNC80YHRjyDQv9C+INCy0YHQtdC8INGN0LvQtdC80LXQvdGC0LDQvCDQvtCx0YrQtdC60YLQsFxuXHRcdFx0XHR2YXIgYm90dG9tUG9zaXRpb24gPSAoKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpICogKGtleSAvIDEwMCkpOyAvLyDQktGL0YfQuNGB0LvRj9C10Lwg0L3QsCDRgdC60L7Qu9GM0LrQviDQvdCw0Lwg0L3QsNC00L4g0L7Qv9GD0YHRgtC40YLRjCDQstC90LjQtyDQvdCw0Ygg0YHQu9C+0Lkg0YfRgtC+INCx0Ysg0L/RgNC4INC/0LXRgNC10LzQtdGJ0LXQvdC40Lgg0L/QviBZINC90LUg0LLQuNC00L3QviDQsdGL0LvQviDQutGA0LDQtdCyXG5cdFx0XHRcdCQodmFsdWUpLmNzcyh7IC8vINCS0YvQsdC40YDQsNC10Lwg0Y3Qu9C10LzQtdC90YIg0Lgg0LTQvtCx0LDQstC70Y/QtdC8IGNzc1xuXHRcdFx0XHRcdCdib3R0b20nOiAnLScgKyBib3R0b21Qb3NpdGlvbiArICdweCcsIC8vINCS0YvRgdGC0LDQstC70Y/QtdC8IGJvdHRvbVxuXHRcdFx0XHRcdCd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoMHB4LCAwcHgsIDApJywgLy8g0J/QvtC00LPQvtGC0LDQstC70LjQstCw0LXQvCBicm93c2VyINC6INGC0YDQsNC90YHRhNC+0YDQvNCw0YbQuNC4XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRcdCQod2luZG93KS5vbignbW91c2Vtb3ZlJywgZnVuY3Rpb24oZSkgeyAvLyDQndCw0LLQtdGI0LjQstCw0LXQvCDRgdC+0LHRi9GC0LjQtSDQv9C10YDQtdC80LXRidC10L3QuCDQvNGL0YjQuCDQvdCwIHdpbmRvdywg0L/QtdGA0LLRi9C8INCw0YDQs9GD0LzQtdC90YLQvtC8INCyINGE0YPQvdC60YbQuNGOLdC+0LHRgNCw0LHQvtGC0YfQuNC6INGB0L7QsdGL0YLQuNGPINC+0YLQv9GA0LDQstC70Y/QtdGC0YHRjyDRgdGB0YvQu9C60LAg0L3QsCDQvtCx0YrQtdC60YIg0YHQvtCx0YvRgtC40Y9cblx0XHRcdFx0dmFyIG1vdXNlX2R4ID0gKGUucGFnZVgpOyAvLyDQo9C30L3QsNC10Lwg0L/QvtC70L7QttC10L3QuNC1INC80YvRiNC60Lgg0L/QviBYXG5cdFx0XHRcdHZhciBtb3VzZV9keSA9IChlLnBhZ2VZKTsgLy8g0KPQt9C90LDQtdC8INC/0L7Qu9C+0LbQtdC90LjQtSDQvNGL0YjQutC4INC/0L4gWVxuXHRcdFx0XHQvLyDQoi7Qui4g0LzRiyDQtNC10LvQuNC8INGN0LrRgNCw0L0g0L3QsCDRh9C10YLRi9GA0LUg0YfQsNGB0YLQuCDRh9GC0L4g0LHRiyDQsiDRhtC10L3RgtGA0LUg0L7QutCw0LfQsNC70LDRgdGMINGC0L7Rh9C60LAg0LrQvtC+0YDQtNC40L3QsNGCIDAsINGC0L4g0L3QsNC8INC90LDQtNC+INC30L3QsNGC0Ywg0LrQvtCz0LTQsCDRgyDQvdCw0YEg0LHRg9C00LXRgiAt0KUg0LggK9ClLCAtWSDQuCArWVxuXHRcdFx0XHR2YXIgdyA9ICh3aW5kb3cuaW5uZXJXaWR0aCAvIDIpIC0gbW91c2VfZHg7IC8vINCS0YvRh9C40YHQu9GP0LXQvCDQtNC70Y8geCDQv9C10YDQtdC80LXRidC10L3QuNGPXG5cdFx0XHRcdHZhciBoID0gKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpIC0gbW91c2VfZHk7IC8vINCS0YvRh9C40YHQu9GP0LXQvCDQtNC70Y8geSDQv9C10YDQtdC80LXRidC10L3QuNGPXG5cblx0XHRcdFx0bGF5ZXIubWFwKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHsgLy8g0J/RgNC+0YXQvtC00LjQvNGB0Y8g0L/QviDQstGB0LXQvCDRjdC70LXQvNC10L3RgtCw0Lwg0L7QsdGK0LXQutGC0LBcblx0XHRcdFx0XHR2YXIgYm90dG9tUG9zaXRpb24gPSAoKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpICogKGtleSAvIDEwMCkpOyAvLyDQktGL0YfQuNGB0LvRj9C10Lwg0L3QsCDRgdC60L7Qu9GM0LrQviDQvdCw0Lwg0L3QsNC00L4g0L7Qv9GD0YHRgtC40YLRjCDQstC90LjQtyDQvdCw0Ygg0YHQu9C+0Lkg0YfRgtC+INCx0Ysg0L/RgNC4INC/0LXRgNC10LzQtdGJ0LXQvdC40Lgg0L/QviBZINC90LUg0LLQuNC00L3QviDQsdGL0LvQviDQutGA0LDQtdCyXG5cdFx0XHRcdFx0dmFyIHdpZHRoUG9zaXRpb24gPSB3ICogKGtleSAvIDgwKTsgLy8g0JLRi9GH0LjRgdC70Y/QtdC8INC60L7QvtGE0LjRhtC10L3RgiDRgdC80LXRiNC10L3QuNGPINC/0L4gWFxuXHRcdFx0XHRcdHZhciBoZWlnaHRQb3NpdGlvbiA9IGggKiAoa2V5IC8gODApOyAvLyDQktGL0YfQuNGB0LvRj9C10Lwg0LrQvtC+0YTQuNGG0LXQvdGCINGB0LzQtdGI0LXQvdC40Y8g0L/QviBZXG5cdFx0XHRcdFx0JCh2YWx1ZSkuY3NzKHsgLy8g0JLRi9Cx0LjRgNCw0LXQvCDRjdC70LXQvNC10L3RgiDQuCDQtNC+0LHQsNCy0LvRj9C10LwgY3NzXG5cdFx0XHRcdFx0XHQnYm90dG9tJzogJy0nICsgYm90dG9tUG9zaXRpb24gKyAncHgnLCAvLyDQktGL0YHRgtCw0LLQu9GP0LXQvCBib3R0b21cblx0XHRcdFx0XHRcdCd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoJyArIHdpZHRoUG9zaXRpb24gKyAncHgsICcgKyBoZWlnaHRQb3NpdGlvbiArICdweCwgMCknLCAvLyDQmNGB0L/QvtC70YzQt9GD0LXQvCB0cmFuc2xhdGUzZCDQtNC70Y8g0LHQvtC70LXQtSDQu9GD0YfRiNC10LPQviDRgNC10L3QtNC10YDQuNC90LPQsCDQvdCwINGB0YLRgNCw0L3QuNGG0LVcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9KVxuXHR9O1xuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG5cbn0oKSk7XG4iLCJ2YXIgZmxpcHBlciA9IChmdW5jdGlvbigpIHtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdHNldFVwRXZlbnRMaXN0ZW5lcnMoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFVwRXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0dmFyIGF1dGhFbGVtID0gJCgnLmF1dGhvcml6ZScpO1xuXHRcdHZhciBmbGlwRWxlbSA9ICQoJy5mbGlwJyk7XG5cdFx0dmFyIG91dHNpZGVFbGVtID0gJCgnLnBhcmFsbGF4X19sYXllcicpO1xuXHRcdHZhciBiYWNrID0gJCgnI2JhY2tUb01haW4nKTtcblxuXG5cdFx0b3V0c2lkZUVsZW0uY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0aWYoZS50YXJnZXQuaWQgIT0gJ2F1dGhvcml6ZScgJiYgZS50YXJnZXQuaWQgIT0gJ2F1dGhvcml6ZV9kaXYnKSB7XG5cdFx0XHRcdGF1dGhFbGVtLmZhZGVJbigzMDApO1xuXHRcdFx0XHRmbGlwRWxlbS5yZW1vdmVDbGFzcygnZmxpcHBpbmcnKVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0YXV0aEVsZW0uY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0YXV0aEVsZW0uZmFkZU91dCgzMDApO1xuXHRcdFx0ZmxpcEVsZW0udG9nZ2xlQ2xhc3MoJ2ZsaXBwaW5nJylcblx0XHR9KTtcblxuXHRcdGJhY2suY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0ZmxpcEVsZW0ucmVtb3ZlQ2xhc3MoJ2ZsaXBwaW5nJyk7XG5cdFx0XHRhdXRoRWxlbS5mYWRlSW4oMzAwKTtcblx0XHR9KVxuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cbn0oKSk7XG4iLCJ2YXIgc2Nyb2xsID0gKGZ1bmN0aW9uKCkge1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cblx0XHRcdHZhciBsYXllcnMgPSAkKCcucGFyYWxsYXgtc2Nyb2xsX19sYXllcicpOyAvLyDQktGL0LHQuNGA0LDQtdC8INCy0YHQtSBwYXJhbGxheF9fbGF5ZXIg0LIg0L7QsdGK0LXQutGCXG5cdFx0XHR2YXIgbWFpbiA9ICQoJy5tYWluJyk7XG5cblx0XHRcdCQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBzY3JvbGxUb3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cblx0XHRcdFx0bGF5ZXJzLm1hcChmdW5jdGlvbihrZXksIHZhbHVlKSB7XG5cdFx0XHRcdFx0dmFyIGJvdHRvbVBvc2l0aW9uID0gc2Nyb2xsVG9wICoga2V5IC8gOTA7XG5cdFx0XHRcdFx0dmFyIGhlaWdodFBvc2l0aW9uID0gLXNjcm9sbFRvcCAqIGtleSAvIDkwO1xuXG5cdFx0XHRcdFx0JCh2YWx1ZSkuY3NzKHtcblx0XHRcdFx0XHRcdCd0b3AnOiAnLScgKyBib3R0b21Qb3NpdGlvbiArICdweCcsXG5cdFx0XHRcdFx0XHQndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZTNkKDAsJyArIGhlaWdodFBvc2l0aW9uICsgJ3B4LCAwKScgLy8g0JjRgdC/0L7Qu9GM0LfRg9C10LwgdHJhbnNsYXRlM2Qg0LTQu9GPINCx0L7Qu9C10LUg0LvRg9GH0YjQtdCz0L4g0YDQtdC90LTQtdGA0LjQvdCz0LAg0L3QsCDRgdGC0YDQsNC90LjRhtC1XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dmFyIHRvcFBvcyA9IHNjcm9sbFRvcCAvIDc7XG5cdFx0XHRcdHZhciBib3R0b21Qb3MgPSAtc2Nyb2xsVG9wIC8gNztcblx0XHRcdFx0bWFpbi5jc3Moe1xuXHRcdFx0XHRcdCd0b3AnOiAnLScgKyB0b3BQb3MgKyAncHgnLFxuXHRcdFx0XHRcdCd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoMCwnICsgYm90dG9tUG9zICsgJ3B4LCAwKSdcblx0XHRcdFx0fSlcblx0XHRcdH0pXG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxuXG59KCkpO1xuIiwidmFyIHNsaWRlciA9IChmdW5jdGlvbigpIHtcblxuXHQvL0FycmF5cyBvZiBpbWFnZXMgaW4gZWFjaCBzbGlkZXIgcGFydFxuXHR2YXIgbWFpbkltYWdlcyA9ICQoJy5zbGlkZXJfX21haW4taW1nX2NvbnRhaW5lcicpO1xuXHR2YXIgcHJldkltYWdlcyA9ICQoJy5uZXh0U2xpZGVJbWcnKTtcblx0dmFyIG5leHRJbWFnZXMgPSAkKCcucHJldlNsaWRlSW1nJyk7XG5cblx0Ly8gQ29udHJvbCBidXR0b25zXG5cdHZhciBuZXh0U2xpZGUgPSAkKCcuc2xpZGVyX19uZXh0Jyk7XG5cdHZhciBwcmV2U2xpZGUgPSAkKCcuc2xpZGVyX19wcmV2Jyk7XG5cdHZhciBjdXJyZW50ID0gMDtcblxuXHR2YXIgdGltZSA9IDIwMDtcblx0dmFyIGFub3RoZXJTdGF0ZTtcblx0dmFyIGZsYWcgPSB0cnVlO1xuXG5cdC8vIFJlbmRlciBmdW5jdGlvbiBmb3IgTWFpbiBzbGlkZXIgcGFydFxuXHR2YXIgY3VycmVudFNsaWRlID0gMDtcblx0ZnVuY3Rpb24gX3JlbmRlck1haW4oY2hhbmdlKSB7XG5cdFx0YW5vdGhlclN0YXRlID0gJC5EZWZlcnJlZCgpO1xuXG5cdFx0bWFpbkltYWdlcy5lcShjdXJyZW50U2xpZGUpLmZhZGVPdXQoMTUwKTtcblxuXHRcdGlmKGNoYW5nZSA9PT0gJ2luY3JlYXNlJykge1xuXHRcdFx0Y3VycmVudFNsaWRlKys7XG5cdFx0XHRjdXJyZW50U2xpZGUgPSBjdXJyZW50U2xpZGUgPiBtYWluSW1hZ2VzLmxlbmd0aCAtIDEgPyAwIDogY3VycmVudFNsaWRlO1xuXHRcdH0gZWxzZSBpZihjaGFuZ2UgPT09ICdkZWNyZWFzZScpIHtcblx0XHRcdGN1cnJlbnRTbGlkZS0tO1xuXHRcdFx0Y3VycmVudFNsaWRlID0gY3VycmVudFNsaWRlIDwgMCA/IG1haW5JbWFnZXMubGVuZ3RoIC0gMSA6IGN1cnJlbnRTbGlkZTtcblx0XHR9XG5cblx0XHRtYWluSW1hZ2VzLmVxKGN1cnJlbnRTbGlkZSkuZGVsYXkoMTAwKS5mYWRlSW4oMTUwLCBmdW5jdGlvbigpIHtcblx0XHRcdGFub3RoZXJTdGF0ZS5yZXNvbHZlKCk7XG5cdFx0fSk7XG5cdH1cblxuXG5cdHZhciBjdXJyZW50TmV4dCA9IDE7XG5cdGZ1bmN0aW9uIF9zbGlkZXJOZXh0QnV0dG9uTmV4dCgpIHtcblx0XHRcdG5leHRJbWFnZXMuZXEoY3VycmVudE5leHQpLmFuaW1hdGUoe1xuXHRcdFx0XHR0b3A6ICctMTAwJSdcblx0XHRcdH0sIHRpbWUgKTtcblxuXHRcdFx0Y3VycmVudE5leHQrKztcblx0XHRcdGN1cnJlbnROZXh0ID0gY3VycmVudE5leHQgPiBtYWluSW1hZ2VzLmxlbmd0aCAtIDEgPyAwIDogY3VycmVudE5leHQ7XG5cblx0XHRcdG5leHRJbWFnZXMuZXEoY3VycmVudE5leHQpLmFuaW1hdGUoe1xuXHRcdFx0XHRkaXNwbGF5OiAnbm9uZScsXG5cdFx0XHRcdHRvcDogJzEwMCUnXG5cdFx0XHR9LCAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0bmV4dEltYWdlcy5lcShjdXJyZW50TmV4dCkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cdFx0XHR9KTtcblxuXHRcdFx0bmV4dEltYWdlcy5lcShjdXJyZW50TmV4dCkuYW5pbWF0ZSh7XG5cdFx0XHRcdHRvcDogJzAnXG5cdFx0XHR9LCB0aW1lKTtcblx0fVxuXG5cdGZ1bmN0aW9uIF9zbGlkZXJOZXh0QnV0dG9uUHJldigpIHtcblx0XHRuZXh0SW1hZ2VzLmVxKGN1cnJlbnROZXh0KS5hbmltYXRlKHtcblx0XHRcdHRvcDogJysxMDAlJ1xuXHRcdH0sIHRpbWUgKTtcblxuXHRcdGN1cnJlbnROZXh0LS07XG5cdFx0Y3VycmVudE5leHQgPSBjdXJyZW50TmV4dCA8IDAgPyBtYWluSW1hZ2VzLmxlbmd0aCAtIDEgOiBjdXJyZW50TmV4dDtcblxuXHRcdG5leHRJbWFnZXMuZXEoY3VycmVudE5leHQpLmFuaW1hdGUoe1xuXHRcdFx0ZGlzcGxheTogJ25vbmUnLFxuXHRcdFx0dG9wOiAnLTEwMCUnXG5cdFx0fSwgMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRuZXh0SW1hZ2VzLmVxKGN1cnJlbnROZXh0KS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblx0XHR9KTtcblxuXHRcdG5leHRJbWFnZXMuZXEoY3VycmVudE5leHQpLmFuaW1hdGUoe1xuXHRcdFx0dG9wOiAnMCdcblx0XHR9LCB0aW1lKTtcblx0fVxuXG5cblx0dmFyIGN1cnJlbnRQcmV2ID0gbWFpbkltYWdlcy5sZW5ndGggLSAxO1xuXHRmdW5jdGlvbiBfc2xpZGVyUHJldkJ1dHRvbk5leHQoKSB7XG5cdFx0cHJldkltYWdlcy5lcShjdXJyZW50UHJldikuYW5pbWF0ZSh7XG5cdFx0XHR0b3A6ICcrMTAwJSdcblx0XHR9LCB0aW1lICk7XG5cblx0XHRjdXJyZW50UHJldisrO1xuXHRcdGN1cnJlbnRQcmV2ID0gY3VycmVudFByZXYgPiBtYWluSW1hZ2VzLmxlbmd0aCAtIDEgPyAwIDogY3VycmVudFByZXY7XG5cblx0XHRwcmV2SW1hZ2VzLmVxKGN1cnJlbnRQcmV2KS5hbmltYXRlKHtcblx0XHRcdGRpc3BsYXk6ICdub25lJyxcblx0XHRcdHRvcDogJy0xMDAlJ1xuXHRcdH0sIDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0cHJldkltYWdlcy5lcShjdXJyZW50UHJldikuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cdFx0fSk7XG5cblx0XHRwcmV2SW1hZ2VzLmVxKGN1cnJlbnRQcmV2KS5hbmltYXRlKHtcblx0XHRcdHRvcDogJzAnXG5cdFx0fSwgdGltZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBfc2xpZGVyUHJldkJ1dHRvblByZXYoKSB7XG5cdFx0cHJldkltYWdlcy5lcShjdXJyZW50UHJldikuYW5pbWF0ZSh7XG5cdFx0XHR0b3A6ICctMTAwJSdcblx0XHR9LCB0aW1lICk7XG5cblx0XHRjdXJyZW50UHJldi0tO1xuXHRcdGN1cnJlbnRQcmV2ID0gY3VycmVudFByZXYgPCAwID8gbWFpbkltYWdlcy5sZW5ndGggLSAxIDogY3VycmVudFByZXY7XG5cblx0XHRwcmV2SW1hZ2VzLmVxKGN1cnJlbnRQcmV2KS5hbmltYXRlKHtcblx0XHRcdGRpc3BsYXk6ICdub25lJyxcblx0XHRcdHRvcDogJysxMDAlJ1xuXHRcdH0sIDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0cHJldkltYWdlcy5lcShjdXJyZW50UHJldikuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cdFx0fSk7XG5cblx0XHRwcmV2SW1hZ2VzLmVxKGN1cnJlbnRQcmV2KS5hbmltYXRlKHtcblx0XHRcdHRvcDogJzAnXG5cdFx0fSwgdGltZSk7XG5cdH1cblxuXG5cdG5leHRTbGlkZS5jbGljayhmdW5jdGlvbigpIHtcblx0XHQkLndoZW4oX3JlbmRlck1haW4oJ2luY3JlYXNlJyksIF9zbGlkZXJOZXh0QnV0dG9uTmV4dCgpLCBfc2xpZGVyUHJldkJ1dHRvbk5leHQoKSxhbm90aGVyU3RhdGUpLmRvbmUoZnVuY3Rpb24gKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ2luY3JlYXNlZCcpO1xuXHRcdH0pO1xuXHR9KTtcblxuXHRwcmV2U2xpZGUuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0JC53aGVuKF9yZW5kZXJNYWluKCdkZWNyZWFzZScpLCBfc2xpZGVyTmV4dEJ1dHRvblByZXYoKSwgX3NsaWRlclByZXZCdXR0b25QcmV2KCksYW5vdGhlclN0YXRlKS5kb25lKGZ1bmN0aW9uICgpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdkZWNyZWFzZWQnKTtcblx0XHR9KTtcblx0fSk7XG5cblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdG1haW5JbWFnZXMuZmFkZU91dCgzMCk7XG5cdFx0bWFpbkltYWdlcy5lcSgwKS5mYWRlSW4oMzApO1xuXG5cdFx0cHJldkltYWdlcy5lcSgobWFpbkltYWdlcy5sZW5ndGggLSAxKSkuY3NzKHtcblx0XHRcdCd0b3AnOiAnMCdcblx0XHR9KTtcblx0XHRuZXh0SW1hZ2VzLmVxKDEpLmNzcyh7XG5cdFx0XHQndG9wJzogJzAnXG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxufSgpKTtcblxuXG5cbi8vIHZhciBzbGlkZXIgPSAoZnVuY3Rpb24oKSB7XG4vL1xuLy8gXHRmdW5jdGlvbiBpbml0KCkge1xuLy9cbi8vIFx0XHR2YXIgbWFpbiA9ICQoJy53b3Jrc19fcmlnaHRfdG9wX2ltZycpO1xuLy8gXHRcdHZhciBwcmV2ID0gJCgnLndvcmtzX19yaWdodF9ib3R0b21fbGVmdF9pbWcnKTtcbi8vIFx0XHR2YXIgbmV4dCA9ICQoJy53b3Jrc19fcmlnaHRfYm90dG9tX3JpZ2h0X2ltZycpO1xuLy8gXHRcdHZhciBtYWluU2xpZGUgPSAkKCcud29ya3NfX3JpZ2h0X3RvcCcpO1xuLy8gXHRcdHZhciBwcmV2U2xpZGUgPSAkKCcud29ya3NfX3JpZ2h0X2JvdHRvbV9sZWZ0Jyk7XG4vLyBcdFx0dmFyIG5leHRTbGlkZSA9ICQoJy53b3Jrc19fcmlnaHRfYm90dG9tX3JpZ2h0Jyk7XG4vLyBcdFx0dmFyIGxhc3ROdW0gPSBtYWluLmxlbmd0aCAtIDE7XG4vL1xuLy8gXHRcdGlmIChtYWluLmxlbmd0aCAhPSBwcmV2Lmxlbmd0aCB8fCBtYWluLmxlbmd0aCAhPSBuZXh0Lmxlbmd0aCkge1xuLy8gXHRcdFx0Y29uc29sZS5lcnJvcignRGlmZmVyZW50IG51bWJlciBvZiBwaWN0dXJlcyBpbiBibG9ja3MnKTtcbi8vIFx0XHR9XG4vL1xuLy8gXHRcdG1haW4uY3NzKHtcbi8vIFx0XHRcdCd0b3AnOiAnMCcsXG4vLyBcdFx0XHQnb3BhY2l0eSc6ICcwJ1xuLy8gXHRcdH0pO1xuLy8gXHRcdG1haW4uZXEoMCkuY3NzKHtcbi8vIFx0XHRcdCd0b3AnOiAnMCcsXG4vLyBcdFx0XHQnb3BhY2l0eSc6ICcxJ1xuLy8gXHRcdH0pO1xuLy8gXHRcdHByZXYuZXEobGFzdE51bSkuY3NzKHtcbi8vIFx0XHRcdCd0b3AnOiAnMCdcbi8vIFx0XHR9KTtcbi8vIFx0XHRuZXh0LmVxKDEpLmNzcyh7XG4vLyBcdFx0XHQndG9wJzogJzAnXG4vLyBcdFx0fSk7XG4vL1xuLy8gXHRcdHZhciBjc3NTZXR1cCA9IHtcbi8vIFx0XHRcdG5leHQ6IHtcbi8vIFx0XHRcdFx0cHJldjoge1xuLy8gXHRcdFx0XHRcdCd6LWluZGV4JzogJzAnLFxuLy8gXHRcdFx0XHRcdCd0b3AnOiAnMTAwJScsXG4vLyBcdFx0XHRcdFx0J3RyYW5zaXRpb24tcHJvcGVydHknOiAndG9wJyxcbi8vIFx0XHRcdFx0XHQndHJhbnNpdGlvbi1kdXJhdGlvbic6ICcuMDlzJ1xuLy8gXHRcdFx0XHR9LFxuLy8gXHRcdFx0XHRjdXJyOiB7XG4vLyBcdFx0XHRcdFx0J3RvcCc6ICctMTAwJScsXG4vLyBcdFx0XHRcdFx0J3RyYW5zaXRpb24tcHJvcGVydHknOiAndG9wJyxcbi8vIFx0XHRcdFx0XHQndHJhbnNpdGlvbi1kdXJhdGlvbic6ICcuMjVzJ1xuLy8gXHRcdFx0XHR9LFxuLy8gXHRcdFx0XHRuZXh0OiB7XG4vLyBcdFx0XHRcdFx0J3RvcCc6ICcwJyxcbi8vIFx0XHRcdFx0XHQnei1pbmRleCc6ICcxMCcsXG4vLyBcdFx0XHRcdFx0J3RyYW5zaXRpb24tcHJvcGVydHknOiAndG9wJyxcbi8vIFx0XHRcdFx0XHQndHJhbnNpdGlvbi1kdXJhdGlvbic6ICcuMjVzJ1xuLy8gXHRcdFx0XHR9XG4vLyBcdFx0XHR9LFxuLy8gXHRcdFx0cHJldjoge1xuLy8gXHRcdFx0XHRwcmV2OiB7XG4vLyBcdFx0XHRcdFx0J3otaW5kZXgnOiAnMCcsXG4vLyBcdFx0XHRcdFx0J3RvcCc6ICctMTAwJScsXG4vLyBcdFx0XHRcdFx0J3RyYW5zaXRpb24tcHJvcGVydHknOiAndG9wJyxcbi8vIFx0XHRcdFx0XHQndHJhbnNpdGlvbi1kdXJhdGlvbic6ICcuMDlzJ1xuLy8gXHRcdFx0XHR9LFxuLy8gXHRcdFx0XHRjdXJyOiB7XG4vLyBcdFx0XHRcdFx0J3RvcCc6ICcxMDAlJyxcbi8vIFx0XHRcdFx0XHQndHJhbnNpdGlvbi1wcm9wZXJ0eSc6ICd0b3AnLFxuLy8gXHRcdFx0XHRcdCd0cmFuc2l0aW9uLWR1cmF0aW9uJzogJy4yNXMnXG4vLyBcdFx0XHRcdH0sXG4vLyBcdFx0XHRcdG5leHQ6IHtcbi8vIFx0XHRcdFx0XHQndG9wJzogJzAnLFxuLy8gXHRcdFx0XHRcdCd6LWluZGV4JzogJzEwJyxcbi8vIFx0XHRcdFx0XHQndHJhbnNpdGlvbi1wcm9wZXJ0eSc6ICd0b3AnLFxuLy8gXHRcdFx0XHRcdCd0cmFuc2l0aW9uLWR1cmF0aW9uJzogJy4yNXMnXG4vLyBcdFx0XHRcdH1cbi8vIFx0XHRcdH0sXG4vLyBcdFx0XHRtYWluOiB7XG4vLyBcdFx0XHRcdHByZXY6IHtcbi8vIFx0XHRcdFx0XHQnb3BhY2l0eSc6ICcwJyxcbi8vIFx0XHRcdFx0XHQndHJhbnNpdGlvbi1wcm9wZXJ0eSc6ICdvcGFjaXR5Jyxcbi8vIFx0XHRcdFx0XHQndHJhbnNpdGlvbi1kdXJhdGlvbic6ICcuMnMnXG4vLyBcdFx0XHRcdH0sXG4vLyBcdFx0XHRcdGN1cnI6IHtcbi8vIFx0XHRcdFx0XHQnb3BhY2l0eSc6ICcxJyxcbi8vIFx0XHRcdFx0XHQndHJhbnNpdGlvbi1wcm9wZXJ0eSc6ICdvcGFjaXR5Jyxcbi8vIFx0XHRcdFx0XHQndHJhbnNpdGlvbi1kdXJhdGlvbic6ICcuMnMnXG4vLyBcdFx0XHRcdH1cbi8vIFx0XHRcdH1cbi8vIFx0XHR9O1xuLy9cbi8vIFx0XHR2YXIgY3RybCA9IChmdW5jdGlvbigpIHtcbi8vIFx0XHRcdG5leHRTbGlkZS5jbGljayhmdW5jdGlvbihlKSB7XG4vLyBcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcbi8vIFx0XHRcdFx0bmV4dFNsaWRlLnJlbmRlck5leHQoKTtcbi8vIFx0XHRcdFx0cHJldlNsaWRlLnJlbmRlck5leHQoKTtcbi8vIFx0XHRcdFx0bWFpblNMaWRlQi5yZW5kZXJOZXh0KCk7XG4vLyBcdFx0XHR9KTtcbi8vIFx0XHRcdHByZXZTbGlkZS5jbGljayhmdW5jdGlvbihlKSB7XG4vLyBcdFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcbi8vIFx0XHRcdFx0bmV4dFNsaWRlLnJlbmRlclByZXYoKTtcbi8vIFx0XHRcdFx0cHJldlNsaWRlLnJlbmRlclByZXYoKTtcbi8vIFx0XHRcdFx0bWFpblNMaWRlQi5yZW5kZXJQcmV2KClcbi8vIFx0XHRcdH0pO1xuLy8gXHRcdFx0bWFpblNsaWRlLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbi8vIFx0XHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuLy8gXHRcdFx0fSlcbi8vIFx0XHR9KSgpO1xuLy9cbi8vIFx0XHRmdW5jdGlvbiBTbGlkZShzbGlkZSwgY3NzU2V0dXAsIHNsaWRlTnVtKSB7XG4vLyBcdFx0XHR2YXIgdGhhdCA9IHRoaXM7XG4vLyBcdFx0XHR0aGlzLnRlc3QgPSAwO1xuLy8gXHRcdFx0dGhpcy5zbGlkZSA9IHNsaWRlO1xuLy8gXHRcdFx0dGhpcy5jc3NTZXR1cCA9IGNzc1NldHVwO1xuLy8gXHRcdFx0dGhpcy5zbGlkZU51bSA9IHNsaWRlTnVtO1xuLy9cbi8vIFx0XHRcdHRoaXMucmVuZGVyTmV4dCA9IGZ1bmN0aW9uKCkge1xuLy8gXHRcdFx0XHR0aGlzLnNsaWRlTnVtICs9IDE7XG4vLyBcdFx0XHRcdGlmICh0aGlzLnNsaWRlTnVtID09PSA0KSB7XG4vLyBcdFx0XHRcdFx0dGhpcy5zbGlkZU51bSA9IDA7XG4vLyBcdFx0XHRcdH1cbi8vIFx0XHRcdFx0dGhpcy5zbGlkZS5lcSh0aGlzLnNsaWRlTnVtKS5jc3ModGhpcy5jc3NTZXR1cC5wcmV2KTtcbi8vIFx0XHRcdFx0dGhpcy5zbGlkZS5lcSh0aGlzLnNsaWRlTnVtKS5vbmUoJ3RyYW5zaXRpb25lbmQgd2Via2l0VHJhbnNpdGlvbkVuZCBvVHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCBNU1RyYW5zaXRpb25FbmQnLFxuLy8gXHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuLy8gXHRcdFx0XHRcdFx0dGhhdC5zbGlkZS5lcSh0aGF0LnNsaWRlTnVtIC0gMSkuY3NzKHRoYXQuY3NzU2V0dXAuY3Vycik7XG4vLyBcdFx0XHRcdFx0XHR0aGF0LnNsaWRlLmVxKHRoYXQuc2xpZGVOdW0pLmNzcyh0aGF0LmNzc1NldHVwLm5leHQpO1xuLy8gXHRcdFx0XHRcdH0pO1xuLy8gXHRcdFx0fTtcbi8vXG4vLyBcdFx0XHR0aGlzLnJlbmRlclByZXYgPSBmdW5jdGlvbigpIHtcbi8vIFx0XHRcdFx0dGhpcy5zbGlkZU51bSAtPSAxO1xuLy8gXHRcdFx0XHRpZiAodGhpcy5zbGlkZU51bSA9PT0gLTEpIHRoaXMuc2xpZGVOdW0gPSAzO1xuLy8gXHRcdFx0XHR0aGlzLnNsaWRlLmVxKHRoaXMuc2xpZGVOdW0pLmNzcyhjc3NTZXR1cC5wcmV2KTtcbi8vIFx0XHRcdFx0dGhpcy5zbGlkZS5lcSh0aGlzLnNsaWRlTnVtKS5vbmUoJ3RyYW5zaXRpb25lbmQgd2Via2l0VHJhbnNpdGlvbkVuZCBvVHJhbnNpdGlvbkVuZCBvdHJhbnNpdGlvbmVuZCBNU1RyYW5zaXRpb25FbmQnLFxuLy8gXHRcdFx0XHRcdGZ1bmN0aW9uKCkge1xuLy8gXHRcdFx0XHRcdFx0aWYgKHRoYXQuc2xpZGVOdW0gPT09IDMpIHtcbi8vIFx0XHRcdFx0XHRcdFx0dGhhdC50ZXN0ID0gLTE7XG4vLyBcdFx0XHRcdFx0XHR9IGVsc2Uge1xuLy8gXHRcdFx0XHRcdFx0XHR0aGF0LnRlc3QgPSB0aGF0LnNsaWRlTnVtO1xuLy8gXHRcdFx0XHRcdFx0fVxuLy8gXHRcdFx0XHRcdFx0dGhhdC5zbGlkZS5lcSh0aGF0LnRlc3QgKyAxKS5jc3ModGhhdC5jc3NTZXR1cC5jdXJyKTtcbi8vIFx0XHRcdFx0XHRcdHRoYXQuc2xpZGUuZXEodGhhdC5zbGlkZU51bSkuY3NzKHRoYXQuY3NzU2V0dXAubmV4dCk7XG4vLyBcdFx0XHRcdFx0fSk7XG4vLyBcdFx0XHR9O1xuLy8gXHRcdH1cbi8vXG4vLyBcdFx0ZnVuY3Rpb24gTWFpblNsaWRlQmxvY2soc2xpZGUsIGNzc1NldHVwLCBzbGlkZU51bSwgbGFzdE51bSkge1xuLy8gXHRcdFx0dmFyIHRoYXQgPSB0aGlzO1xuLy8gXHRcdFx0dGhpcy5sYXN0TnVtID0gbGFzdE51bTtcbi8vIFx0XHRcdHRoaXMuc2xpZGUgPSBzbGlkZTtcbi8vIFx0XHRcdHRoaXMuY3NzU2V0dXAgPSBjc3NTZXR1cDtcbi8vIFx0XHRcdHRoaXMuc2xpZGVOdW0gPSBzbGlkZU51bTtcbi8vIFx0XHRcdHRoaXMubnVtID0gMDtcbi8vXG4vLyBcdFx0XHR0aGlzLnJlbmRlck5leHQgPSBmdW5jdGlvbigpIHtcbi8vIFx0XHRcdFx0dGhpcy5zbGlkZU51bSArPSAxO1xuLy8gXHRcdFx0XHRpZiAodGhpcy5zbGlkZU51bSA9PT0gdGhpcy5sYXN0TnVtICsgMSkgdGhpcy5zbGlkZU51bSA9IDA7XG4vL1xuLy8gXHRcdFx0XHR0aGlzLnNsaWRlLmVxKHRoaXMuc2xpZGVOdW0gLSAxKS5jc3ModGhpcy5jc3NTZXR1cC5wcmV2KTtcbi8vXG4vLyBcdFx0XHRcdHRoaXMuc2xpZGUuZXEodGhpcy5zbGlkZU51bSAtIDEpLm9uZSgndHJhbnNpdGlvbmVuZCB3ZWJraXRUcmFuc2l0aW9uRW5kIG9UcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kIE1TVHJhbnNpdGlvbkVuZCcsXG4vLyBcdFx0XHRcdFx0ZnVuY3Rpb24oKSB7XG4vLyBcdFx0XHRcdFx0XHR0aGF0LnNsaWRlLmVxKHRoYXQuc2xpZGVOdW0pLmNzcyh0aGF0LmNzc1NldHVwLmN1cnIpXG4vLyBcdFx0XHRcdFx0fSk7XG4vLyBcdFx0XHR9O1xuLy9cbi8vIFx0XHRcdHRoaXMucmVuZGVyUHJldiA9IGZ1bmN0aW9uKCkge1xuLy8gXHRcdFx0XHR0aGlzLnNsaWRlTnVtIC09IDE7XG4vL1xuLy8gXHRcdFx0XHRpZiAodGhpcy5zbGlkZU51bSA9PT0gLTEpIHtcbi8vIFx0XHRcdFx0XHR0aGlzLm51bSA9IDA7XG4vLyBcdFx0XHRcdH0gZWxzZSB7XG4vLyBcdFx0XHRcdFx0dGhpcy5udW0gPSB0aGlzLnNsaWRlTnVtICsgMTtcbi8vIFx0XHRcdFx0fVxuLy8gXHRcdFx0XHR0aGlzLnNsaWRlLmVxKHRoaXMubnVtKS5jc3ModGhpcy5jc3NTZXR1cC5wcmV2KTtcbi8vIFx0XHRcdFx0dGhpcy5zbGlkZS5lcSh0aGlzLm51bSkub25lKCd0cmFuc2l0aW9uZW5kIHdlYmtpdFRyYW5zaXRpb25FbmQgb1RyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQgTVNUcmFuc2l0aW9uRW5kJyxcbi8vIFx0XHRcdFx0XHRmdW5jdGlvbigpIHtcbi8vIFx0XHRcdFx0XHRcdGlmICh0aGF0LnNsaWRlTnVtID09PSAtMSkge1xuLy8gXHRcdFx0XHRcdFx0XHR0aGF0LnNsaWRlTnVtID0gdGhhdC5sYXN0TnVtO1xuLy8gXHRcdFx0XHRcdFx0fVxuLy8gXHRcdFx0XHRcdFx0dGhhdC5zbGlkZS5lcSh0aGF0LnNsaWRlTnVtKS5jc3ModGhhdC5jc3NTZXR1cC5jdXJyKTtcbi8vIFx0XHRcdFx0XHR9KTtcbi8vIFx0XHRcdH07XG4vLyBcdFx0fVxuLy9cbi8vIFx0XHR2YXIgbWFpblNMaWRlQjtcbi8vIFx0XHRtYWluU0xpZGVCID0gbmV3IE1haW5TbGlkZUJsb2NrKG1haW4sIGNzc1NldHVwLm1haW4sIDAsIGxhc3ROdW0pO1xuLy8gXHRcdG5leHRTbGlkZSA9IG5ldyBTbGlkZShuZXh0LCBjc3NTZXR1cC5uZXh0LCAxKTtcbi8vIFx0XHRwcmV2U2xpZGUgPSBuZXcgU2xpZGUocHJldiwgY3NzU2V0dXAucHJldiwgbGFzdE51bSlcbi8vXG4vLyBcdH1cbi8vXG4vLyBcdHJldHVybiB7XG4vLyBcdFx0aW5pdDogaW5pdFxuLy8gXHR9XG4vLyB9KCkpXG4iLCJ2YXIgc2xpZGVyVGV4dCA9IChmdW5jdGlvbigpIHtcblx0dmFyIHRpdGxlc0NvbnRhaW5lciA9ICQoJy53b3Jrc19fbGVmdF9oZWFkZXInKTtcblx0dmFyIHRpdGxlcyA9ICQoJy53b3Jrc19fbGVmdF9oZWFkZXJfaW5uZXInKTtcblx0dmFyIHRpdGxlRWxlbSA9ICQoJy53b3Jrc19fbGVmdF9oZWFkZXJfaW5uZXInKS5lcSgwKTtcblxuXHR2YXIgZGVzY3JpcHRpb25Db250YWluZXIgPSAkKCcud29ya3NfX2xlZnRfZG9uZS13aXRoJyk7XG5cdHZhciBkZXNjcmlwdGlvbiA9ICQoJy53b3Jrc19fbGVmdF9kb25lLXdpdGhfaW5uZXInKTtcblx0dmFyIGRlc2NyaXB0aW9uRWxlbSA9ICQoJy53b3Jrc19fbGVmdF9kb25lLXdpdGhfaW5uZXInKS5lcSgwKTtcblxuXHQvL2NvbnRyb2wgYnV0dG9uc1xuXHR2YXIgbmV4dEJ1dHRvbiA9ICQoJy5zbGlkZXJfX25leHQnKTtcblx0dmFyIHByZXZCdXR0b24gPSAkKCcuc2xpZGVyX19wcmV2Jyk7XG5cblx0Ly9hcnJheXMgd2l0aCB0aXRsZXMgYW5kIGRlc2NyaXB0aW9uXG5cdHZhciB0aXRsZXNBcnJheSA9IFtdO1xuXHR2YXIgZGVzY3JpcHRpb25BcnJheSA9IFtdO1xuXG5cdC8vIFNhdmVzIGFsbCB0aXRsZXMgaW50byBhcnJheVxuXHRmdW5jdGlvbiBfcHJvY2Vzc1RpdGxlcyh0aXRsZXMsIGFycmF5KSB7XG5cdFx0dGl0bGVzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHQkdGhpcyA9ICQodGhpcyk7XG5cdFx0XHR2YXIgdGV4dCA9ICR0aGlzLnRleHQoKTtcblx0XHRcdCR0aGlzLmh0bWwoJycpO1xuXHRcdFx0YXJyYXkucHVzaChfc3BhbmlmeSh0ZXh0KSk7XG5cdFx0fSk7XG5cblx0XHQvL3JlbW92ZXMgYWxsIGVsZW1lbnRzIGV4Y2VwdCBvbmUgZnJvbSBET01cblx0XHRkZXNjcmlwdGlvbkNvbnRhaW5lci5lbXB0eSgpO1xuXHRcdGRlc2NyaXB0aW9uQ29udGFpbmVyLmFwcGVuZChkZXNjcmlwdGlvbkVsZW0pO1xuXHRcdHRpdGxlc0NvbnRhaW5lci5lbXB0eSgpO1xuXHRcdHRpdGxlc0NvbnRhaW5lci5hcHBlbmQodGl0bGVFbGVtKTtcblx0fVxuXG5cdC8vIFNhdmVzIGFsbCBkZXNjcmlwdGlvbnMgaW50byBhcnJheVxuXHRmdW5jdGlvbiBfcHJvY2Vzc0Rlc2NyaXB0aW9uKHRpdGxlcywgYXJyYXkpIHtcblx0XHR0aXRsZXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdHZhciB0ZXh0ID0gJCh0aGlzKS5odG1sKCk7XG5cdFx0XHRhcnJheS5wdXNoKHRleHQpXG5cdFx0fSlcblx0fVxuXG5cdC8vIEZ1bmN0aW9uIGFkZHMgc3BhbiB3aXRoIC53b3JkIGNsYXNzIHRvIGVhY2ggd29yZCBhbmQgc3BhbiB3aXRoIC5sZXR0ZXIgY2xhc3Ncblx0Ly8gdG8gZWFjaCBsZXR0ZXJcblx0ZnVuY3Rpb24gX3NwYW5pZnkodGV4dCkge1xuXHRcdHZhciBhcnJheSA9IFtdO1xuXHRcdHZhciB3b3Jkc0FycmF5ID0gdGV4dC5zcGxpdCgnICcpO1xuXHRcdHZhciBzcGFubmVkVGV4dCA9ICcnO1xuXG5cdFx0d29yZHNBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHdvcmQpIHtcblx0XHRcdHZhciBsZXR0ZXJzQXJyYXkgPSB3b3JkLnNwbGl0KCcnKTtcblx0XHRcdHZhciBzcGFubmVkV29yZCA9ICcnO1xuXG5cdFx0XHRsZXR0ZXJzQXJyYXkuZm9yRWFjaChmdW5jdGlvbihsZXR0ZXIpIHtcblx0XHRcdFx0c3Bhbm5lZFdvcmQgKz0gJzxzcGFuIGNsYXNzPVwibGV0dGVyXCI+JyArIGxldHRlciArICc8L3NwYW4+Jztcblx0XHRcdH0pO1xuXG5cdFx0XHRzcGFubmVkVGV4dCArPSAnPHNwYW4gY2xhc3M9XCJ3b3JkXCI+JyArIHNwYW5uZWRXb3JkICsgJzwvc3Bhbj4nO1xuXHRcdH0pO1xuXG5cdFx0YXJyYXkucHVzaChzcGFubmVkVGV4dCk7XG5cdFx0cmV0dXJuIGFycmF5XG5cdH1cblxuXHQvL1Nob3dzIHNlbGVjdGVkIHRpdGxlXG5cdGZ1bmN0aW9uIF9yZW5kZXJUaXRsZShudW0sIGFycmF5LCBlbGVtKSB7XG5cdFx0ZWxlbS5odG1sKGFycmF5W251bV0pO1xuXHRcdGVsZW0uZmluZCgnLmxldHRlcicpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcblx0XHRcdCR0aGlzID0gJCh0aGlzKTtcblxuXHRcdFx0KGZ1bmN0aW9uKGVsZW0pIHtcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRlbGVtLmFkZENsYXNzKCdhY3RpdmVMZXR0ZXInKVxuXHRcdFx0XHR9LCAxMCAqIGluZGV4KTtcblx0XHRcdH0pKCR0aGlzKTtcblxuXHRcdH0pXG5cdH1cblxuXHQvL1Nob3dzIHNlbGVjdGVkIGRlc2NyaXB0aW9uXG5cdGZ1bmN0aW9uIF9yZW5kZXJEZXNjcmlwdGlvbihudW0sIGFycmF5LCBlbGVtKSB7XG5cdFx0ZWxlbS5odG1sKGFycmF5W251bV0pXG5cdH1cblxuXHRmdW5jdGlvbiBfc2V0RXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0dmFyIHF0eSA9IHRpdGxlcy5sZW5ndGg7XG5cdFx0dmFyIGNvdW50ZXIgPSAwO1xuXG5cdFx0bmV4dEJ1dHRvbi5jbGljayhmdW5jdGlvbigpIHtcblx0XHRcdGNvdW50ZXIrKztcblx0XHRcdGNvdW50ZXIgPSBjb3VudGVyIDw9IChxdHkgLSAxKSA/IGNvdW50ZXIgOiAwO1xuXHRcdFx0X3JlbmRlclRpdGxlKGNvdW50ZXIsIHRpdGxlc0FycmF5LCB0aXRsZUVsZW0pO1xuXHRcdFx0X3JlbmRlckRlc2NyaXB0aW9uKGNvdW50ZXIsIGRlc2NyaXB0aW9uQXJyYXksIGRlc2NyaXB0aW9uRWxlbSk7XG5cdFx0fSk7XG5cblx0XHRwcmV2QnV0dG9uLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHRcdFx0Y291bnRlci0tO1xuXHRcdFx0Y291bnRlciA9IGNvdW50ZXIgPCAwID8gKHF0eSAtIDEpIDogY291bnRlcjtcblx0XHRcdF9yZW5kZXJUaXRsZShjb3VudGVyLCB0aXRsZXNBcnJheSwgdGl0bGVFbGVtKTtcblx0XHRcdF9yZW5kZXJEZXNjcmlwdGlvbihjb3VudGVyLCBkZXNjcmlwdGlvbkFycmF5LCBkZXNjcmlwdGlvbkVsZW0pO1xuXHRcdH0pXG5cdH1cblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdF9wcm9jZXNzVGl0bGVzKHRpdGxlcywgdGl0bGVzQXJyYXkpO1xuXHRcdF9wcm9jZXNzRGVzY3JpcHRpb24oZGVzY3JpcHRpb24sIGRlc2NyaXB0aW9uQXJyYXkpO1xuXHRcdF9yZW5kZXJUaXRsZSgwLCB0aXRsZXNBcnJheSwgdGl0bGVFbGVtKTtcblx0XHRfcmVuZGVyRGVzY3JpcHRpb24oMCwgZGVzY3JpcHRpb25BcnJheSwgZGVzY3JpcHRpb25FbGVtKTtcblx0XHRfc2V0RXZlbnRMaXN0ZW5lcnMoKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG5cbn0oKSk7XG4iLCJ2YXIgdGFiID0gKGZ1bmN0aW9uKCkge1xuXG5cdHZhciB0YWJzID0gJCgnLnRhYnNfX2xpc3QtaXRlbScpO1xuXHR2YXIgdGFic0xpbmsgPSAkKCcudGFic19fY29udHJvbC1pdGVtJyk7XG5cblx0ZnVuY3Rpb24gX3NldHVwRXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0dGFicy5lcSgwKS5hZGRDbGFzcygnYWN0aXZlVGFiJyk7XG5cdFx0dGFic0xpbmsuZXEoMCkuYWRkQ2xhc3MoJ2FjdGl2ZVRhYkxpbmsnKTtcblxuXHRcdHRhYnNMaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGFjdGl2ZSA9ICQodGhpcykuZGF0YSgnY2xhc3MnKTtcblx0XHRcdHRhYnMucmVtb3ZlQ2xhc3MoJ2FjdGl2ZVRhYicpO1xuXHRcdFx0dGFic0xpbmsucmVtb3ZlQ2xhc3MoJ2FjdGl2ZVRhYkxpbmsnKTtcblx0XHRcdHRhYnMuZXEoYWN0aXZlKS5hZGRDbGFzcygnYWN0aXZlVGFiJyk7XG5cdFx0XHR0YWJzTGluay5lcShhY3RpdmUpLmFkZENsYXNzKCdhY3RpdmVUYWJMaW5rJyk7XG5cdFx0fSlcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0X3NldHVwRXZlbnRMaXN0ZW5lcnMoKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG59KCkpO1xuIiwidmFyIGRpYWdyYW0gPSAoZnVuY3Rpb24oKSB7XG5cblx0dmFyIGVsZW0gPSAkKCcuc2tpbGxzX19lbGVtcycpLmVxKDApO1xuXHR2YXIgZGlhZ3JhbUFycmF5ID0gJCgnLnNlY3RvcicpO1xuXHR2YXIgZGlhZ3JhbVZhbHVlcztcblxuXHRmdW5jdGlvbiBfc2V0RXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcblx0XHRcdHZhciB0b3BFZGdlID0gJChlbGVtKS5vZmZzZXQoKS50b3A7XG5cdFx0XHR2YXIgc2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXHRcdFx0dmFyIGhlaWdodCA9ICQod2luZG93KS5pbm5lckhlaWdodCgpO1xuXHRcdFx0dmFyIGFuaW1hdGlvblN0YXJ0ID0gaGVpZ2h0ICsgc2Nyb2xsIC0gaGVpZ2h0IC8gNTtcblx0XHRcdGlmIChhbmltYXRpb25TdGFydCA+IHRvcEVkZ2UpIHtcblx0XHRcdFx0X2FuaW1hdGUoKTtcblx0XHRcdH1cblx0XHR9KVxuXHR9XG5cblx0ZnVuY3Rpb24gX2FuaW1hdGUoKSB7XG5cdFx0Y29uc29sZS5sb2coJ3N0YXJ0ZWQnKVxuXHRcdHZhciBtYXhWYWwgPSAyODA7XG5cblx0XHRkaWFncmFtQXJyYXkuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XG5cdFx0XHR2YXIgZGF0YUlkID0gJHRoaXMuZGF0YSgnZGlhZ3JhbScpO1xuXHRcdFx0dmFyIGVsZW1WYWx1ZSA9IGRpYWdyYW1WYWx1ZXNbZGF0YUlkXTtcblx0XHRcdHZhciBkYXNoID0gKGVsZW1WYWx1ZSAvIDEwMCkgKiBtYXhWYWw7XG5cdFx0XHRjb25zb2xlLmxvZygnZGF0YWlkOiAnLCBkYXRhSWQpXG5cdFx0XHRjb25zb2xlLmxvZygnZWxlbVZhbHVlOiAnLCBlbGVtVmFsdWUpXG5cdFx0XHRjb25zb2xlLmxvZygnZGFzaDogJywgZGFzaClcblx0XHRcdCR0aGlzLmNzcyh7XG5cdFx0XHRcdCdzdHJva2UtZGFzaGFycmF5JzogZGFzaCArICcgJyArIG1heFZhbFxuXHRcdFx0fSlcblxuXHRcdH0pXG5cdH1cblxuXHRmdW5jdGlvbiBfZ2V0VmFsdWVzKCkge1xuXHRcdCQuZ2V0KCcvZ2V0ZGlhZ3JhbScsIGZ1bmN0aW9uKGRhdGEpIHt9KS5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdGRpYWdyYW1WYWx1ZXMgPSBkYXRhWzBdO1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRfZ2V0VmFsdWVzKCk7XG5cdFx0X3NldEV2ZW50TGlzdGVuZXJzKCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxufSgpKTtcbiIsInZhciBzY3JvbGxBcnJvdyA9IChmdW5jdGlvbigpIHtcblxuXHRmdW5jdGlvbiBfc2V0RXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0JCgnLmFycm93LWRvd24taWNvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGhlaWdodCA9ICQod2luZG93KS5pbm5lckhlaWdodCgpO1xuXHRcdFx0JCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuXHRcdFx0XHRzY3JvbGxUb3A6IGhlaWdodFxuXHRcdFx0fSwgODAwKTtcblx0XHR9KVxuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRfc2V0RXZlbnRMaXN0ZW5lcnMoKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG5cbn0oKSk7XG4iLCJ2YXIgdmFsaWRhdGlvbiA9IChmdW5jdGlvbigpIHtcblxuICB2YXIgbW9kYWxDb250YWluZXJSb2JvdCA9ICQoJyNpbmRleC1tb2RhbC1jb250YWluZXItcm9ib3RzJyk7XG4gIHZhciBtb2RhbENvbnRhaW5lckZpZWxkID0gJCgnI2luZGV4LW1vZGFsLWNvbnRhaW5lci1maWVsZCcpO1xuICB2YXIgYWxsTW9kYWxzID0gJCgnLmluZGV4LW1vZGFsLWNvbnRhaW5lcicpO1xuICB2YXIgYWN0aXZlTW9kYWwgPSAnaW5kZXgtbW9kYWwtYWN0aXZlJztcbiAgdmFyIGlzSHVtYW4gPSAkKCcjaXNIdW1hbicpO1xuICB2YXIgbm90Um9ib3QgPSAkKCcjcmFkaW8xJyk7XG4gIHZhciBsb2dpbiA9ICQoJyNpbmRleF9sb2dpbicpO1xuICB2YXIgcGFzcyA9ICQoJyNpbmRleF9wYXNzJyk7XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBfc2V0VXBFdmVudExpc3RlbmVycygpO1xuICB9XG5cbiAgZnVuY3Rpb24gX3NldFVwRXZlbnRMaXN0ZW5lcnMoKSB7XG5cbiAgICAkKCcjYXV0aG9yaXplJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBpZighaXNIdW1hbi5wcm9wKCdjaGVja2VkJykgfHwgIW5vdFJvYm90LnByb3AoJ2NoZWNrZWQnKSkge1xuICAgICAgICBfc2hvd01vZGFsKG1vZGFsQ29udGFpbmVyUm9ib3QpO1xuICAgICAgfSBlbHNlIGlmIChsb2dpbi52YWwoKSA9PT0gJycgfHwgcGFzcy52YWwoKSA9PT0gJycpIHtcbiAgICAgICAgX3Nob3dNb2RhbChtb2RhbENvbnRhaW5lckZpZWxkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGZvcm0gPSAkKCcuYXV0aF9mb3JtJyk7XG4gICAgICAgICAgdmFyIGRlZk9iaiA9IF9hamF4Rm9ybShmb3JtLCAnLi9sb2dpbicpO1xuICAgICAgICAgIGlmIChkZWZPYmopIHtcbiAgICAgICAgICAgIGRlZk9iai5kb25lKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICB2YXIgc3RhdHVzID0gcmVzLnN0YXR1cztcbiAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gJ09LJyl7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2FkbWluJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkZWZPYmouZmFpbChmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKHJlcylcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKCcuaW5kZXgtbW9kYWwtYmxvY2stYnV0dG9uJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgX2hpZGVNb2RhbChhbGxNb2RhbHMpO1xuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBfc2hvd01vZGFsKGVsZW1lbnQpIHtcbiAgICBlbGVtZW50LmFkZENsYXNzKGFjdGl2ZU1vZGFsKTtcbiAgfVxuICBmdW5jdGlvbiBfaGlkZU1vZGFsKGVsZW1lbnQpIHtcbiAgICBlbGVtZW50LnJlbW92ZUNsYXNzKGFjdGl2ZU1vZGFsKVxuICB9XG4gIGZ1bmN0aW9uIF9hamF4Rm9ybShmb3JtLCB1cmwpe1xuICAgIHZhciBkYXRhID0gZm9ybS5zZXJpYWxpemUoKTtcbiAgICB2YXIgZGVmT2JqID0gJC5hamF4KHtcbiAgICAgIHR5cGUgOiBcIlBPU1RcIixcbiAgICAgIHVybCA6IHVybCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcblxuICAgIHJldHVybiBkZWZPYmo7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXQ6IGluaXRcbiAgfVxufSgpKTsiLCJ2YXIgYWRtaW4gPSAoZnVuY3Rpb24oKSB7XG5cbiAgdmFyIG1vZGFsID0gJCgnLm1vZGFsLWNvbnRhaW5lcicpO1xuICB2YXIgb2tCdXR0b24gPSAkKCcubW9kYWxPaycpO1xuICB2YXIgYmFja1RvTWFpbiA9ICQoJy5hZG1pbl9oZWFkZXJfcmV0dXJuJyk7XG4gIHZhciBzYXZlRGlhZ3JhbSA9ICQoJyNzYXZlRGlhZ3JhbScpO1xuXG4gIGZ1bmN0aW9uIF9zaG93TW9kYWwocmVzdWx0KSB7XG4gICAgaWYgKHJlc3VsdCA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICBtb2RhbC5lcSgwKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbW9kYWwuZXEoMSkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2xvZ091dCgpIHtcbiAgICBkZWZPYmogPSAkLmFqYXgoe1xuICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICB1cmw6ICcuL2xvZ291dCdcbiAgICB9KS5mYWlsKGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicpO1xuICAgIH0pLmNvbXBsZXRlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy8nO1xuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBfYWRkTmV3V29yaygpIHtcbiAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoJCgnI3VwbG9hZEZvcm0nKVswXSk7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgICB1cmw6IFwiLi91cGxvYWRcIixcbiAgICAgIGRhdGE6ICBmb3JtRGF0YVxuICAgICAgfSlcbiAgICAgIC5kb25lKGZ1bmN0aW9uKCkge1xuICAgICAgICBfc2hvd01vZGFsKCdzdWNjZXNzJylcbiAgICAgIH0pLmZhaWwoZnVuY3Rpb24oKSB7XG4gICAgICBfc2hvd01vZGFsKCdmYWlsJylcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gX3Bvc3REaWFncmFtVmFsdWVzKCkge1xuICAgIHZhciBlbGVtZW50cyA9ICQoJy50YWJzX19saXN0X2Jsb2NrLWVsZW0nKTtcbiAgICB2YXIgdGV4dCA9ICQoJy50YWJzX19saXN0LXRleHQnKTtcbiAgICB2YXIgdmFsdWUgPSAkKCcudGFic19fbGlzdC1pbnB1dCcpO1xuICAgIHZhciBkaWFncmFtVmFsdWVzID0ge307XG5cbiAgICBlbGVtZW50cy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBuYW1lID0gJCh0aGlzKS5maW5kKHRleHQpLnRleHQoKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJy4nLCAnJyk7XG4gICAgICBkaWFncmFtVmFsdWVzW25hbWVdID0gJCh0aGlzKS5maW5kKHZhbHVlKS52YWwoKTtcbiAgICB9KTtcblxuICAgICQucG9zdChcIi9kaWFncmFtXCIsIGRpYWdyYW1WYWx1ZXMpLmRvbmUoZnVuY3Rpb24gKCkge1xuICAgICAgX3Nob3dNb2RhbCgnc3VjY2VzcycpXG4gICAgfSkuZmFpbChmdW5jdGlvbiAoKSB7XG4gICAgICBfc2hvd01vZGFsKCdmYWlsJylcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gX3NldHVwRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgb2tCdXR0b24uY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgbW9kYWwuY3NzKCdkaXNwbGF5JywgJ25vbmUnKVxuICAgIH0pO1xuXG4gICAgYmFja1RvTWFpbi5jbGljayhfbG9nT3V0KTtcbiAgICBzYXZlRGlhZ3JhbS5jbGljayhfcG9zdERpYWdyYW1WYWx1ZXMpO1xuXG4gICAgJCgnI3VwbG9hZEZvcm0nKS5vbignc3VibWl0JywgZnVuY3Rpb24oZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgX2FkZE5ld1dvcmsoKTtcbiAgICB9KTtcblxuICAgICQoJyNibG9nUG9zdCcpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB2YXIgZGF0YSA9ICQodGhpcykuc2VyaWFsaXplKCk7XG5cbiAgICAgICQucG9zdChcIi4vYWRkYmxvZ3Bvc3RcIiwgZGF0YSkuZG9uZShmdW5jdGlvbigpIHtcbiAgICAgICAgX3Nob3dNb2RhbCgnc3VjY2VzcycpXG4gICAgICB9KS5mYWlsKGZ1bmN0aW9uKCkge1xuICAgICAgICBfc2hvd01vZGFsKCdmYWlsJylcbiAgICAgIH0pO1xuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIF9zZXR1cEV2ZW50TGlzdGVuZXJzKCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXQ6IGluaXRcbiAgfVxufSgpKTtcbiIsImZ1bmN0aW9uIG5hdmlnYXRpb24oKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0JCgnI25hdi1pY29uJykuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0JCh0aGlzKS50b2dnbGVDbGFzcygnb3BlbicpO1xuXHRcdCQoJyNvdmVybGF5JykudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcblx0fSk7XG59O1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblxuXHR2YXIgcGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcblxuXHRwcmVsb2FkZXIuaW5pdCgpO1xuXHRuYXZpZ2F0aW9uKCk7XG5cblx0aWYgKHBhdGggPT09ICcvJyB8fCBwYXRoID09PSAnL2luZGV4Lmh0bWwnKSB7XG5cdFx0cGFyYWxsYXguaW5pdCgpO1xuXHRcdGZsaXBwZXIuaW5pdCgpO1xuXHRcdHZhbGlkYXRpb24uaW5pdCgpO1xuXHR9IGVsc2Uge1xuXHRcdHNjcm9sbC5pbml0KCk7XG5cdH1cblxuXHRpZiAocGF0aCA9PT0gJy9ibG9nLmh0bWwnIHx8IHBhdGggPT09ICcvYmxvZycpIHtcblx0XHRibG9nTmF2LmluaXQoKTtcblx0fVxuXG5cdGlmIChwYXRoID09PSAnL3dvcmtzLmh0bWwnIHx8IHBhdGggPT09ICcvd29ya3MnKSB7XG5cdFx0c2xpZGVyLmluaXQoKTtcblx0XHRzbGlkZXJUZXh0LmluaXQoKTtcblx0fVxuXG5cdGlmIChwYXRoID09PSAnL2Fib3V0bWUuaHRtbCcgfHwgcGF0aCA9PT0gJy9hYm91dG1lJykge1xuXHRcdGdvb2dsZU1hcC5pbml0KCk7XG5cdFx0ZGlhZ3JhbS5pbml0KCk7XG5cdH1cblxuXHRpZiAocGF0aCA9PT0gJy9hZG1pbi5odG1sJyB8fCBwYXRoID09PSAnL2FkbWluJykge1xuXHRcdHRhYi5pbml0KCk7XG5cdH1cblxuXHRpZiAocGF0aCAhPT0gJ2FkbWluJykge1xuXHRcdHNjcm9sbEFycm93LmluaXQoKTtcblx0XHRhZG1pbi5pbml0KCk7XG5cdH1cblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
