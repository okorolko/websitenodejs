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

			var layers = $('.parallax-scroll__layer');
			var main = $('.main');

			$(window).on('scroll', function() {
				var scrollTop = $(window).scrollTop();

				layers.map(function(key, value) {
					var bottomPosition = scrollTop * key / 90;
					var heightPosition = -scrollTop * key / 90;

					$(value).css({
						'top': '-' + bottomPosition + 'px',
						'transform': 'translate3d(0,' + heightPosition + 'px, 0)'
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

	var time = 280;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdvb2dsZU1hcC5qcyIsImJsb2dOYXYuanMiLCJwcmVsb2FkZXIuanMiLCJwYXJhbGxheC5qcyIsImZsaXBwZXIuanMiLCJzY3JvbGwuanMiLCJzbGlkZXIuanMiLCJzbGlkZXJUZXh0LmpzIiwidGFiLmpzIiwiZGlhZ3JhbS5qcyIsInNjcm9sbEFycm93LmpzIiwidmFsaWRhdGlvbi5qcyIsImFkbWluLmpzIiwiYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNySkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZ29vZ2xlLm1hcHMuZXZlbnQuYWRkRG9tTGlzdGVuZXIod2luZG93LCAnbG9hZCcsIGluaXQpO1xuXG52YXIgZ29vZ2xlTWFwID0gKGZ1bmN0aW9uKCkge1xuXG5cdHZhciBtYXA7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHR2YXIgbWFwT3B0aW9ucyA9IHtcblx0XHRcdGNlbnRlcjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZyg1OS4yOTkzNzYsIDI2LjUzMDcyMyksXG5cdFx0XHR6b29tOiA0LFxuXHRcdFx0em9vbUNvbnRyb2w6IHRydWUsXG5cdFx0XHR6b29tQ29udHJvbE9wdGlvbnM6IHtcblx0XHRcdFx0c3R5bGU6IGdvb2dsZS5tYXBzLlpvb21Db250cm9sU3R5bGUuREVGQVVMVCxcblx0XHRcdH0sXG5cdFx0XHRkaXNhYmxlRG91YmxlQ2xpY2tab29tOiB0cnVlLFxuXHRcdFx0bWFwVHlwZUNvbnRyb2w6IGZhbHNlLFxuXHRcdFx0c2NhbGVDb250cm9sOiBmYWxzZSxcblx0XHRcdHNjcm9sbHdoZWVsOiBmYWxzZSxcblx0XHRcdHBhbkNvbnRyb2w6IGZhbHNlLFxuXHRcdFx0c3RyZWV0Vmlld0NvbnRyb2w6IGZhbHNlLFxuXHRcdFx0ZHJhZ2dhYmxlOiBmYWxzZSxcblx0XHRcdG92ZXJ2aWV3TWFwQ29udHJvbDogZmFsc2UsXG5cdFx0XHRvdmVydmlld01hcENvbnRyb2xPcHRpb25zOiB7XG5cdFx0XHRcdG9wZW5lZDogZmFsc2UsXG5cdFx0XHR9LFxuXHRcdFx0bWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUCxcblx0XHRcdHN0eWxlczogW3tcblx0XHRcdFx0XCJmZWF0dXJlVHlwZVwiOiBcImFkbWluaXN0cmF0aXZlXCIsXG5cdFx0XHRcdFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcblx0XHRcdFx0XCJzdHlsZXJzXCI6IFt7XG5cdFx0XHRcdFx0XCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG5cdFx0XHRcdH1dXG5cdFx0XHR9LCB7XG5cdFx0XHRcdFwiZmVhdHVyZVR5cGVcIjogXCJsYW5kc2NhcGVcIixcblx0XHRcdFx0XCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG5cdFx0XHRcdFwic3R5bGVyc1wiOiBbe1xuXHRcdFx0XHRcdFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XCJjb2xvclwiOiBcIiNmY2ZjZmNcIlxuXHRcdFx0XHR9XVxuXHRcdFx0fSwge1xuXHRcdFx0XHRcImZlYXR1cmVUeXBlXCI6IFwicG9pXCIsXG5cdFx0XHRcdFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuXHRcdFx0XHRcInN0eWxlcnNcIjogW3tcblx0XHRcdFx0XHRcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFwiY29sb3JcIjogXCIjZmNmY2ZjXCJcblx0XHRcdFx0fV1cblx0XHRcdH0sIHtcblx0XHRcdFx0XCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuaGlnaHdheVwiLFxuXHRcdFx0XHRcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcblx0XHRcdFx0XCJzdHlsZXJzXCI6IFt7XG5cdFx0XHRcdFx0XCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcImNvbG9yXCI6IFwiI2RkZGRkZFwiXG5cdFx0XHRcdH1dXG5cdFx0XHR9LCB7XG5cdFx0XHRcdFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmFydGVyaWFsXCIsXG5cdFx0XHRcdFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuXHRcdFx0XHRcInN0eWxlcnNcIjogW3tcblx0XHRcdFx0XHRcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFwiY29sb3JcIjogXCIjZGRkZGRkXCJcblx0XHRcdFx0fV1cblx0XHRcdH0sIHtcblx0XHRcdFx0XCJmZWF0dXJlVHlwZVwiOiBcInJvYWQubG9jYWxcIixcblx0XHRcdFx0XCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG5cdFx0XHRcdFwic3R5bGVyc1wiOiBbe1xuXHRcdFx0XHRcdFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XCJjb2xvclwiOiBcIiNlZWVlZWVcIlxuXHRcdFx0XHR9XVxuXHRcdFx0fSwge1xuXHRcdFx0XHRcImZlYXR1cmVUeXBlXCI6IFwid2F0ZXJcIixcblx0XHRcdFx0XCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG5cdFx0XHRcdFwic3R5bGVyc1wiOiBbe1xuXHRcdFx0XHRcdFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XCJjb2xvclwiOiBcIiMwMGJmYTVcIlxuXHRcdFx0XHR9XVxuXHRcdFx0fV0sXG5cdFx0fVxuXHRcdHZhciBtYXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpO1xuXHRcdHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKG1hcEVsZW1lbnQsIG1hcE9wdGlvbnMpO1xuXHRcdHZhciBsb2NhdGlvbnMgPSBbXG5cdFx0XHRbJ09sZWcgS29yb2xrbycsICd1bmRlZmluZWQnLCAndW5kZWZpbmVkJywgJycsICd1bmRlZmluZWQnLCA1OS45MzQyODAyLCAzMC4zMzUwOTg2MDAwMDAwMzgsICdodHRwczovL21hcGJ1aWxkci5jb20vYXNzZXRzL2ltZy9tYXJrZXJzL2VsbGlwc2UtcmVkLnBuZyddXG5cdFx0XTtcblx0XHRmb3IgKGkgPSAwOyBpIDwgbG9jYXRpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAobG9jYXRpb25zW2ldWzFdID09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdGRlc2NyaXB0aW9uID0gJyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRkZXNjcmlwdGlvbiA9IGxvY2F0aW9uc1tpXVsxXTtcblx0XHRcdH1cblx0XHRcdGlmIChsb2NhdGlvbnNbaV1bMl0gPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0dGVsZXBob25lID0gJyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0ZWxlcGhvbmUgPSBsb2NhdGlvbnNbaV1bMl07XG5cdFx0XHR9XG5cdFx0XHRpZiAobG9jYXRpb25zW2ldWzNdID09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdGVtYWlsID0gJyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRlbWFpbCA9IGxvY2F0aW9uc1tpXVszXTtcblx0XHRcdH1cblx0XHRcdGlmIChsb2NhdGlvbnNbaV1bNF0gPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0d2ViID0gJyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR3ZWIgPSBsb2NhdGlvbnNbaV1bNF07XG5cdFx0XHR9XG5cdFx0XHRpZiAobG9jYXRpb25zW2ldWzddID09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdG1hcmtlcmljb24gPSAnJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1hcmtlcmljb24gPSBsb2NhdGlvbnNbaV1bN107XG5cdFx0XHR9XG5cdFx0XHRtYXJrZXIgPSBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcblx0XHRcdFx0aWNvbjogbWFya2VyaWNvbixcblx0XHRcdFx0cG9zaXRpb246IG5ldyBnb29nbGUubWFwcy5MYXRMbmcobG9jYXRpb25zW2ldWzVdLCBsb2NhdGlvbnNbaV1bNl0pLFxuXHRcdFx0XHRtYXA6IG1hcCxcblx0XHRcdFx0dGl0bGU6IGxvY2F0aW9uc1tpXVswXSxcblx0XHRcdFx0ZGVzYzogZGVzY3JpcHRpb24sXG5cdFx0XHRcdHRlbDogdGVsZXBob25lLFxuXHRcdFx0XHRlbWFpbDogZW1haWwsXG5cdFx0XHRcdHdlYjogd2ViXG5cdFx0XHR9KTtcblx0XHRcdGxpbmsgPSAnJztcblx0XHRcdGJpbmRJbmZvV2luZG93KG1hcmtlciwgbWFwLCBsb2NhdGlvbnNbaV1bMF0sIGRlc2NyaXB0aW9uLCB0ZWxlcGhvbmUsIGVtYWlsLCB3ZWIsIGxpbmspO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGJpbmRJbmZvV2luZG93KG1hcmtlciwgbWFwLCB0aXRsZSwgZGVzYywgdGVsZXBob25lLCBlbWFpbCwgd2ViLCBsaW5rKSB7XG5cdFx0XHR2YXIgaW5mb1dpbmRvd1Zpc2libGUgPSAoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBjdXJyZW50bHlWaXNpYmxlID0gZmFsc2U7XG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbih2aXNpYmxlKSB7XG5cdFx0XHRcdFx0aWYgKHZpc2libGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0Y3VycmVudGx5VmlzaWJsZSA9IHZpc2libGU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBjdXJyZW50bHlWaXNpYmxlO1xuXHRcdFx0XHR9O1xuXHRcdFx0fSgpKTtcblx0XHRcdGl3ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coKTtcblx0XHRcdGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmIChpbmZvV2luZG93VmlzaWJsZSgpKSB7XG5cdFx0XHRcdFx0aXcuY2xvc2UoKTtcblx0XHRcdFx0XHRpbmZvV2luZG93VmlzaWJsZShmYWxzZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFyIGh0bWwgPSBcIjxkaXYgc3R5bGU9J2NvbG9yOiMwMDA7YmFja2dyb3VuZC1jb2xvcjojZmZmO3BhZGRpbmc6NXB4O3dpZHRoOjE1MHB4Oyc+PC9kaXY+XCI7XG5cdFx0XHRcdFx0aXcgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XG5cdFx0XHRcdFx0XHRjb250ZW50OiBodG1sXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0aXcub3BlbihtYXAsIG1hcmtlcik7XG5cdFx0XHRcdFx0aW5mb1dpbmRvd1Zpc2libGUodHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0Z29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoaXcsICdjbG9zZWNsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGluZm9XaW5kb3dWaXNpYmxlKGZhbHNlKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cblxuXHR9KCkpXG4iLCJ2YXIgYmxvZ05hdiA9IChmdW5jdGlvbigpIHtcblxuICB2YXIgc2lkZUJhciA9ICQoJy5ibG9nLW1lbnUnKTtcbiAgdmFyIHNpZGVCYXJFbGVtID0gJCgnLmJsb2ctbWVudS1lbGVtJyk7XG4gIHZhciBzZWN0aW9uID0gJCgnLmJsb2ctYXJ0aWNsZScpO1xuXG4gIGZ1bmN0aW9uIF9zZXRVcEV2ZW50TGlzdGVuZXJzKCkge1xuICAgICQod2luZG93KS5zY3JvbGwoZnVuY3Rpb24oKSB7XG4gICAgICBfc2Nyb2xsZWQoKVxuICAgIH0pO1xuXG4gICAgc2lkZUJhckVsZW0ub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICB2YXIgaWQgPSAkKHRoaXMpLmRhdGEoJ2lkJyk7XG4gICAgICB2YXIgdG9wID0gJChzZWN0aW9uLmVxKGlkKSkub2Zmc2V0KCkudG9wO1xuXG4gICAgICAkKCdib2R5JykuYW5pbWF0ZSh7XG4gICAgICAgIHNjcm9sbFRvcDogdG9wXG4gICAgICB9LCAzMDApO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gX3Njcm9sbGVkKCkge1xuICAgIHZhciBzY3JvbGwgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cbiAgICB2YXIgbWVudVRvcFBvcyA9ICQoc2VjdGlvbi5lcSgwKSkub2Zmc2V0KCkudG9wIC0gc2Nyb2xsO1xuICAgIGlmIChtZW51VG9wUG9zIDwgMTApIHtcbiAgICAgICQoc2lkZUJhcikuYWRkQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgICQoc2lkZUJhcikucmVtb3ZlQ2xhc3MoJ2ZpeGVkJyk7XG4gICAgfVxuXG4gICAgc2VjdGlvbi5lYWNoKGZ1bmN0aW9uIChpbmRleCwgZWxlbSkge1xuICAgICAgdmFyIGVsZW1Cb3R0b20gPSAkKGVsZW0pLm9mZnNldCgpLnRvcCArICQoZWxlbSkuaGVpZ2h0KCkgKyAxMDA7XG4gICAgICB2YXIgd2luZG93Qm90dG9tID0gc2Nyb2xsICsgJCh3aW5kb3cpLmhlaWdodCgpO1xuICAgICAgdmFyIGVsZW1Cb3R0b21Qb3MgPSB3aW5kb3dCb3R0b20gLSBlbGVtQm90dG9tO1xuICAgICAgdmFyIGVsZW1Ub3BQb3MgPSAkKGVsZW0pLm9mZnNldCgpLnRvcCAtIHNjcm9sbDtcblxuICAgICAgaWYgKGVsZW1Ub3BQb3MgPCAyMDAgfHwgZWxlbUJvdHRvbVBvcyA+IDApIHtcbiAgICAgICAgc2lkZUJhckVsZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBzaWRlQmFyRWxlbS5lcShpbmRleCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgICQoc2lkZUJhckVsZW0uZXEoMCkpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICBfc2V0VXBFdmVudExpc3RlbmVycygpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0XG4gIH1cbn0pKCk7XG4iLCJ2YXIgcHJlbG9hZGVyID0gKGZ1bmN0aW9uKCkge1xuXG5cdHZhclxuXHQvLyDQvNCw0YHRgdC40LIg0LTQu9GPINCy0YHQtdGFINC40LfQvtCx0YDQsNC20LXQvdC40Lkg0L3QsCDRgdGC0YDQsNC90LjRhtC1XG5cdFx0X2ltZ3MgPSBbXSxcblxuXHRcdC8vINCx0YPQtNC10YIg0LjRgdC/0L7Qu9GM0LfQvtCy0LDRgtGM0YHRjyDQuNC3INC00YDRg9Cz0LjRhSDQvNC+0LTRg9C70LXQuSwg0YfRgtC+0LHRiyDQv9GA0L7QstC10YDQuNGC0YwsINC+0YLRgNC40YHQvtCy0LDQvdGLINC70Lgg0LLRgdC1INGN0LvQtdC80LXQvdGC0Ytcblx0XHQvLyDRgi7Qui4gZG9jdW1lbnQucmVhZHkg0LjQty3Qt9CwINC/0YDQtdC70L7QsNC00LXRgNCwINGB0YDQsNCx0LDRgtGL0LLQsNC10YIg0YDQsNC90YzRiNC1LCDQutC+0LPQtNCwINC+0YLRgNC40YHQvtCy0LDQvSDQv9GA0LXQu9C+0LDQtNC10YAsINCwINC90LUg0LLRgdGPINGB0YLRgNCw0L3QuNGG0LBcblx0XHRjb250ZW50UmVhZHkgPSAkLkRlZmVycmVkKCk7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRfY291bnRJbWFnZXMoKTtcblx0XHRfc3RhcnRQcmVsb2FkZXIoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIF9jb3VudEltYWdlcygpIHtcblxuXHRcdC8vINC/0YDQvtGF0L7QtNC40Lwg0L/QviDQstGB0LXQvCDRjdC70LXQvNC10L3RgtCw0Lwg0L3QsCDRgdGC0YDQsNC90LjRhtC1XG5cdFx0JC5lYWNoKCQoJyonKSwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpLFxuXHRcdFx0XHRiYWNrZ3JvdW5kID0gJHRoaXMuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJyksXG5cdFx0XHRcdGltZyA9ICR0aGlzLmlzKCdpbWcnKTtcblxuXHRcdFx0Ly8g0LfQsNC/0LjRgdGL0LLQsNC10Lwg0LIg0LzQsNGB0YHQuNCyINCy0YHQtSDQv9GD0YLQuCDQuiDQsdGN0LrQs9GA0LDRg9C90LTQsNC8XG5cdFx0XHRpZiAoYmFja2dyb3VuZCAhPSAnbm9uZScpIHtcblxuXHRcdFx0XHQvLyDQsiBjaHJvbWUg0LIg0YPRgNC70LUg0LXRgdGC0Ywg0LrQsNCy0YvRh9C60LgsINCy0YvRgNC10LfQsNC10Lwg0YEg0L3QuNC80LguIHVybChcIi4uLlwiKSAtPiAuLi5cblx0XHRcdFx0Ly8g0LIgc2FmYXJpINCyINGD0YDQu9C1INC90LXRgiDQutCw0LLRi9GH0LXQuiwg0LLRi9GA0LXQt9Cw0LXQvCDQsdC10Lcg0L3QuNGFLiB1cmwoIC4uLiApIC0+IC4uLlxuXHRcdFx0XHR2YXIgcGF0aCA9IGJhY2tncm91bmQucmVwbGFjZSgndXJsKFwiJywgXCJcIikucmVwbGFjZSgnXCIpJywgXCJcIik7XG5cdFx0XHRcdHZhciBwYXRoID0gcGF0aC5yZXBsYWNlKCd1cmwoJywgXCJcIikucmVwbGFjZSgnKScsIFwiXCIpO1xuXG5cdFx0XHRcdF9pbWdzLnB1c2gocGF0aCk7XG5cdFx0XHR9XG5cdFx0XHQvLyDQt9Cw0L/QuNGB0YvQstCw0LXQvCDQsiDQvNCw0YHRgdC40LIg0LLRgdC1INC/0YPRgtC4INC6INC60LDRgNGC0LjQvdC60LDQvFxuXHRcdFx0aWYgKGltZykge1xuXHRcdFx0XHR2YXIgcGF0aCA9ICcnICsgJHRoaXMuYXR0cignc3JjJyk7XG5cdFx0XHRcdGlmICgocGF0aCkgJiYgKCR0aGlzLmNzcygnZGlzcGxheScpICE9PSAnbm9uZScpKSB7XG5cdFx0XHRcdFx0X2ltZ3MucHVzaChwYXRoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gX3N0YXJ0UHJlbG9hZGVyKCkge1xuXG5cdFx0JCgnYm9keScpLmFkZENsYXNzKCdvdmVyZmxvdy1oaWRkZW4nKTtcblxuXHRcdC8vINC30LDQs9GA0YPQttC10L3QviAwINC60LDRgNGC0LjQvdC+0Lpcblx0XHR2YXIgbG9hZGVkID0gMDtcblxuXHRcdC8vINC/0YDQvtGF0L7QtNC40Lwg0L/QviDQstGB0LXQvCDRgdC+0LHRgNCw0L3QvdGL0Lwg0LrQsNGA0YLQuNC90LrQsNC8XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBfaW1ncy5sZW5ndGg7IGkrKykge1xuXG5cdFx0XHR2YXIgaW1hZ2UgPSAkKCc8aW1nPicsIHtcblx0XHRcdFx0YXR0cjoge1xuXHRcdFx0XHRcdHNyYzogX2ltZ3NbaV1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vINC30LDQs9GA0YPQttCw0LXQvCDQv9C+INC/0L7QtNC90L7QuVxuXHRcdFx0JChpbWFnZSkubG9hZChmdW5jdGlvbigpIHtcblx0XHRcdFx0bG9hZGVkKys7XG5cdFx0XHRcdHZhciBwZXJjZW50TG9hZGVkID0gX2NvdW50UGVyY2VudChsb2FkZWQsIF9pbWdzLmxlbmd0aCk7XG5cdFx0XHRcdF9zZXRQZXJjZW50KHBlcmNlbnRMb2FkZWQpO1xuXHRcdFx0fSk7XG5cblx0XHR9XG5cdH1cblxuXHQvLyDQv9C10YDQtdGB0YfQuNGC0YvQstCw0LXRgiDQsiDQv9GA0L7RhtC10L3RgtGLLCDRgdC60L7Qu9GM0LrQviDQutCw0YDRgtC40L3QvtC6INC30LDQs9GA0YPQttC10L3QvlxuXHQvLyBjdXJyZW50IC0gbnVtYmVyLCDRgdC60L7Qu9GM0LrQviDQutCw0YDRgtC40L3QvtC6INC30LDQs9GA0YPQttC10L3QvlxuXHQvLyB0b3RhbCAtIG51bWJlciwg0YHQutC+0LvRjNC60L4g0LjRhSDQstGB0LXQs9C+XG5cdGZ1bmN0aW9uIF9jb3VudFBlcmNlbnQoY3VycmVudCwgdG90YWwpIHtcblx0XHRyZXR1cm4gTWF0aC5jZWlsKGN1cnJlbnQgLyB0b3RhbCAqIDEwMCk7XG5cdH1cblxuXHQvLyDQt9Cw0L/QuNGB0YvQstCw0LXRgiDQv9GA0L7RhtC10L3RgiDQsiBkaXYg0L/RgNC10LvQvtCw0LTQtdGAXG5cdC8vIHBlcmNlbnQgLSBudW1iZXIsINC60LDQutGD0Y4g0YbQuNGE0YDRgyDQt9Cw0L/QuNGB0LDRgtGMXG5cdGZ1bmN0aW9uIF9zZXRQZXJjZW50KHBlcmNlbnQpIHtcblxuXHRcdCQoJy5wcmVsb2FkZXJfdGV4dCcpLnRleHQocGVyY2VudCk7XG5cblx0XHQvL9C60L7Qs9C00LAg0LTQvtGI0LvQuCDQtNC+IDEwMCUsINGB0LrRgNGL0LLQsNC10Lwg0L/RgNC10LvQvtCw0LTQtdGAINC4INC/0L7QutCw0LfRi9Cy0LDQtdC8INGB0L7QtNC10YDQttC40LzQvtC1INGB0YLRgNCw0L3QuNGG0Ytcblx0XHRpZiAocGVyY2VudCA+PSAxMDApIHtcblx0XHRcdCQoJy5wcmVsb2FkZXJfY29udGFpbmVyJykuZGVsYXkoNzAwKS5mYWRlT3V0KDUwMCk7XG5cdFx0XHQkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ292ZXJmbG93LWhpZGRlbicpO1xuXHRcdFx0X2ZpbmlzaFByZWxvYWRlcigpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIF9maW5pc2hQcmVsb2FkZXIoKSB7XG5cdFx0Y29udGVudFJlYWR5LnJlc29sdmUoKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdCxcblx0XHRjb250ZW50UmVhZHk6IGNvbnRlbnRSZWFkeVxuXHR9O1xuXG59KSgpO1xuIiwidmFyIHBhcmFsbGF4ID0gKGZ1bmN0aW9uKCkge1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cblx0XHQkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblxuXHRcdFx0dmFyIGxheWVyID0gJCgnLnBhcmFsbGF4JykuZmluZCgnLnBhcmFsbGF4X19sYXllcicpOyAvLyDQktGL0LHQuNGA0LDQtdC8INCy0YHQtSBwYXJhbGxheF9fbGF5ZXIg0LIg0L7QsdGK0LXQutGCXG5cblx0XHRcdGxheWVyLm1hcChmdW5jdGlvbihrZXksIHZhbHVlKSB7IC8vINCf0YDQvtGF0L7QtNC40LzRgdGPINC/0L4g0LLRgdC10Lwg0Y3Qu9C10LzQtdC90YLQsNC8INC+0LHRitC10LrRgtCwXG5cdFx0XHRcdHZhciBib3R0b21Qb3NpdGlvbiA9ICgod2luZG93LmlubmVySGVpZ2h0IC8gMikgKiAoa2V5IC8gMTAwKSk7IC8vINCS0YvRh9C40YHQu9GP0LXQvCDQvdCwINGB0LrQvtC70YzQutC+INC90LDQvCDQvdCw0LTQviDQvtC/0YPRgdGC0LjRgtGMINCy0L3QuNC3INC90LDRiCDRgdC70L7QuSDRh9GC0L4g0LHRiyDQv9GA0Lgg0L/QtdGA0LXQvNC10YnQtdC90LjQuCDQv9C+IFkg0L3QtSDQstC40LTQvdC+INCx0YvQu9C+INC60YDQsNC10LJcblx0XHRcdFx0JCh2YWx1ZSkuY3NzKHsgLy8g0JLRi9Cx0LjRgNCw0LXQvCDRjdC70LXQvNC10L3RgiDQuCDQtNC+0LHQsNCy0LvRj9C10LwgY3NzXG5cdFx0XHRcdFx0J2JvdHRvbSc6ICctJyArIGJvdHRvbVBvc2l0aW9uICsgJ3B4JywgLy8g0JLRi9GB0YLQsNCy0LvRj9C10LwgYm90dG9tXG5cdFx0XHRcdFx0J3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUzZCgwcHgsIDBweCwgMCknLCAvLyDQn9C+0LTQs9C+0YLQsNCy0LvQuNCy0LDQtdC8IGJyb3dzZXIg0Log0YLRgNCw0L3RgdGE0L7RgNC80LDRhtC40Lhcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblxuXHRcdFx0JCh3aW5kb3cpLm9uKCdtb3VzZW1vdmUnLCBmdW5jdGlvbihlKSB7IC8vINCd0LDQstC10YjQuNCy0LDQtdC8INGB0L7QsdGL0YLQuNC1INC/0LXRgNC10LzQtdGJ0LXQvdC4INC80YvRiNC4INC90LAgd2luZG93LCDQv9C10YDQstGL0Lwg0LDRgNCz0YPQvNC10L3RgtC+0Lwg0LIg0YTRg9C90LrRhtC40Y4t0L7QsdGA0LDQsdC+0YLRh9C40Log0YHQvtCx0YvRgtC40Y8g0L7RgtC/0YDQsNCy0LvRj9C10YLRgdGPINGB0YHRi9C70LrQsCDQvdCwINC+0LHRitC10LrRgiDRgdC+0LHRi9GC0LjRj1xuXHRcdFx0XHR2YXIgbW91c2VfZHggPSAoZS5wYWdlWCk7IC8vINCj0LfQvdCw0LXQvCDQv9C+0LvQvtC20LXQvdC40LUg0LzRi9GI0LrQuCDQv9C+IFhcblx0XHRcdFx0dmFyIG1vdXNlX2R5ID0gKGUucGFnZVkpOyAvLyDQo9C30L3QsNC10Lwg0L/QvtC70L7QttC10L3QuNC1INC80YvRiNC60Lgg0L/QviBZXG5cdFx0XHRcdC8vINCiLtC6LiDQvNGLINC00LXQu9C40Lwg0Y3QutGA0LDQvSDQvdCwINGH0LXRgtGL0YDQtSDRh9Cw0YHRgtC4INGH0YLQviDQsdGLINCyINGG0LXQvdGC0YDQtSDQvtC60LDQt9Cw0LvQsNGB0Ywg0YLQvtGH0LrQsCDQutC+0L7RgNC00LjQvdCw0YIgMCwg0YLQviDQvdCw0Lwg0L3QsNC00L4g0LfQvdCw0YLRjCDQutC+0LPQtNCwINGDINC90LDRgSDQsdGD0LTQtdGCIC3QpSDQuCAr0KUsIC1ZINC4ICtZXG5cdFx0XHRcdHZhciB3ID0gKHdpbmRvdy5pbm5lcldpZHRoIC8gMikgLSBtb3VzZV9keDsgLy8g0JLRi9GH0LjRgdC70Y/QtdC8INC00LvRjyB4INC/0LXRgNC10LzQtdGJ0LXQvdC40Y9cblx0XHRcdFx0dmFyIGggPSAod2luZG93LmlubmVySGVpZ2h0IC8gMikgLSBtb3VzZV9keTsgLy8g0JLRi9GH0LjRgdC70Y/QtdC8INC00LvRjyB5INC/0LXRgNC10LzQtdGJ0LXQvdC40Y9cblxuXHRcdFx0XHRsYXllci5tYXAoZnVuY3Rpb24oa2V5LCB2YWx1ZSkgeyAvLyDQn9GA0L7RhdC+0LTQuNC80YHRjyDQv9C+INCy0YHQtdC8INGN0LvQtdC80LXQvdGC0LDQvCDQvtCx0YrQtdC60YLQsFxuXHRcdFx0XHRcdHZhciBib3R0b21Qb3NpdGlvbiA9ICgod2luZG93LmlubmVySGVpZ2h0IC8gMikgKiAoa2V5IC8gMTAwKSk7IC8vINCS0YvRh9C40YHQu9GP0LXQvCDQvdCwINGB0LrQvtC70YzQutC+INC90LDQvCDQvdCw0LTQviDQvtC/0YPRgdGC0LjRgtGMINCy0L3QuNC3INC90LDRiCDRgdC70L7QuSDRh9GC0L4g0LHRiyDQv9GA0Lgg0L/QtdGA0LXQvNC10YnQtdC90LjQuCDQv9C+IFkg0L3QtSDQstC40LTQvdC+INCx0YvQu9C+INC60YDQsNC10LJcblx0XHRcdFx0XHR2YXIgd2lkdGhQb3NpdGlvbiA9IHcgKiAoa2V5IC8gODApOyAvLyDQktGL0YfQuNGB0LvRj9C10Lwg0LrQvtC+0YTQuNGG0LXQvdGCINGB0LzQtdGI0LXQvdC40Y8g0L/QviBYXG5cdFx0XHRcdFx0dmFyIGhlaWdodFBvc2l0aW9uID0gaCAqIChrZXkgLyA4MCk7IC8vINCS0YvRh9C40YHQu9GP0LXQvCDQutC+0L7RhNC40YbQtdC90YIg0YHQvNC10YjQtdC90LjRjyDQv9C+IFlcblx0XHRcdFx0XHQkKHZhbHVlKS5jc3MoeyAvLyDQktGL0LHQuNGA0LDQtdC8INGN0LvQtdC80LXQvdGCINC4INC00L7QsdCw0LLQu9GP0LXQvCBjc3Ncblx0XHRcdFx0XHRcdCdib3R0b20nOiAnLScgKyBib3R0b21Qb3NpdGlvbiArICdweCcsIC8vINCS0YvRgdGC0LDQstC70Y/QtdC8IGJvdHRvbVxuXHRcdFx0XHRcdFx0J3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGhQb3NpdGlvbiArICdweCwgJyArIGhlaWdodFBvc2l0aW9uICsgJ3B4LCAwKScsIC8vINCY0YHQv9C+0LvRjNC30YPQtdC8IHRyYW5zbGF0ZTNkINC00LvRjyDQsdC+0LvQtdC1INC70YPRh9GI0LXQs9C+INGA0LXQvdC00LXRgNC40L3Qs9CwINC90LAg0YHRgtGA0LDQvdC40YbQtVxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0pXG5cdH07XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cblxufSgpKTtcbiIsInZhciBmbGlwcGVyID0gKGZ1bmN0aW9uKCkge1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0c2V0VXBFdmVudExpc3RlbmVycygpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0VXBFdmVudExpc3RlbmVycygpIHtcblx0XHR2YXIgYXV0aEVsZW0gPSAkKCcuYXV0aG9yaXplJyk7XG5cdFx0dmFyIGZsaXBFbGVtID0gJCgnLmZsaXAnKTtcblx0XHR2YXIgb3V0c2lkZUVsZW0gPSAkKCcucGFyYWxsYXhfX2xheWVyJyk7XG5cdFx0dmFyIGJhY2sgPSAkKCcjYmFja1RvTWFpbicpO1xuXG5cblx0XHRvdXRzaWRlRWxlbS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRpZihlLnRhcmdldC5pZCAhPSAnYXV0aG9yaXplJyAmJiBlLnRhcmdldC5pZCAhPSAnYXV0aG9yaXplX2RpdicpIHtcblx0XHRcdFx0YXV0aEVsZW0uZmFkZUluKDMwMCk7XG5cdFx0XHRcdGZsaXBFbGVtLnJlbW92ZUNsYXNzKCdmbGlwcGluZycpXG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRhdXRoRWxlbS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRhdXRoRWxlbS5mYWRlT3V0KDMwMCk7XG5cdFx0XHRmbGlwRWxlbS50b2dnbGVDbGFzcygnZmxpcHBpbmcnKVxuXHRcdH0pO1xuXG5cdFx0YmFjay5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRmbGlwRWxlbS5yZW1vdmVDbGFzcygnZmxpcHBpbmcnKTtcblx0XHRcdGF1dGhFbGVtLmZhZGVJbigzMDApO1xuXHRcdH0pXG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxufSgpKTtcbiIsInZhciBzY3JvbGwgPSAoZnVuY3Rpb24oKSB7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblxuXHRcdFx0dmFyIGxheWVycyA9ICQoJy5wYXJhbGxheC1zY3JvbGxfX2xheWVyJyk7XG5cdFx0XHR2YXIgbWFpbiA9ICQoJy5tYWluJyk7XG5cblx0XHRcdCQod2luZG93KS5vbignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBzY3JvbGxUb3AgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cblx0XHRcdFx0bGF5ZXJzLm1hcChmdW5jdGlvbihrZXksIHZhbHVlKSB7XG5cdFx0XHRcdFx0dmFyIGJvdHRvbVBvc2l0aW9uID0gc2Nyb2xsVG9wICoga2V5IC8gOTA7XG5cdFx0XHRcdFx0dmFyIGhlaWdodFBvc2l0aW9uID0gLXNjcm9sbFRvcCAqIGtleSAvIDkwO1xuXG5cdFx0XHRcdFx0JCh2YWx1ZSkuY3NzKHtcblx0XHRcdFx0XHRcdCd0b3AnOiAnLScgKyBib3R0b21Qb3NpdGlvbiArICdweCcsXG5cdFx0XHRcdFx0XHQndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZTNkKDAsJyArIGhlaWdodFBvc2l0aW9uICsgJ3B4LCAwKSdcblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9KTtcblxuXHRcdFx0XHR2YXIgdG9wUG9zID0gc2Nyb2xsVG9wIC8gNztcblx0XHRcdFx0dmFyIGJvdHRvbVBvcyA9IC1zY3JvbGxUb3AgLyA3O1xuXHRcdFx0XHRtYWluLmNzcyh7XG5cdFx0XHRcdFx0J3RvcCc6ICctJyArIHRvcFBvcyArICdweCcsXG5cdFx0XHRcdFx0J3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUzZCgwLCcgKyBib3R0b21Qb3MgKyAncHgsIDApJ1xuXHRcdFx0XHR9KVxuXHRcdFx0fSlcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG5cbn0oKSk7XG4iLCJ2YXIgc2xpZGVyID0gKGZ1bmN0aW9uKCkge1xuXG5cdC8vQXJyYXlzIG9mIGltYWdlcyBpbiBlYWNoIHNsaWRlciBwYXJ0XG5cdHZhciBtYWluSW1hZ2VzID0gJCgnLnNsaWRlcl9fbWFpbi1pbWdfY29udGFpbmVyJyk7XG5cdHZhciBwcmV2SW1hZ2VzID0gJCgnLm5leHRTbGlkZUltZycpO1xuXHR2YXIgbmV4dEltYWdlcyA9ICQoJy5wcmV2U2xpZGVJbWcnKTtcblxuXHQvLyBDb250cm9sIGJ1dHRvbnNcblx0dmFyIG5leHRTbGlkZSA9ICQoJy5zbGlkZXJfX25leHQnKTtcblx0dmFyIHByZXZTbGlkZSA9ICQoJy5zbGlkZXJfX3ByZXYnKTtcblx0dmFyIGN1cnJlbnQgPSAwO1xuXG5cdHZhciB0aW1lID0gMjgwO1xuXHR2YXIgYW5vdGhlclN0YXRlO1xuXHR2YXIgZmxhZyA9IHRydWU7XG5cblx0Ly8gUmVuZGVyIGZ1bmN0aW9uIGZvciBNYWluIHNsaWRlciBwYXJ0XG5cdHZhciBjdXJyZW50U2xpZGUgPSAwO1xuXHRmdW5jdGlvbiBfcmVuZGVyTWFpbihjaGFuZ2UpIHtcblx0XHRhbm90aGVyU3RhdGUgPSAkLkRlZmVycmVkKCk7XG5cblx0XHRtYWluSW1hZ2VzLmVxKGN1cnJlbnRTbGlkZSkuZmFkZU91dCgxNTApO1xuXG5cdFx0aWYoY2hhbmdlID09PSAnaW5jcmVhc2UnKSB7XG5cdFx0XHRjdXJyZW50U2xpZGUrKztcblx0XHRcdGN1cnJlbnRTbGlkZSA9IGN1cnJlbnRTbGlkZSA+IG1haW5JbWFnZXMubGVuZ3RoIC0gMSA/IDAgOiBjdXJyZW50U2xpZGU7XG5cdFx0fSBlbHNlIGlmKGNoYW5nZSA9PT0gJ2RlY3JlYXNlJykge1xuXHRcdFx0Y3VycmVudFNsaWRlLS07XG5cdFx0XHRjdXJyZW50U2xpZGUgPSBjdXJyZW50U2xpZGUgPCAwID8gbWFpbkltYWdlcy5sZW5ndGggLSAxIDogY3VycmVudFNsaWRlO1xuXHRcdH1cblxuXHRcdG1haW5JbWFnZXMuZXEoY3VycmVudFNsaWRlKS5kZWxheSgxMDApLmZhZGVJbigxNTAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0YW5vdGhlclN0YXRlLnJlc29sdmUoKTtcblx0XHR9KTtcblx0fVxuXG5cblx0dmFyIGN1cnJlbnROZXh0ID0gMTtcblx0ZnVuY3Rpb24gX3NsaWRlck5leHRCdXR0b25OZXh0KCkge1xuXHRcdFx0bmV4dEltYWdlcy5lcShjdXJyZW50TmV4dCkuYW5pbWF0ZSh7XG5cdFx0XHRcdHRvcDogJy0xMDAlJ1xuXHRcdFx0fSwgdGltZSApO1xuXG5cdFx0XHRjdXJyZW50TmV4dCsrO1xuXHRcdFx0Y3VycmVudE5leHQgPSBjdXJyZW50TmV4dCA+IG1haW5JbWFnZXMubGVuZ3RoIC0gMSA/IDAgOiBjdXJyZW50TmV4dDtcblxuXHRcdFx0bmV4dEltYWdlcy5lcShjdXJyZW50TmV4dCkuYW5pbWF0ZSh7XG5cdFx0XHRcdGRpc3BsYXk6ICdub25lJyxcblx0XHRcdFx0dG9wOiAnMTAwJSdcblx0XHRcdH0sIDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRuZXh0SW1hZ2VzLmVxKGN1cnJlbnROZXh0KS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblx0XHRcdH0pO1xuXG5cdFx0XHRuZXh0SW1hZ2VzLmVxKGN1cnJlbnROZXh0KS5hbmltYXRlKHtcblx0XHRcdFx0dG9wOiAnMCdcblx0XHRcdH0sIHRpbWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gX3NsaWRlck5leHRCdXR0b25QcmV2KCkge1xuXHRcdG5leHRJbWFnZXMuZXEoY3VycmVudE5leHQpLmFuaW1hdGUoe1xuXHRcdFx0dG9wOiAnKzEwMCUnXG5cdFx0fSwgdGltZSApO1xuXG5cdFx0Y3VycmVudE5leHQtLTtcblx0XHRjdXJyZW50TmV4dCA9IGN1cnJlbnROZXh0IDwgMCA/IG1haW5JbWFnZXMubGVuZ3RoIC0gMSA6IGN1cnJlbnROZXh0O1xuXG5cdFx0bmV4dEltYWdlcy5lcShjdXJyZW50TmV4dCkuYW5pbWF0ZSh7XG5cdFx0XHRkaXNwbGF5OiAnbm9uZScsXG5cdFx0XHR0b3A6ICctMTAwJSdcblx0XHR9LCAwLCBmdW5jdGlvbigpIHtcblx0XHRcdG5leHRJbWFnZXMuZXEoY3VycmVudE5leHQpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXHRcdH0pO1xuXG5cdFx0bmV4dEltYWdlcy5lcShjdXJyZW50TmV4dCkuYW5pbWF0ZSh7XG5cdFx0XHR0b3A6ICcwJ1xuXHRcdH0sIHRpbWUpO1xuXHR9XG5cblxuXHR2YXIgY3VycmVudFByZXYgPSBtYWluSW1hZ2VzLmxlbmd0aCAtIDE7XG5cdGZ1bmN0aW9uIF9zbGlkZXJQcmV2QnV0dG9uTmV4dCgpIHtcblx0XHRwcmV2SW1hZ2VzLmVxKGN1cnJlbnRQcmV2KS5hbmltYXRlKHtcblx0XHRcdHRvcDogJysxMDAlJ1xuXHRcdH0sIHRpbWUgKTtcblxuXHRcdGN1cnJlbnRQcmV2Kys7XG5cdFx0Y3VycmVudFByZXYgPSBjdXJyZW50UHJldiA+IG1haW5JbWFnZXMubGVuZ3RoIC0gMSA/IDAgOiBjdXJyZW50UHJldjtcblxuXHRcdHByZXZJbWFnZXMuZXEoY3VycmVudFByZXYpLmFuaW1hdGUoe1xuXHRcdFx0ZGlzcGxheTogJ25vbmUnLFxuXHRcdFx0dG9wOiAnLTEwMCUnXG5cdFx0fSwgMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRwcmV2SW1hZ2VzLmVxKGN1cnJlbnRQcmV2KS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblx0XHR9KTtcblxuXHRcdHByZXZJbWFnZXMuZXEoY3VycmVudFByZXYpLmFuaW1hdGUoe1xuXHRcdFx0dG9wOiAnMCdcblx0XHR9LCB0aW1lKTtcblx0fVxuXG5cdGZ1bmN0aW9uIF9zbGlkZXJQcmV2QnV0dG9uUHJldigpIHtcblx0XHRwcmV2SW1hZ2VzLmVxKGN1cnJlbnRQcmV2KS5hbmltYXRlKHtcblx0XHRcdHRvcDogJy0xMDAlJ1xuXHRcdH0sIHRpbWUgKTtcblxuXHRcdGN1cnJlbnRQcmV2LS07XG5cdFx0Y3VycmVudFByZXYgPSBjdXJyZW50UHJldiA8IDAgPyBtYWluSW1hZ2VzLmxlbmd0aCAtIDEgOiBjdXJyZW50UHJldjtcblxuXHRcdHByZXZJbWFnZXMuZXEoY3VycmVudFByZXYpLmFuaW1hdGUoe1xuXHRcdFx0ZGlzcGxheTogJ25vbmUnLFxuXHRcdFx0dG9wOiAnKzEwMCUnXG5cdFx0fSwgMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRwcmV2SW1hZ2VzLmVxKGN1cnJlbnRQcmV2KS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblx0XHR9KTtcblxuXHRcdHByZXZJbWFnZXMuZXEoY3VycmVudFByZXYpLmFuaW1hdGUoe1xuXHRcdFx0dG9wOiAnMCdcblx0XHR9LCB0aW1lKTtcblx0fVxuXG5cblx0bmV4dFNsaWRlLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHRcdCQud2hlbihfcmVuZGVyTWFpbignaW5jcmVhc2UnKSwgX3NsaWRlck5leHRCdXR0b25OZXh0KCksIF9zbGlkZXJQcmV2QnV0dG9uTmV4dCgpLGFub3RoZXJTdGF0ZSkuZG9uZShmdW5jdGlvbiAoKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnaW5jcmVhc2VkJyk7XG5cdFx0fSk7XG5cdH0pO1xuXG5cdHByZXZTbGlkZS5jbGljayhmdW5jdGlvbigpIHtcblx0XHQkLndoZW4oX3JlbmRlck1haW4oJ2RlY3JlYXNlJyksIF9zbGlkZXJOZXh0QnV0dG9uUHJldigpLCBfc2xpZGVyUHJldkJ1dHRvblByZXYoKSxhbm90aGVyU3RhdGUpLmRvbmUoZnVuY3Rpb24gKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ2RlY3JlYXNlZCcpO1xuXHRcdH0pO1xuXHR9KTtcblxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0bWFpbkltYWdlcy5mYWRlT3V0KDMwKTtcblx0XHRtYWluSW1hZ2VzLmVxKDApLmZhZGVJbigzMCk7XG5cblx0XHRwcmV2SW1hZ2VzLmVxKChtYWluSW1hZ2VzLmxlbmd0aCAtIDEpKS5jc3Moe1xuXHRcdFx0J3RvcCc6ICcwJ1xuXHRcdH0pO1xuXHRcdG5leHRJbWFnZXMuZXEoMSkuY3NzKHtcblx0XHRcdCd0b3AnOiAnMCdcblx0XHR9KTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG59KCkpOyIsInZhciBzbGlkZXJUZXh0ID0gKGZ1bmN0aW9uKCkge1xuXHR2YXIgdGl0bGVzQ29udGFpbmVyID0gJCgnLndvcmtzX19sZWZ0X2hlYWRlcicpO1xuXHR2YXIgdGl0bGVzID0gJCgnLndvcmtzX19sZWZ0X2hlYWRlcl9pbm5lcicpO1xuXHR2YXIgdGl0bGVFbGVtID0gJCgnLndvcmtzX19sZWZ0X2hlYWRlcl9pbm5lcicpLmVxKDApO1xuXG5cdHZhciBkZXNjcmlwdGlvbkNvbnRhaW5lciA9ICQoJy53b3Jrc19fbGVmdF9kb25lLXdpdGgnKTtcblx0dmFyIGRlc2NyaXB0aW9uID0gJCgnLndvcmtzX19sZWZ0X2RvbmUtd2l0aF9pbm5lcicpO1xuXHR2YXIgZGVzY3JpcHRpb25FbGVtID0gJCgnLndvcmtzX19sZWZ0X2RvbmUtd2l0aF9pbm5lcicpLmVxKDApO1xuXG5cdC8vY29udHJvbCBidXR0b25zXG5cdHZhciBuZXh0QnV0dG9uID0gJCgnLnNsaWRlcl9fbmV4dCcpO1xuXHR2YXIgcHJldkJ1dHRvbiA9ICQoJy5zbGlkZXJfX3ByZXYnKTtcblxuXHQvL2FycmF5cyB3aXRoIHRpdGxlcyBhbmQgZGVzY3JpcHRpb25cblx0dmFyIHRpdGxlc0FycmF5ID0gW107XG5cdHZhciBkZXNjcmlwdGlvbkFycmF5ID0gW107XG5cblx0Ly8gU2F2ZXMgYWxsIHRpdGxlcyBpbnRvIGFycmF5XG5cdGZ1bmN0aW9uIF9wcm9jZXNzVGl0bGVzKHRpdGxlcywgYXJyYXkpIHtcblx0XHR0aXRsZXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdCR0aGlzID0gJCh0aGlzKTtcblx0XHRcdHZhciB0ZXh0ID0gJHRoaXMudGV4dCgpO1xuXHRcdFx0JHRoaXMuaHRtbCgnJyk7XG5cdFx0XHRhcnJheS5wdXNoKF9zcGFuaWZ5KHRleHQpKTtcblx0XHR9KTtcblxuXHRcdC8vcmVtb3ZlcyBhbGwgZWxlbWVudHMgZXhjZXB0IG9uZSBmcm9tIERPTVxuXHRcdGRlc2NyaXB0aW9uQ29udGFpbmVyLmVtcHR5KCk7XG5cdFx0ZGVzY3JpcHRpb25Db250YWluZXIuYXBwZW5kKGRlc2NyaXB0aW9uRWxlbSk7XG5cdFx0dGl0bGVzQ29udGFpbmVyLmVtcHR5KCk7XG5cdFx0dGl0bGVzQ29udGFpbmVyLmFwcGVuZCh0aXRsZUVsZW0pO1xuXHR9XG5cblx0Ly8gU2F2ZXMgYWxsIGRlc2NyaXB0aW9ucyBpbnRvIGFycmF5XG5cdGZ1bmN0aW9uIF9wcm9jZXNzRGVzY3JpcHRpb24odGl0bGVzLCBhcnJheSkge1xuXHRcdHRpdGxlcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHRleHQgPSAkKHRoaXMpLmh0bWwoKTtcblx0XHRcdGFycmF5LnB1c2godGV4dClcblx0XHR9KVxuXHR9XG5cblx0Ly8gRnVuY3Rpb24gYWRkcyBzcGFuIHdpdGggLndvcmQgY2xhc3MgdG8gZWFjaCB3b3JkIGFuZCBzcGFuIHdpdGggLmxldHRlciBjbGFzc1xuXHQvLyB0byBlYWNoIGxldHRlclxuXHRmdW5jdGlvbiBfc3BhbmlmeSh0ZXh0KSB7XG5cdFx0dmFyIGFycmF5ID0gW107XG5cdFx0dmFyIHdvcmRzQXJyYXkgPSB0ZXh0LnNwbGl0KCcgJyk7XG5cdFx0dmFyIHNwYW5uZWRUZXh0ID0gJyc7XG5cblx0XHR3b3Jkc0FycmF5LmZvckVhY2goZnVuY3Rpb24od29yZCkge1xuXHRcdFx0dmFyIGxldHRlcnNBcnJheSA9IHdvcmQuc3BsaXQoJycpO1xuXHRcdFx0dmFyIHNwYW5uZWRXb3JkID0gJyc7XG5cblx0XHRcdGxldHRlcnNBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGxldHRlcikge1xuXHRcdFx0XHRzcGFubmVkV29yZCArPSAnPHNwYW4gY2xhc3M9XCJsZXR0ZXJcIj4nICsgbGV0dGVyICsgJzwvc3Bhbj4nO1xuXHRcdFx0fSk7XG5cblx0XHRcdHNwYW5uZWRUZXh0ICs9ICc8c3BhbiBjbGFzcz1cIndvcmRcIj4nICsgc3Bhbm5lZFdvcmQgKyAnPC9zcGFuPic7XG5cdFx0fSk7XG5cblx0XHRhcnJheS5wdXNoKHNwYW5uZWRUZXh0KTtcblx0XHRyZXR1cm4gYXJyYXlcblx0fVxuXG5cdC8vU2hvd3Mgc2VsZWN0ZWQgdGl0bGVcblx0ZnVuY3Rpb24gX3JlbmRlclRpdGxlKG51bSwgYXJyYXksIGVsZW0pIHtcblx0XHRlbGVtLmh0bWwoYXJyYXlbbnVtXSk7XG5cdFx0ZWxlbS5maW5kKCcubGV0dGVyJykuZWFjaChmdW5jdGlvbihpbmRleCkge1xuXHRcdFx0JHRoaXMgPSAkKHRoaXMpO1xuXG5cdFx0XHQoZnVuY3Rpb24oZWxlbSkge1xuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGVsZW0uYWRkQ2xhc3MoJ2FjdGl2ZUxldHRlcicpXG5cdFx0XHRcdH0sIDEwICogaW5kZXgpO1xuXHRcdFx0fSkoJHRoaXMpO1xuXG5cdFx0fSlcblx0fVxuXG5cdC8vU2hvd3Mgc2VsZWN0ZWQgZGVzY3JpcHRpb25cblx0ZnVuY3Rpb24gX3JlbmRlckRlc2NyaXB0aW9uKG51bSwgYXJyYXksIGVsZW0pIHtcblx0XHRlbGVtLmh0bWwoYXJyYXlbbnVtXSlcblx0fVxuXG5cdGZ1bmN0aW9uIF9zZXRFdmVudExpc3RlbmVycygpIHtcblx0XHR2YXIgcXR5ID0gdGl0bGVzLmxlbmd0aDtcblx0XHR2YXIgY291bnRlciA9IDA7XG5cblx0XHRuZXh0QnV0dG9uLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHRcdFx0Y291bnRlcisrO1xuXHRcdFx0Y291bnRlciA9IGNvdW50ZXIgPD0gKHF0eSAtIDEpID8gY291bnRlciA6IDA7XG5cdFx0XHRfcmVuZGVyVGl0bGUoY291bnRlciwgdGl0bGVzQXJyYXksIHRpdGxlRWxlbSk7XG5cdFx0XHRfcmVuZGVyRGVzY3JpcHRpb24oY291bnRlciwgZGVzY3JpcHRpb25BcnJheSwgZGVzY3JpcHRpb25FbGVtKTtcblx0XHR9KTtcblxuXHRcdHByZXZCdXR0b24uY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0XHRjb3VudGVyLS07XG5cdFx0XHRjb3VudGVyID0gY291bnRlciA8IDAgPyAocXR5IC0gMSkgOiBjb3VudGVyO1xuXHRcdFx0X3JlbmRlclRpdGxlKGNvdW50ZXIsIHRpdGxlc0FycmF5LCB0aXRsZUVsZW0pO1xuXHRcdFx0X3JlbmRlckRlc2NyaXB0aW9uKGNvdW50ZXIsIGRlc2NyaXB0aW9uQXJyYXksIGRlc2NyaXB0aW9uRWxlbSk7XG5cdFx0fSlcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0X3Byb2Nlc3NUaXRsZXModGl0bGVzLCB0aXRsZXNBcnJheSk7XG5cdFx0X3Byb2Nlc3NEZXNjcmlwdGlvbihkZXNjcmlwdGlvbiwgZGVzY3JpcHRpb25BcnJheSk7XG5cdFx0X3JlbmRlclRpdGxlKDAsIHRpdGxlc0FycmF5LCB0aXRsZUVsZW0pO1xuXHRcdF9yZW5kZXJEZXNjcmlwdGlvbigwLCBkZXNjcmlwdGlvbkFycmF5LCBkZXNjcmlwdGlvbkVsZW0pO1xuXHRcdF9zZXRFdmVudExpc3RlbmVycygpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cblxufSgpKTtcbiIsInZhciB0YWIgPSAoZnVuY3Rpb24oKSB7XG5cblx0dmFyIHRhYnMgPSAkKCcudGFic19fbGlzdC1pdGVtJyk7XG5cdHZhciB0YWJzTGluayA9ICQoJy50YWJzX19jb250cm9sLWl0ZW0nKTtcblxuXHRmdW5jdGlvbiBfc2V0dXBFdmVudExpc3RlbmVycygpIHtcblx0XHR0YWJzLmVxKDApLmFkZENsYXNzKCdhY3RpdmVUYWInKTtcblx0XHR0YWJzTGluay5lcSgwKS5hZGRDbGFzcygnYWN0aXZlVGFiTGluaycpO1xuXG5cdFx0dGFic0xpbmsub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgYWN0aXZlID0gJCh0aGlzKS5kYXRhKCdjbGFzcycpO1xuXHRcdFx0dGFicy5yZW1vdmVDbGFzcygnYWN0aXZlVGFiJyk7XG5cdFx0XHR0YWJzTGluay5yZW1vdmVDbGFzcygnYWN0aXZlVGFiTGluaycpO1xuXHRcdFx0dGFicy5lcShhY3RpdmUpLmFkZENsYXNzKCdhY3RpdmVUYWInKTtcblx0XHRcdHRhYnNMaW5rLmVxKGFjdGl2ZSkuYWRkQ2xhc3MoJ2FjdGl2ZVRhYkxpbmsnKTtcblx0XHR9KVxuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRfc2V0dXBFdmVudExpc3RlbmVycygpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cbn0oKSk7XG4iLCJ2YXIgZGlhZ3JhbSA9IChmdW5jdGlvbigpIHtcblxuXHR2YXIgZWxlbSA9ICQoJy5za2lsbHNfX2VsZW1zJykuZXEoMCk7XG5cdHZhciBkaWFncmFtQXJyYXkgPSAkKCcuc2VjdG9yJyk7XG5cdHZhciBkaWFncmFtVmFsdWVzO1xuXG5cdGZ1bmN0aW9uIF9zZXRFdmVudExpc3RlbmVycygpIHtcblx0XHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHRvcEVkZ2UgPSAkKGVsZW0pLm9mZnNldCgpLnRvcDtcblx0XHRcdHZhciBzY3JvbGwgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cdFx0XHR2YXIgaGVpZ2h0ID0gJCh3aW5kb3cpLmlubmVySGVpZ2h0KCk7XG5cdFx0XHR2YXIgYW5pbWF0aW9uU3RhcnQgPSBoZWlnaHQgKyBzY3JvbGwgLSBoZWlnaHQgLyA1O1xuXHRcdFx0aWYgKGFuaW1hdGlvblN0YXJ0ID4gdG9wRWRnZSkge1xuXHRcdFx0XHRfYW5pbWF0ZSgpO1xuXHRcdFx0fVxuXHRcdH0pXG5cdH1cblxuXHRmdW5jdGlvbiBfYW5pbWF0ZSgpIHtcblx0XHR2YXIgbWF4VmFsID0gMjgwO1xuXHRcdGRpYWdyYW1BcnJheS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHRcdHZhciBkYXRhSWQgPSAkdGhpcy5kYXRhKCdkaWFncmFtJyk7XG5cdFx0XHR2YXIgZWxlbVZhbHVlID0gZGlhZ3JhbVZhbHVlc1tkYXRhSWRdO1xuXHRcdFx0dmFyIGRhc2ggPSAoZWxlbVZhbHVlIC8gMTAwKSAqIG1heFZhbDtcblx0XHRcdCR0aGlzLmNzcyh7XG5cdFx0XHRcdCdzdHJva2UtZGFzaGFycmF5JzogZGFzaCArICcgJyArIG1heFZhbFxuXHRcdFx0fSlcblxuXHRcdH0pXG5cdH1cblxuXHRmdW5jdGlvbiBfZ2V0VmFsdWVzKCkge1xuXHRcdCQuZ2V0KCcvZ2V0ZGlhZ3JhbScsIGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdGRpYWdyYW1WYWx1ZXMgPSBkYXRhWzBdO1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRfZ2V0VmFsdWVzKCk7XG5cdFx0X3NldEV2ZW50TGlzdGVuZXJzKCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxufSgpKTtcbiIsInZhciBzY3JvbGxBcnJvdyA9IChmdW5jdGlvbigpIHtcblxuXHRmdW5jdGlvbiBfc2V0RXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0JCgnLmFycm93LWRvd24taWNvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGhlaWdodCA9ICQod2luZG93KS5pbm5lckhlaWdodCgpO1xuXHRcdFx0JCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuXHRcdFx0XHRzY3JvbGxUb3A6IGhlaWdodFxuXHRcdFx0fSwgODAwKTtcblx0XHR9KVxuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRfc2V0RXZlbnRMaXN0ZW5lcnMoKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG5cbn0oKSk7XG4iLCJ2YXIgdmFsaWRhdGlvbiA9IChmdW5jdGlvbigpIHtcblxuICB2YXIgbW9kYWxDb250YWluZXJSb2JvdCA9ICQoJyNpbmRleC1tb2RhbC1jb250YWluZXItcm9ib3RzJyk7XG4gIHZhciBtb2RhbENvbnRhaW5lckZpZWxkID0gJCgnI2luZGV4LW1vZGFsLWNvbnRhaW5lci1maWVsZCcpO1xuICB2YXIgYWxsTW9kYWxzID0gJCgnLmluZGV4LW1vZGFsLWNvbnRhaW5lcicpO1xuICB2YXIgYWN0aXZlTW9kYWwgPSAnaW5kZXgtbW9kYWwtYWN0aXZlJztcbiAgdmFyIGlzSHVtYW4gPSAkKCcjaXNIdW1hbicpO1xuICB2YXIgbm90Um9ib3QgPSAkKCcjcmFkaW8xJyk7XG4gIHZhciBsb2dpbiA9ICQoJyNpbmRleF9sb2dpbicpO1xuICB2YXIgcGFzcyA9ICQoJyNpbmRleF9wYXNzJyk7XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBfc2V0VXBFdmVudExpc3RlbmVycygpO1xuICB9XG5cbiAgZnVuY3Rpb24gX3NldFVwRXZlbnRMaXN0ZW5lcnMoKSB7XG5cbiAgICAkKCcjYXV0aG9yaXplJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBpZighaXNIdW1hbi5wcm9wKCdjaGVja2VkJykgfHwgIW5vdFJvYm90LnByb3AoJ2NoZWNrZWQnKSkge1xuICAgICAgICBfc2hvd01vZGFsKG1vZGFsQ29udGFpbmVyUm9ib3QpO1xuICAgICAgfSBlbHNlIGlmIChsb2dpbi52YWwoKSA9PT0gJycgfHwgcGFzcy52YWwoKSA9PT0gJycpIHtcbiAgICAgICAgX3Nob3dNb2RhbChtb2RhbENvbnRhaW5lckZpZWxkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGZvcm0gPSAkKCcuYXV0aF9mb3JtJyk7XG4gICAgICAgICAgdmFyIGRlZk9iaiA9IF9hamF4Rm9ybShmb3JtLCAnLi9sb2dpbicpO1xuICAgICAgICAgIGlmIChkZWZPYmopIHtcbiAgICAgICAgICAgIGRlZk9iai5kb25lKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICB2YXIgc3RhdHVzID0gcmVzLnN0YXR1cztcbiAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gJ09LJyl7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2FkbWluJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkZWZPYmouZmFpbChmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKHJlcylcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKCcuaW5kZXgtbW9kYWwtYmxvY2stYnV0dG9uJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgX2hpZGVNb2RhbChhbGxNb2RhbHMpO1xuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBfc2hvd01vZGFsKGVsZW1lbnQpIHtcbiAgICBlbGVtZW50LmFkZENsYXNzKGFjdGl2ZU1vZGFsKTtcbiAgfVxuICBmdW5jdGlvbiBfaGlkZU1vZGFsKGVsZW1lbnQpIHtcbiAgICBlbGVtZW50LnJlbW92ZUNsYXNzKGFjdGl2ZU1vZGFsKVxuICB9XG4gIGZ1bmN0aW9uIF9hamF4Rm9ybShmb3JtLCB1cmwpe1xuICAgIHZhciBkYXRhID0gZm9ybS5zZXJpYWxpemUoKTtcbiAgICB2YXIgZGVmT2JqID0gJC5hamF4KHtcbiAgICAgIHR5cGUgOiBcIlBPU1RcIixcbiAgICAgIHVybCA6IHVybCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcblxuICAgIHJldHVybiBkZWZPYmo7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXQ6IGluaXRcbiAgfVxufSgpKTsiLCJ2YXIgYWRtaW4gPSAoZnVuY3Rpb24oKSB7XG5cbiAgdmFyIG1vZGFsID0gJCgnLm1vZGFsLWNvbnRhaW5lcicpO1xuICB2YXIgb2tCdXR0b24gPSAkKCcubW9kYWxPaycpO1xuICB2YXIgYmFja1RvTWFpbiA9ICQoJy5hZG1pbl9oZWFkZXJfcmV0dXJuJyk7XG4gIHZhciBzYXZlRGlhZ3JhbSA9ICQoJyNzYXZlRGlhZ3JhbScpO1xuXG4gIGZ1bmN0aW9uIF9zaG93TW9kYWwocmVzdWx0KSB7XG4gICAgaWYgKHJlc3VsdCA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICBtb2RhbC5lcSgwKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbW9kYWwuZXEoMSkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2xvZ091dCgpIHtcbiAgICBkZWZPYmogPSAkLmFqYXgoe1xuICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICB1cmw6ICcuL2xvZ291dCdcbiAgICB9KS5mYWlsKGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicpO1xuICAgIH0pLmNvbXBsZXRlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy8nO1xuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBfYWRkTmV3V29yaygpIHtcbiAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoJCgnI3VwbG9hZEZvcm0nKVswXSk7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgICB1cmw6IFwiLi91cGxvYWRcIixcbiAgICAgIGRhdGE6ICBmb3JtRGF0YVxuICAgIH0pXG4gICAgICAuZG9uZShmdW5jdGlvbigpIHtcbiAgICAgICAgX3Nob3dNb2RhbCgnc3VjY2VzcycpXG4gICAgICB9KS5mYWlsKGZ1bmN0aW9uKCkge1xuICAgICAgX3Nob3dNb2RhbCgnZmFpbCcpXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIF9wb3N0RGlhZ3JhbVZhbHVlcygpIHtcbiAgICB2YXIgZWxlbWVudHMgPSAkKCcudGFic19fbGlzdF9ibG9jay1lbGVtJyk7XG4gICAgdmFyIHRleHQgPSAkKCcudGFic19fbGlzdC10ZXh0Jyk7XG4gICAgdmFyIHZhbHVlID0gJCgnLnRhYnNfX2xpc3QtaW5wdXQnKTtcbiAgICB2YXIgZGlhZ3JhbVZhbHVlcyA9IHt9O1xuXG4gICAgZWxlbWVudHMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbmFtZSA9ICQodGhpcykuZmluZCh0ZXh0KS50ZXh0KCkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcuJywgJycpO1xuICAgICAgZGlhZ3JhbVZhbHVlc1tuYW1lXSA9ICQodGhpcykuZmluZCh2YWx1ZSkudmFsKCk7XG4gICAgfSk7XG5cbiAgICAkLnBvc3QoXCIvZGlhZ3JhbVwiLCBkaWFncmFtVmFsdWVzKS5kb25lKGZ1bmN0aW9uICgpIHtcbiAgICAgIF9zaG93TW9kYWwoJ3N1Y2Nlc3MnKVxuICAgIH0pLmZhaWwoZnVuY3Rpb24gKCkge1xuICAgICAgX3Nob3dNb2RhbCgnZmFpbCcpXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIF9zZXR1cEV2ZW50TGlzdGVuZXJzKCkge1xuICAgIG9rQnV0dG9uLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIG1vZGFsLmNzcygnZGlzcGxheScsICdub25lJylcbiAgICB9KTtcblxuICAgIGJhY2tUb01haW4uY2xpY2soX2xvZ091dCk7XG4gICAgc2F2ZURpYWdyYW0uY2xpY2soX3Bvc3REaWFncmFtVmFsdWVzKTtcblxuICAgICQoJyN1cGxvYWRGb3JtJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIF9hZGROZXdXb3JrKCk7XG4gICAgfSk7XG5cbiAgICAkKCcjYmxvZ1Bvc3QnKS5vbignc3VibWl0JywgZnVuY3Rpb24oZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdmFyIGRhdGEgPSAkKHRoaXMpLnNlcmlhbGl6ZSgpO1xuXG4gICAgICAkLnBvc3QoXCIuL2FkZGJsb2dwb3N0XCIsIGRhdGEpLmRvbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgIF9zaG93TW9kYWwoJ3N1Y2Nlc3MnKVxuICAgICAgICAkKCcjYmxvZ1Bvc3QnKVswXS5yZXNldCgpO1xuICAgICAgfSkuZmFpbChmdW5jdGlvbigpIHtcbiAgICAgICAgX3Nob3dNb2RhbCgnZmFpbCcpXG4gICAgICB9KTtcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBfc2V0dXBFdmVudExpc3RlbmVycygpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0XG4gIH1cbn0oKSk7XG4iLCJmdW5jdGlvbiBuYXZpZ2F0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdCQoJyNuYXYtaWNvbicpLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHRcdCQodGhpcykudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcblx0XHQkKCcjb3ZlcmxheScpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XG5cdH0pO1xufTtcblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG5cblx0dmFyIHBhdGggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG5cblx0cHJlbG9hZGVyLmluaXQoKTtcblx0bmF2aWdhdGlvbigpO1xuXG5cdGlmIChwYXRoID09PSAnLycgfHwgcGF0aCA9PT0gJy9pbmRleC5odG1sJykge1xuXHRcdHBhcmFsbGF4LmluaXQoKTtcblx0XHRmbGlwcGVyLmluaXQoKTtcblx0XHR2YWxpZGF0aW9uLmluaXQoKTtcblx0fSBlbHNlIHtcblx0XHRzY3JvbGwuaW5pdCgpO1xuXHR9XG5cblx0aWYgKHBhdGggPT09ICcvYmxvZy5odG1sJyB8fCBwYXRoID09PSAnL2Jsb2cnKSB7XG5cdFx0YmxvZ05hdi5pbml0KCk7XG5cdH1cblxuXHRpZiAocGF0aCA9PT0gJy93b3Jrcy5odG1sJyB8fCBwYXRoID09PSAnL3dvcmtzJykge1xuXHRcdHNsaWRlci5pbml0KCk7XG5cdFx0c2xpZGVyVGV4dC5pbml0KCk7XG5cdH1cblxuXHRpZiAocGF0aCA9PT0gJy9hYm91dG1lLmh0bWwnIHx8IHBhdGggPT09ICcvYWJvdXRtZScpIHtcblx0XHRnb29nbGVNYXAuaW5pdCgpO1xuXHRcdGRpYWdyYW0uaW5pdCgpO1xuXHR9XG5cblx0aWYgKHBhdGggPT09ICcvYWRtaW4uaHRtbCcgfHwgcGF0aCA9PT0gJy9hZG1pbicpIHtcblx0XHR0YWIuaW5pdCgpO1xuXHR9XG5cblx0aWYgKHBhdGggIT09ICdhZG1pbicpIHtcblx0XHRzY3JvbGxBcnJvdy5pbml0KCk7XG5cdFx0YWRtaW4uaW5pdCgpO1xuXHR9XG5cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
