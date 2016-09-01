// google.maps.event.addDomListener(window, 'load', init);
"use strict";

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
      var elemBottom = $(elem).offset().top + $(elem).height();
      var windowBottom = scroll + $(window).height();
      var elemBottomPos = windowBottom - elemBottom - 100;
      var elemTopPos = $(elem).offset().top - scroll;

      if (elemTopPos < 0 || elemBottomPos > 0) {
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

			var layer = $('.parallax').find('.parallax__layer');

			layer.map(function(key, value) {
				var bottomPosition = ((window.innerHeight / 2) * (key / 100));
				$(value).css({
					'bottom': '-' + bottomPosition + 'px',
					'transform': 'translate3d(0px, 0px, 0)'
				});
			});

		if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			return
		}
			$(window).on('mousemove', function(e) {
				var mouse_dx = (e.pageX);
				var mouse_dy = (e.pageY);

				var w = (window.innerWidth / 2) - mouse_dx;
				var h = (window.innerHeight / 2) - mouse_dy;

				layer.map(function(key, value) {
					var bottomPosition = ((window.innerHeight / 2) * (key / 100));
					var widthPosition = w * (key / 80);
					var heightPosition = h * (key / 80);
					$(value).css({
						'bottom': '-' + bottomPosition + 'px',
						'transform': 'translate3d(' + widthPosition + 'px, ' + heightPosition + 'px, 0)'
					});
				});
			});
	}

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
		if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
			return
		}

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

	var time = 250;
	var anotherState;

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
			var $this = $(this);
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
			var $this = $(this);

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdvb2dsZU1hcC5qcyIsImJsb2dOYXYuanMiLCJwcmVsb2FkZXIuanMiLCJwYXJhbGxheC5qcyIsImZsaXBwZXIuanMiLCJzY3JvbGwuanMiLCJzbGlkZXIuanMiLCJzbGlkZXJUZXh0LmpzIiwidGFiLmpzIiwiZGlhZ3JhbS5qcyIsInNjcm9sbEFycm93LmpzIiwidmFsaWRhdGlvbi5qcyIsImFkbWluLmpzIiwiYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBnb29nbGUubWFwcy5ldmVudC5hZGREb21MaXN0ZW5lcih3aW5kb3csICdsb2FkJywgaW5pdCk7XG5cInVzZSBzdHJpY3RcIjtcblxudmFyIGdvb2dsZU1hcCA9IChmdW5jdGlvbigpIHtcblxuXHR2YXIgbWFwO1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0dmFyIG1hcE9wdGlvbnMgPSB7XG5cdFx0XHRjZW50ZXI6IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoNTkuMjk5Mzc2LCAyNi41MzA3MjMpLFxuXHRcdFx0em9vbTogNCxcblx0XHRcdHpvb21Db250cm9sOiB0cnVlLFxuXHRcdFx0em9vbUNvbnRyb2xPcHRpb25zOiB7XG5cdFx0XHRcdHN0eWxlOiBnb29nbGUubWFwcy5ab29tQ29udHJvbFN0eWxlLkRFRkFVTFQsXG5cdFx0XHR9LFxuXHRcdFx0ZGlzYWJsZURvdWJsZUNsaWNrWm9vbTogdHJ1ZSxcblx0XHRcdG1hcFR5cGVDb250cm9sOiBmYWxzZSxcblx0XHRcdHNjYWxlQ29udHJvbDogZmFsc2UsXG5cdFx0XHRzY3JvbGx3aGVlbDogZmFsc2UsXG5cdFx0XHRwYW5Db250cm9sOiBmYWxzZSxcblx0XHRcdHN0cmVldFZpZXdDb250cm9sOiBmYWxzZSxcblx0XHRcdGRyYWdnYWJsZTogZmFsc2UsXG5cdFx0XHRvdmVydmlld01hcENvbnRyb2w6IGZhbHNlLFxuXHRcdFx0b3ZlcnZpZXdNYXBDb250cm9sT3B0aW9uczoge1xuXHRcdFx0XHRvcGVuZWQ6IGZhbHNlLFxuXHRcdFx0fSxcblx0XHRcdG1hcFR5cGVJZDogZ29vZ2xlLm1hcHMuTWFwVHlwZUlkLlJPQURNQVAsXG5cdFx0XHRzdHlsZXM6IFt7XG5cdFx0XHRcdFwiZmVhdHVyZVR5cGVcIjogXCJhZG1pbmlzdHJhdGl2ZVwiLFxuXHRcdFx0XHRcImVsZW1lbnRUeXBlXCI6IFwiYWxsXCIsXG5cdFx0XHRcdFwic3R5bGVyc1wiOiBbe1xuXHRcdFx0XHRcdFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuXHRcdFx0XHR9XVxuXHRcdFx0fSwge1xuXHRcdFx0XHRcImZlYXR1cmVUeXBlXCI6IFwibGFuZHNjYXBlXCIsXG5cdFx0XHRcdFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuXHRcdFx0XHRcInN0eWxlcnNcIjogW3tcblx0XHRcdFx0XHRcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFwiY29sb3JcIjogXCIjZmNmY2ZjXCJcblx0XHRcdFx0fV1cblx0XHRcdH0sIHtcblx0XHRcdFx0XCJmZWF0dXJlVHlwZVwiOiBcInBvaVwiLFxuXHRcdFx0XHRcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcblx0XHRcdFx0XCJzdHlsZXJzXCI6IFt7XG5cdFx0XHRcdFx0XCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcImNvbG9yXCI6IFwiI2ZjZmNmY1wiXG5cdFx0XHRcdH1dXG5cdFx0XHR9LCB7XG5cdFx0XHRcdFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmhpZ2h3YXlcIixcblx0XHRcdFx0XCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG5cdFx0XHRcdFwic3R5bGVyc1wiOiBbe1xuXHRcdFx0XHRcdFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XCJjb2xvclwiOiBcIiNkZGRkZGRcIlxuXHRcdFx0XHR9XVxuXHRcdFx0fSwge1xuXHRcdFx0XHRcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5hcnRlcmlhbFwiLFxuXHRcdFx0XHRcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcblx0XHRcdFx0XCJzdHlsZXJzXCI6IFt7XG5cdFx0XHRcdFx0XCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcImNvbG9yXCI6IFwiI2RkZGRkZFwiXG5cdFx0XHRcdH1dXG5cdFx0XHR9LCB7XG5cdFx0XHRcdFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmxvY2FsXCIsXG5cdFx0XHRcdFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuXHRcdFx0XHRcInN0eWxlcnNcIjogW3tcblx0XHRcdFx0XHRcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFwiY29sb3JcIjogXCIjZWVlZWVlXCJcblx0XHRcdFx0fV1cblx0XHRcdH0sIHtcblx0XHRcdFx0XCJmZWF0dXJlVHlwZVwiOiBcIndhdGVyXCIsXG5cdFx0XHRcdFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuXHRcdFx0XHRcInN0eWxlcnNcIjogW3tcblx0XHRcdFx0XHRcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFwiY29sb3JcIjogXCIjMDBiZmE1XCJcblx0XHRcdFx0fV1cblx0XHRcdH1dLFxuXHRcdH1cblx0XHR2YXIgbWFwRWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKTtcblx0XHR2YXIgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChtYXBFbGVtZW50LCBtYXBPcHRpb25zKTtcblx0XHR2YXIgbG9jYXRpb25zID0gW1xuXHRcdFx0WydPbGVnIEtvcm9sa28nLCAndW5kZWZpbmVkJywgJ3VuZGVmaW5lZCcsICcnLCAndW5kZWZpbmVkJywgNTkuOTM0MjgwMiwgMzAuMzM1MDk4NjAwMDAwMDM4LCAnaHR0cHM6Ly9tYXBidWlsZHIuY29tL2Fzc2V0cy9pbWcvbWFya2Vycy9lbGxpcHNlLXJlZC5wbmcnXVxuXHRcdF07XG5cdFx0Zm9yIChpID0gMDsgaSA8IGxvY2F0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKGxvY2F0aW9uc1tpXVsxXSA9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRkZXNjcmlwdGlvbiA9ICcnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZGVzY3JpcHRpb24gPSBsb2NhdGlvbnNbaV1bMV07XG5cdFx0XHR9XG5cdFx0XHRpZiAobG9jYXRpb25zW2ldWzJdID09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHRlbGVwaG9uZSA9ICcnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGVsZXBob25lID0gbG9jYXRpb25zW2ldWzJdO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGxvY2F0aW9uc1tpXVszXSA9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRlbWFpbCA9ICcnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZW1haWwgPSBsb2NhdGlvbnNbaV1bM107XG5cdFx0XHR9XG5cdFx0XHRpZiAobG9jYXRpb25zW2ldWzRdID09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHdlYiA9ICcnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0d2ViID0gbG9jYXRpb25zW2ldWzRdO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGxvY2F0aW9uc1tpXVs3XSA9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHRtYXJrZXJpY29uID0gJyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtYXJrZXJpY29uID0gbG9jYXRpb25zW2ldWzddO1xuXHRcdFx0fVxuXHRcdFx0bWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG5cdFx0XHRcdGljb246IG1hcmtlcmljb24sXG5cdFx0XHRcdHBvc2l0aW9uOiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxvY2F0aW9uc1tpXVs1XSwgbG9jYXRpb25zW2ldWzZdKSxcblx0XHRcdFx0bWFwOiBtYXAsXG5cdFx0XHRcdHRpdGxlOiBsb2NhdGlvbnNbaV1bMF0sXG5cdFx0XHRcdGRlc2M6IGRlc2NyaXB0aW9uLFxuXHRcdFx0XHR0ZWw6IHRlbGVwaG9uZSxcblx0XHRcdFx0ZW1haWw6IGVtYWlsLFxuXHRcdFx0XHR3ZWI6IHdlYlxuXHRcdFx0fSk7XG5cdFx0XHRsaW5rID0gJyc7XG5cdFx0XHRiaW5kSW5mb1dpbmRvdyhtYXJrZXIsIG1hcCwgbG9jYXRpb25zW2ldWzBdLCBkZXNjcmlwdGlvbiwgdGVsZXBob25lLCBlbWFpbCwgd2ViLCBsaW5rKTtcblx0XHR9XG5cblx0XHRmdW5jdGlvbiBiaW5kSW5mb1dpbmRvdyhtYXJrZXIsIG1hcCwgdGl0bGUsIGRlc2MsIHRlbGVwaG9uZSwgZW1haWwsIHdlYiwgbGluaykge1xuXHRcdFx0dmFyIGluZm9XaW5kb3dWaXNpYmxlID0gKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgY3VycmVudGx5VmlzaWJsZSA9IGZhbHNlO1xuXHRcdFx0XHRyZXR1cm4gZnVuY3Rpb24odmlzaWJsZSkge1xuXHRcdFx0XHRcdGlmICh2aXNpYmxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRcdFx0XHRcdGN1cnJlbnRseVZpc2libGUgPSB2aXNpYmxlO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRyZXR1cm4gY3VycmVudGx5VmlzaWJsZTtcblx0XHRcdFx0fTtcblx0XHRcdH0oKSk7XG5cdFx0XHRpdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KCk7XG5cdFx0XHRnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoaW5mb1dpbmRvd1Zpc2libGUoKSkge1xuXHRcdFx0XHRcdGl3LmNsb3NlKCk7XG5cdFx0XHRcdFx0aW5mb1dpbmRvd1Zpc2libGUoZmFsc2UpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhciBodG1sID0gXCI8ZGl2IHN0eWxlPSdjb2xvcjojMDAwO2JhY2tncm91bmQtY29sb3I6I2ZmZjtwYWRkaW5nOjVweDt3aWR0aDoxNTBweDsnPjwvZGl2PlwiO1xuXHRcdFx0XHRcdGl3ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xuXHRcdFx0XHRcdFx0Y29udGVudDogaHRtbFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGl3Lm9wZW4obWFwLCBtYXJrZXIpO1xuXHRcdFx0XHRcdGluZm9XaW5kb3dWaXNpYmxlKHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKGl3LCAnY2xvc2VjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpbmZvV2luZG93VmlzaWJsZShmYWxzZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG5cblx0fSgpKVxuIiwidmFyIGJsb2dOYXYgPSAoZnVuY3Rpb24oKSB7XG5cbiAgdmFyIHNpZGVCYXIgPSAkKCcuYmxvZy1tZW51Jyk7XG4gIHZhciBzaWRlQmFyRWxlbSA9ICQoJy5ibG9nLW1lbnUtZWxlbScpO1xuICB2YXIgc2VjdGlvbiA9ICQoJy5ibG9nLWFydGljbGUnKTtcblxuICBmdW5jdGlvbiBfc2V0VXBFdmVudExpc3RlbmVycygpIHtcbiAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xuICAgICAgX3Njcm9sbGVkKClcbiAgICB9KTtcblxuICAgIHNpZGVCYXJFbGVtLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGlkID0gJCh0aGlzKS5kYXRhKCdpZCcpO1xuICAgICAgdmFyIHRvcCA9ICQoc2VjdGlvbi5lcShpZCkpLm9mZnNldCgpLnRvcDtcblxuICAgICAgJCgnYm9keScpLmFuaW1hdGUoe1xuICAgICAgICBzY3JvbGxUb3A6IHRvcFxuICAgICAgfSwgMzAwKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9zY3JvbGxlZCgpIHtcbiAgICB2YXIgc2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgdmFyIG1lbnVUb3BQb3MgPSAkKHNlY3Rpb24uZXEoMCkpLm9mZnNldCgpLnRvcCAtIHNjcm9sbDtcbiAgICBpZiAobWVudVRvcFBvcyA8IDEwKSB7XG4gICAgICAkKHNpZGVCYXIpLmFkZENsYXNzKCdmaXhlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKHNpZGVCYXIpLnJlbW92ZUNsYXNzKCdmaXhlZCcpO1xuICAgIH1cblxuICAgIHNlY3Rpb24uZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsZW0pIHtcbiAgICAgIHZhciBlbGVtQm90dG9tID0gJChlbGVtKS5vZmZzZXQoKS50b3AgKyAkKGVsZW0pLmhlaWdodCgpO1xuICAgICAgdmFyIHdpbmRvd0JvdHRvbSA9IHNjcm9sbCArICQod2luZG93KS5oZWlnaHQoKTtcbiAgICAgIHZhciBlbGVtQm90dG9tUG9zID0gd2luZG93Qm90dG9tIC0gZWxlbUJvdHRvbSAtIDEwMDtcbiAgICAgIHZhciBlbGVtVG9wUG9zID0gJChlbGVtKS5vZmZzZXQoKS50b3AgLSBzY3JvbGw7XG5cbiAgICAgIGlmIChlbGVtVG9wUG9zIDwgMCB8fCBlbGVtQm90dG9tUG9zID4gMCkge1xuICAgICAgICBzaWRlQmFyRWxlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIHNpZGVCYXJFbGVtLmVxKGluZGV4KS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgJChzaWRlQmFyRWxlbS5lcSgwKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIF9zZXRVcEV2ZW50TGlzdGVuZXJzKCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXQ6IGluaXRcbiAgfVxufSkoKTsiLCJ2YXIgcHJlbG9hZGVyID0gKGZ1bmN0aW9uKCkge1xuXG5cdHZhclxuXHQvLyDQvNCw0YHRgdC40LIg0LTQu9GPINCy0YHQtdGFINC40LfQvtCx0YDQsNC20LXQvdC40Lkg0L3QsCDRgdGC0YDQsNC90LjRhtC1XG5cdFx0X2ltZ3MgPSBbXSxcblxuXHRcdC8vINCx0YPQtNC10YIg0LjRgdC/0L7Qu9GM0LfQvtCy0LDRgtGM0YHRjyDQuNC3INC00YDRg9Cz0LjRhSDQvNC+0LTRg9C70LXQuSwg0YfRgtC+0LHRiyDQv9GA0L7QstC10YDQuNGC0YwsINC+0YLRgNC40YHQvtCy0LDQvdGLINC70Lgg0LLRgdC1INGN0LvQtdC80LXQvdGC0Ytcblx0XHQvLyDRgi7Qui4gZG9jdW1lbnQucmVhZHkg0LjQty3Qt9CwINC/0YDQtdC70L7QsNC00LXRgNCwINGB0YDQsNCx0LDRgtGL0LLQsNC10YIg0YDQsNC90YzRiNC1LCDQutC+0LPQtNCwINC+0YLRgNC40YHQvtCy0LDQvSDQv9GA0LXQu9C+0LDQtNC10YAsINCwINC90LUg0LLRgdGPINGB0YLRgNCw0L3QuNGG0LBcblx0XHRjb250ZW50UmVhZHkgPSAkLkRlZmVycmVkKCk7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRfY291bnRJbWFnZXMoKTtcblx0XHRfc3RhcnRQcmVsb2FkZXIoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIF9jb3VudEltYWdlcygpIHtcblxuXHRcdC8vINC/0YDQvtGF0L7QtNC40Lwg0L/QviDQstGB0LXQvCDRjdC70LXQvNC10L3RgtCw0Lwg0L3QsCDRgdGC0YDQsNC90LjRhtC1XG5cdFx0JC5lYWNoKCQoJyonKSwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpLFxuXHRcdFx0XHRiYWNrZ3JvdW5kID0gJHRoaXMuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJyksXG5cdFx0XHRcdGltZyA9ICR0aGlzLmlzKCdpbWcnKTtcblxuXHRcdFx0Ly8g0LfQsNC/0LjRgdGL0LLQsNC10Lwg0LIg0LzQsNGB0YHQuNCyINCy0YHQtSDQv9GD0YLQuCDQuiDQsdGN0LrQs9GA0LDRg9C90LTQsNC8XG5cdFx0XHRpZiAoYmFja2dyb3VuZCAhPSAnbm9uZScpIHtcblxuXHRcdFx0XHQvLyDQsiBjaHJvbWUg0LIg0YPRgNC70LUg0LXRgdGC0Ywg0LrQsNCy0YvRh9C60LgsINCy0YvRgNC10LfQsNC10Lwg0YEg0L3QuNC80LguIHVybChcIi4uLlwiKSAtPiAuLi5cblx0XHRcdFx0Ly8g0LIgc2FmYXJpINCyINGD0YDQu9C1INC90LXRgiDQutCw0LLRi9GH0LXQuiwg0LLRi9GA0LXQt9Cw0LXQvCDQsdC10Lcg0L3QuNGFLiB1cmwoIC4uLiApIC0+IC4uLlxuXHRcdFx0XHR2YXIgcGF0aCA9IGJhY2tncm91bmQucmVwbGFjZSgndXJsKFwiJywgXCJcIikucmVwbGFjZSgnXCIpJywgXCJcIik7XG5cdFx0XHRcdHZhciBwYXRoID0gcGF0aC5yZXBsYWNlKCd1cmwoJywgXCJcIikucmVwbGFjZSgnKScsIFwiXCIpO1xuXG5cdFx0XHRcdF9pbWdzLnB1c2gocGF0aCk7XG5cdFx0XHR9XG5cdFx0XHQvLyDQt9Cw0L/QuNGB0YvQstCw0LXQvCDQsiDQvNCw0YHRgdC40LIg0LLRgdC1INC/0YPRgtC4INC6INC60LDRgNGC0LjQvdC60LDQvFxuXHRcdFx0aWYgKGltZykge1xuXHRcdFx0XHR2YXIgcGF0aCA9ICcnICsgJHRoaXMuYXR0cignc3JjJyk7XG5cdFx0XHRcdGlmICgocGF0aCkgJiYgKCR0aGlzLmNzcygnZGlzcGxheScpICE9PSAnbm9uZScpKSB7XG5cdFx0XHRcdFx0X2ltZ3MucHVzaChwYXRoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gX3N0YXJ0UHJlbG9hZGVyKCkge1xuXG5cdFx0JCgnYm9keScpLmFkZENsYXNzKCdvdmVyZmxvdy1oaWRkZW4nKTtcblxuXHRcdC8vINC30LDQs9GA0YPQttC10L3QviAwINC60LDRgNGC0LjQvdC+0Lpcblx0XHR2YXIgbG9hZGVkID0gMDtcblxuXHRcdC8vINC/0YDQvtGF0L7QtNC40Lwg0L/QviDQstGB0LXQvCDRgdC+0LHRgNCw0L3QvdGL0Lwg0LrQsNGA0YLQuNC90LrQsNC8XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBfaW1ncy5sZW5ndGg7IGkrKykge1xuXG5cdFx0XHR2YXIgaW1hZ2UgPSAkKCc8aW1nPicsIHtcblx0XHRcdFx0YXR0cjoge1xuXHRcdFx0XHRcdHNyYzogX2ltZ3NbaV1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdC8vINC30LDQs9GA0YPQttCw0LXQvCDQv9C+INC/0L7QtNC90L7QuVxuXHRcdFx0JChpbWFnZSkubG9hZChmdW5jdGlvbigpIHtcblx0XHRcdFx0bG9hZGVkKys7XG5cdFx0XHRcdHZhciBwZXJjZW50TG9hZGVkID0gX2NvdW50UGVyY2VudChsb2FkZWQsIF9pbWdzLmxlbmd0aCk7XG5cdFx0XHRcdF9zZXRQZXJjZW50KHBlcmNlbnRMb2FkZWQpO1xuXHRcdFx0fSk7XG5cblx0XHR9XG5cdH1cblxuXHQvLyDQv9C10YDQtdGB0YfQuNGC0YvQstCw0LXRgiDQsiDQv9GA0L7RhtC10L3RgtGLLCDRgdC60L7Qu9GM0LrQviDQutCw0YDRgtC40L3QvtC6INC30LDQs9GA0YPQttC10L3QvlxuXHQvLyBjdXJyZW50IC0gbnVtYmVyLCDRgdC60L7Qu9GM0LrQviDQutCw0YDRgtC40L3QvtC6INC30LDQs9GA0YPQttC10L3QvlxuXHQvLyB0b3RhbCAtIG51bWJlciwg0YHQutC+0LvRjNC60L4g0LjRhSDQstGB0LXQs9C+XG5cdGZ1bmN0aW9uIF9jb3VudFBlcmNlbnQoY3VycmVudCwgdG90YWwpIHtcblx0XHRyZXR1cm4gTWF0aC5jZWlsKGN1cnJlbnQgLyB0b3RhbCAqIDEwMCk7XG5cdH1cblxuXHQvLyDQt9Cw0L/QuNGB0YvQstCw0LXRgiDQv9GA0L7RhtC10L3RgiDQsiBkaXYg0L/RgNC10LvQvtCw0LTQtdGAXG5cdC8vIHBlcmNlbnQgLSBudW1iZXIsINC60LDQutGD0Y4g0YbQuNGE0YDRgyDQt9Cw0L/QuNGB0LDRgtGMXG5cdGZ1bmN0aW9uIF9zZXRQZXJjZW50KHBlcmNlbnQpIHtcblxuXHRcdCQoJy5wcmVsb2FkZXJfdGV4dCcpLnRleHQocGVyY2VudCk7XG5cblx0XHQvL9C60L7Qs9C00LAg0LTQvtGI0LvQuCDQtNC+IDEwMCUsINGB0LrRgNGL0LLQsNC10Lwg0L/RgNC10LvQvtCw0LTQtdGAINC4INC/0L7QutCw0LfRi9Cy0LDQtdC8INGB0L7QtNC10YDQttC40LzQvtC1INGB0YLRgNCw0L3QuNGG0Ytcblx0XHRpZiAocGVyY2VudCA+PSAxMDApIHtcblx0XHRcdCQoJy5wcmVsb2FkZXJfY29udGFpbmVyJykuZGVsYXkoNzAwKS5mYWRlT3V0KDUwMCk7XG5cdFx0XHQkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ292ZXJmbG93LWhpZGRlbicpO1xuXHRcdFx0X2ZpbmlzaFByZWxvYWRlcigpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIF9maW5pc2hQcmVsb2FkZXIoKSB7XG5cdFx0Y29udGVudFJlYWR5LnJlc29sdmUoKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdCxcblx0XHRjb250ZW50UmVhZHk6IGNvbnRlbnRSZWFkeVxuXHR9O1xuXG59KSgpO1xuIiwidmFyIHBhcmFsbGF4ID0gKGZ1bmN0aW9uKCkge1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cblx0XHRcdHZhciBsYXllciA9ICQoJy5wYXJhbGxheCcpLmZpbmQoJy5wYXJhbGxheF9fbGF5ZXInKTtcblxuXHRcdFx0bGF5ZXIubWFwKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcblx0XHRcdFx0dmFyIGJvdHRvbVBvc2l0aW9uID0gKCh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAqIChrZXkgLyAxMDApKTtcblx0XHRcdFx0JCh2YWx1ZSkuY3NzKHtcblx0XHRcdFx0XHQnYm90dG9tJzogJy0nICsgYm90dG9tUG9zaXRpb24gKyAncHgnLFxuXHRcdFx0XHRcdCd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoMHB4LCAwcHgsIDApJ1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0aWYoL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG5cdFx0XHRyZXR1cm5cblx0XHR9XG5cdFx0XHQkKHdpbmRvdykub24oJ21vdXNlbW92ZScsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0dmFyIG1vdXNlX2R4ID0gKGUucGFnZVgpO1xuXHRcdFx0XHR2YXIgbW91c2VfZHkgPSAoZS5wYWdlWSk7XG5cblx0XHRcdFx0dmFyIHcgPSAod2luZG93LmlubmVyV2lkdGggLyAyKSAtIG1vdXNlX2R4O1xuXHRcdFx0XHR2YXIgaCA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAtIG1vdXNlX2R5O1xuXG5cdFx0XHRcdGxheWVyLm1hcChmdW5jdGlvbihrZXksIHZhbHVlKSB7XG5cdFx0XHRcdFx0dmFyIGJvdHRvbVBvc2l0aW9uID0gKCh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAqIChrZXkgLyAxMDApKTtcblx0XHRcdFx0XHR2YXIgd2lkdGhQb3NpdGlvbiA9IHcgKiAoa2V5IC8gODApO1xuXHRcdFx0XHRcdHZhciBoZWlnaHRQb3NpdGlvbiA9IGggKiAoa2V5IC8gODApO1xuXHRcdFx0XHRcdCQodmFsdWUpLmNzcyh7XG5cdFx0XHRcdFx0XHQnYm90dG9tJzogJy0nICsgYm90dG9tUG9zaXRpb24gKyAncHgnLFxuXHRcdFx0XHRcdFx0J3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGhQb3NpdGlvbiArICdweCwgJyArIGhlaWdodFBvc2l0aW9uICsgJ3B4LCAwKSdcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG5cbn0oKSk7XG4iLCJ2YXIgZmxpcHBlciA9IChmdW5jdGlvbigpIHtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdHNldFVwRXZlbnRMaXN0ZW5lcnMoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFVwRXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0dmFyIGF1dGhFbGVtID0gJCgnLmF1dGhvcml6ZScpO1xuXHRcdHZhciBmbGlwRWxlbSA9ICQoJy5mbGlwJyk7XG5cdFx0dmFyIG91dHNpZGVFbGVtID0gJCgnLnBhcmFsbGF4X19sYXllcicpO1xuXHRcdHZhciBiYWNrID0gJCgnI2JhY2tUb01haW4nKTtcblxuXG5cdFx0b3V0c2lkZUVsZW0uY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0aWYoZS50YXJnZXQuaWQgIT0gJ2F1dGhvcml6ZScgJiYgZS50YXJnZXQuaWQgIT0gJ2F1dGhvcml6ZV9kaXYnKSB7XG5cdFx0XHRcdGF1dGhFbGVtLmZhZGVJbigzMDApO1xuXHRcdFx0XHRmbGlwRWxlbS5yZW1vdmVDbGFzcygnZmxpcHBpbmcnKVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0YXV0aEVsZW0uY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0YXV0aEVsZW0uZmFkZU91dCgzMDApO1xuXHRcdFx0ZmxpcEVsZW0udG9nZ2xlQ2xhc3MoJ2ZsaXBwaW5nJylcblx0XHR9KTtcblxuXHRcdGJhY2suY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0ZmxpcEVsZW0ucmVtb3ZlQ2xhc3MoJ2ZsaXBwaW5nJyk7XG5cdFx0XHRhdXRoRWxlbS5mYWRlSW4oMzAwKTtcblx0XHR9KVxuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cbn0oKSk7XG4iLCJ2YXIgc2Nyb2xsID0gKGZ1bmN0aW9uKCkge1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0aWYoL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG5cdFx0XHRyZXR1cm5cblx0XHR9XG5cblx0XHR2YXIgbGF5ZXJzID0gJCgnLnBhcmFsbGF4LXNjcm9sbF9fbGF5ZXInKTtcblx0XHRcdHZhciBtYWluID0gJCgnLm1haW4nKTtcblxuXHRcdFx0JCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIHNjcm9sbFRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblxuXHRcdFx0XHRsYXllcnMubWFwKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcblx0XHRcdFx0XHR2YXIgYm90dG9tUG9zaXRpb24gPSBzY3JvbGxUb3AgKiBrZXkgLyA5MDtcblx0XHRcdFx0XHR2YXIgaGVpZ2h0UG9zaXRpb24gPSAtc2Nyb2xsVG9wICoga2V5IC8gOTA7XG5cblx0XHRcdFx0XHQkKHZhbHVlKS5jc3Moe1xuXHRcdFx0XHRcdFx0J3RvcCc6ICctJyArIGJvdHRvbVBvc2l0aW9uICsgJ3B4Jyxcblx0XHRcdFx0XHRcdCd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoMCwnICsgaGVpZ2h0UG9zaXRpb24gKyAncHgsIDApJ1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZhciB0b3BQb3MgPSBzY3JvbGxUb3AgLyA3O1xuXHRcdFx0XHR2YXIgYm90dG9tUG9zID0gLXNjcm9sbFRvcCAvIDc7XG5cdFx0XHRcdG1haW4uY3NzKHtcblx0XHRcdFx0XHQndG9wJzogJy0nICsgdG9wUG9zICsgJ3B4Jyxcblx0XHRcdFx0XHQndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZTNkKDAsJyArIGJvdHRvbVBvcyArICdweCwgMCknXG5cdFx0XHRcdH0pXG5cdFx0XHR9KVxuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cblxufSgpKTtcbiIsInZhciBzbGlkZXIgPSAoZnVuY3Rpb24oKSB7XG5cblx0Ly9BcnJheXMgb2YgaW1hZ2VzIGluIGVhY2ggc2xpZGVyIHBhcnRcblx0dmFyIG1haW5JbWFnZXMgPSAkKCcuc2xpZGVyX19tYWluLWltZ19jb250YWluZXInKTtcblx0dmFyIHByZXZJbWFnZXMgPSAkKCcubmV4dFNsaWRlSW1nJyk7XG5cdHZhciBuZXh0SW1hZ2VzID0gJCgnLnByZXZTbGlkZUltZycpO1xuXG5cdC8vIENvbnRyb2wgYnV0dG9uc1xuXHR2YXIgbmV4dFNsaWRlID0gJCgnLnNsaWRlcl9fbmV4dCcpO1xuXHR2YXIgcHJldlNsaWRlID0gJCgnLnNsaWRlcl9fcHJldicpO1xuXHR2YXIgY3VycmVudCA9IDA7XG5cblx0dmFyIHRpbWUgPSAyNTA7XG5cdHZhciBhbm90aGVyU3RhdGU7XG5cblx0dmFyIGN1cnJlbnRTbGlkZSA9IDA7XG5cdGZ1bmN0aW9uIF9yZW5kZXJNYWluKGNoYW5nZSkge1xuXHRcdGFub3RoZXJTdGF0ZSA9ICQuRGVmZXJyZWQoKTtcblxuXHRcdG1haW5JbWFnZXMuZXEoY3VycmVudFNsaWRlKS5mYWRlT3V0KDE1MCk7XG5cblx0XHRpZihjaGFuZ2UgPT09ICdpbmNyZWFzZScpIHtcblx0XHRcdGN1cnJlbnRTbGlkZSsrO1xuXHRcdFx0Y3VycmVudFNsaWRlID0gY3VycmVudFNsaWRlID4gbWFpbkltYWdlcy5sZW5ndGggLSAxID8gMCA6IGN1cnJlbnRTbGlkZTtcblx0XHR9IGVsc2UgaWYoY2hhbmdlID09PSAnZGVjcmVhc2UnKSB7XG5cdFx0XHRjdXJyZW50U2xpZGUtLTtcblx0XHRcdGN1cnJlbnRTbGlkZSA9IGN1cnJlbnRTbGlkZSA8IDAgPyBtYWluSW1hZ2VzLmxlbmd0aCAtIDEgOiBjdXJyZW50U2xpZGU7XG5cdFx0fVxuXG5cdFx0bWFpbkltYWdlcy5lcShjdXJyZW50U2xpZGUpLmRlbGF5KDEwMCkuZmFkZUluKDE1MCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRhbm90aGVyU3RhdGUucmVzb2x2ZSgpO1xuXHRcdH0pO1xuXHR9XG5cblxuXHR2YXIgY3VycmVudE5leHQgPSAxO1xuXHRmdW5jdGlvbiBfc2xpZGVyTmV4dEJ1dHRvbk5leHQoKSB7XG5cdFx0XHRuZXh0SW1hZ2VzLmVxKGN1cnJlbnROZXh0KS5hbmltYXRlKHtcblx0XHRcdFx0dG9wOiAnLTEwMCUnXG5cdFx0XHR9LCB0aW1lICk7XG5cblx0XHRcdGN1cnJlbnROZXh0Kys7XG5cdFx0XHRjdXJyZW50TmV4dCA9IGN1cnJlbnROZXh0ID4gbWFpbkltYWdlcy5sZW5ndGggLSAxID8gMCA6IGN1cnJlbnROZXh0O1xuXG5cdFx0XHRuZXh0SW1hZ2VzLmVxKGN1cnJlbnROZXh0KS5hbmltYXRlKHtcblx0XHRcdFx0ZGlzcGxheTogJ25vbmUnLFxuXHRcdFx0XHR0b3A6ICcxMDAlJ1xuXHRcdFx0fSwgMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdG5leHRJbWFnZXMuZXEoY3VycmVudE5leHQpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXHRcdFx0fSk7XG5cblx0XHRcdG5leHRJbWFnZXMuZXEoY3VycmVudE5leHQpLmFuaW1hdGUoe1xuXHRcdFx0XHR0b3A6ICcwJ1xuXHRcdFx0fSwgdGltZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBfc2xpZGVyTmV4dEJ1dHRvblByZXYoKSB7XG5cdFx0bmV4dEltYWdlcy5lcShjdXJyZW50TmV4dCkuYW5pbWF0ZSh7XG5cdFx0XHR0b3A6ICcrMTAwJSdcblx0XHR9LCB0aW1lICk7XG5cblx0XHRjdXJyZW50TmV4dC0tO1xuXHRcdGN1cnJlbnROZXh0ID0gY3VycmVudE5leHQgPCAwID8gbWFpbkltYWdlcy5sZW5ndGggLSAxIDogY3VycmVudE5leHQ7XG5cblx0XHRuZXh0SW1hZ2VzLmVxKGN1cnJlbnROZXh0KS5hbmltYXRlKHtcblx0XHRcdGRpc3BsYXk6ICdub25lJyxcblx0XHRcdHRvcDogJy0xMDAlJ1xuXHRcdH0sIDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0bmV4dEltYWdlcy5lcShjdXJyZW50TmV4dCkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cdFx0fSk7XG5cblx0XHRuZXh0SW1hZ2VzLmVxKGN1cnJlbnROZXh0KS5hbmltYXRlKHtcblx0XHRcdHRvcDogJzAnXG5cdFx0fSwgdGltZSk7XG5cdH1cblxuXG5cdHZhciBjdXJyZW50UHJldiA9IG1haW5JbWFnZXMubGVuZ3RoIC0gMTtcblx0ZnVuY3Rpb24gX3NsaWRlclByZXZCdXR0b25OZXh0KCkge1xuXHRcdHByZXZJbWFnZXMuZXEoY3VycmVudFByZXYpLmFuaW1hdGUoe1xuXHRcdFx0dG9wOiAnKzEwMCUnXG5cdFx0fSwgdGltZSApO1xuXG5cdFx0Y3VycmVudFByZXYrKztcblx0XHRjdXJyZW50UHJldiA9IGN1cnJlbnRQcmV2ID4gbWFpbkltYWdlcy5sZW5ndGggLSAxID8gMCA6IGN1cnJlbnRQcmV2O1xuXG5cdFx0cHJldkltYWdlcy5lcShjdXJyZW50UHJldikuYW5pbWF0ZSh7XG5cdFx0XHRkaXNwbGF5OiAnbm9uZScsXG5cdFx0XHR0b3A6ICctMTAwJSdcblx0XHR9LCAwLCBmdW5jdGlvbigpIHtcblx0XHRcdHByZXZJbWFnZXMuZXEoY3VycmVudFByZXYpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXHRcdH0pO1xuXG5cdFx0cHJldkltYWdlcy5lcShjdXJyZW50UHJldikuYW5pbWF0ZSh7XG5cdFx0XHR0b3A6ICcwJ1xuXHRcdH0sIHRpbWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gX3NsaWRlclByZXZCdXR0b25QcmV2KCkge1xuXHRcdHByZXZJbWFnZXMuZXEoY3VycmVudFByZXYpLmFuaW1hdGUoe1xuXHRcdFx0dG9wOiAnLTEwMCUnXG5cdFx0fSwgdGltZSApO1xuXG5cdFx0Y3VycmVudFByZXYtLTtcblx0XHRjdXJyZW50UHJldiA9IGN1cnJlbnRQcmV2IDwgMCA/IG1haW5JbWFnZXMubGVuZ3RoIC0gMSA6IGN1cnJlbnRQcmV2O1xuXG5cdFx0cHJldkltYWdlcy5lcShjdXJyZW50UHJldikuYW5pbWF0ZSh7XG5cdFx0XHRkaXNwbGF5OiAnbm9uZScsXG5cdFx0XHR0b3A6ICcrMTAwJSdcblx0XHR9LCAwLCBmdW5jdGlvbigpIHtcblx0XHRcdHByZXZJbWFnZXMuZXEoY3VycmVudFByZXYpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXHRcdH0pO1xuXG5cdFx0cHJldkltYWdlcy5lcShjdXJyZW50UHJldikuYW5pbWF0ZSh7XG5cdFx0XHR0b3A6ICcwJ1xuXHRcdH0sIHRpbWUpO1xuXHR9XG5cblxuXHRuZXh0U2xpZGUuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0JC53aGVuKF9yZW5kZXJNYWluKCdpbmNyZWFzZScpLCBfc2xpZGVyTmV4dEJ1dHRvbk5leHQoKSwgX3NsaWRlclByZXZCdXR0b25OZXh0KCksYW5vdGhlclN0YXRlKS5kb25lKGZ1bmN0aW9uICgpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdpbmNyZWFzZWQnKTtcblx0XHR9KTtcblx0fSk7XG5cblx0cHJldlNsaWRlLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHRcdCQud2hlbihfcmVuZGVyTWFpbignZGVjcmVhc2UnKSwgX3NsaWRlck5leHRCdXR0b25QcmV2KCksIF9zbGlkZXJQcmV2QnV0dG9uUHJldigpLGFub3RoZXJTdGF0ZSkuZG9uZShmdW5jdGlvbiAoKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnZGVjcmVhc2VkJyk7XG5cdFx0fSk7XG5cdH0pO1xuXG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRtYWluSW1hZ2VzLmZhZGVPdXQoMzApO1xuXHRcdG1haW5JbWFnZXMuZXEoMCkuZmFkZUluKDMwKTtcblxuXHRcdHByZXZJbWFnZXMuZXEoKG1haW5JbWFnZXMubGVuZ3RoIC0gMSkpLmNzcyh7XG5cdFx0XHQndG9wJzogJzAnXG5cdFx0fSk7XG5cdFx0bmV4dEltYWdlcy5lcSgxKS5jc3Moe1xuXHRcdFx0J3RvcCc6ICcwJ1xuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cbn0oKSk7IiwidmFyIHNsaWRlclRleHQgPSAoZnVuY3Rpb24oKSB7XG5cdHZhciB0aXRsZXNDb250YWluZXIgPSAkKCcud29ya3NfX2xlZnRfaGVhZGVyJyk7XG5cdHZhciB0aXRsZXMgPSAkKCcud29ya3NfX2xlZnRfaGVhZGVyX2lubmVyJyk7XG5cdHZhciB0aXRsZUVsZW0gPSAkKCcud29ya3NfX2xlZnRfaGVhZGVyX2lubmVyJykuZXEoMCk7XG5cblx0dmFyIGRlc2NyaXB0aW9uQ29udGFpbmVyID0gJCgnLndvcmtzX19sZWZ0X2RvbmUtd2l0aCcpO1xuXHR2YXIgZGVzY3JpcHRpb24gPSAkKCcud29ya3NfX2xlZnRfZG9uZS13aXRoX2lubmVyJyk7XG5cdHZhciBkZXNjcmlwdGlvbkVsZW0gPSAkKCcud29ya3NfX2xlZnRfZG9uZS13aXRoX2lubmVyJykuZXEoMCk7XG5cblx0Ly9jb250cm9sIGJ1dHRvbnNcblx0dmFyIG5leHRCdXR0b24gPSAkKCcuc2xpZGVyX19uZXh0Jyk7XG5cdHZhciBwcmV2QnV0dG9uID0gJCgnLnNsaWRlcl9fcHJldicpO1xuXG5cdC8vYXJyYXlzIHdpdGggdGl0bGVzIGFuZCBkZXNjcmlwdGlvblxuXHR2YXIgdGl0bGVzQXJyYXkgPSBbXTtcblx0dmFyIGRlc2NyaXB0aW9uQXJyYXkgPSBbXTtcblxuXHQvLyBTYXZlcyBhbGwgdGl0bGVzIGludG8gYXJyYXlcblx0ZnVuY3Rpb24gX3Byb2Nlc3NUaXRsZXModGl0bGVzLCBhcnJheSkge1xuXHRcdHRpdGxlcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHRcdHZhciB0ZXh0ID0gJHRoaXMudGV4dCgpO1xuXHRcdFx0JHRoaXMuaHRtbCgnJyk7XG5cdFx0XHRhcnJheS5wdXNoKF9zcGFuaWZ5KHRleHQpKTtcblx0XHR9KTtcblxuXHRcdC8vcmVtb3ZlcyBhbGwgZWxlbWVudHMgZXhjZXB0IG9uZSBmcm9tIERPTVxuXHRcdGRlc2NyaXB0aW9uQ29udGFpbmVyLmVtcHR5KCk7XG5cdFx0ZGVzY3JpcHRpb25Db250YWluZXIuYXBwZW5kKGRlc2NyaXB0aW9uRWxlbSk7XG5cdFx0dGl0bGVzQ29udGFpbmVyLmVtcHR5KCk7XG5cdFx0dGl0bGVzQ29udGFpbmVyLmFwcGVuZCh0aXRsZUVsZW0pO1xuXHR9XG5cblx0Ly8gU2F2ZXMgYWxsIGRlc2NyaXB0aW9ucyBpbnRvIGFycmF5XG5cdGZ1bmN0aW9uIF9wcm9jZXNzRGVzY3JpcHRpb24odGl0bGVzLCBhcnJheSkge1xuXHRcdHRpdGxlcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHRleHQgPSAkKHRoaXMpLmh0bWwoKTtcblx0XHRcdGFycmF5LnB1c2godGV4dClcblx0XHR9KVxuXHR9XG5cblx0Ly8gRnVuY3Rpb24gYWRkcyBzcGFuIHdpdGggLndvcmQgY2xhc3MgdG8gZWFjaCB3b3JkIGFuZCBzcGFuIHdpdGggLmxldHRlciBjbGFzc1xuXHQvLyB0byBlYWNoIGxldHRlclxuXHRmdW5jdGlvbiBfc3BhbmlmeSh0ZXh0KSB7XG5cdFx0dmFyIGFycmF5ID0gW107XG5cdFx0dmFyIHdvcmRzQXJyYXkgPSB0ZXh0LnNwbGl0KCcgJyk7XG5cdFx0dmFyIHNwYW5uZWRUZXh0ID0gJyc7XG5cblx0XHR3b3Jkc0FycmF5LmZvckVhY2goZnVuY3Rpb24od29yZCkge1xuXHRcdFx0dmFyIGxldHRlcnNBcnJheSA9IHdvcmQuc3BsaXQoJycpO1xuXHRcdFx0dmFyIHNwYW5uZWRXb3JkID0gJyc7XG5cblx0XHRcdGxldHRlcnNBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGxldHRlcikge1xuXHRcdFx0XHRzcGFubmVkV29yZCArPSAnPHNwYW4gY2xhc3M9XCJsZXR0ZXJcIj4nICsgbGV0dGVyICsgJzwvc3Bhbj4nO1xuXHRcdFx0fSk7XG5cblx0XHRcdHNwYW5uZWRUZXh0ICs9ICc8c3BhbiBjbGFzcz1cIndvcmRcIj4nICsgc3Bhbm5lZFdvcmQgKyAnPC9zcGFuPic7XG5cdFx0fSk7XG5cblx0XHRhcnJheS5wdXNoKHNwYW5uZWRUZXh0KTtcblx0XHRyZXR1cm4gYXJyYXlcblx0fVxuXG5cdC8vU2hvd3Mgc2VsZWN0ZWQgdGl0bGVcblx0ZnVuY3Rpb24gX3JlbmRlclRpdGxlKG51bSwgYXJyYXksIGVsZW0pIHtcblx0XHRlbGVtLmh0bWwoYXJyYXlbbnVtXSk7XG5cdFx0ZWxlbS5maW5kKCcubGV0dGVyJykuZWFjaChmdW5jdGlvbihpbmRleCkge1xuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblxuXHRcdFx0KGZ1bmN0aW9uKGVsZW0pIHtcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRlbGVtLmFkZENsYXNzKCdhY3RpdmVMZXR0ZXInKVxuXHRcdFx0XHR9LCAxMCAqIGluZGV4KTtcblx0XHRcdH0pKCR0aGlzKTtcblxuXHRcdH0pXG5cdH1cblxuXHQvL1Nob3dzIHNlbGVjdGVkIGRlc2NyaXB0aW9uXG5cdGZ1bmN0aW9uIF9yZW5kZXJEZXNjcmlwdGlvbihudW0sIGFycmF5LCBlbGVtKSB7XG5cdFx0ZWxlbS5odG1sKGFycmF5W251bV0pXG5cdH1cblxuXHRmdW5jdGlvbiBfc2V0RXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0dmFyIHF0eSA9IHRpdGxlcy5sZW5ndGg7XG5cdFx0dmFyIGNvdW50ZXIgPSAwO1xuXG5cdFx0bmV4dEJ1dHRvbi5jbGljayhmdW5jdGlvbigpIHtcblx0XHRcdGNvdW50ZXIrKztcblx0XHRcdGNvdW50ZXIgPSBjb3VudGVyIDw9IChxdHkgLSAxKSA/IGNvdW50ZXIgOiAwO1xuXHRcdFx0X3JlbmRlclRpdGxlKGNvdW50ZXIsIHRpdGxlc0FycmF5LCB0aXRsZUVsZW0pO1xuXHRcdFx0X3JlbmRlckRlc2NyaXB0aW9uKGNvdW50ZXIsIGRlc2NyaXB0aW9uQXJyYXksIGRlc2NyaXB0aW9uRWxlbSk7XG5cdFx0fSk7XG5cblx0XHRwcmV2QnV0dG9uLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHRcdFx0Y291bnRlci0tO1xuXHRcdFx0Y291bnRlciA9IGNvdW50ZXIgPCAwID8gKHF0eSAtIDEpIDogY291bnRlcjtcblx0XHRcdF9yZW5kZXJUaXRsZShjb3VudGVyLCB0aXRsZXNBcnJheSwgdGl0bGVFbGVtKTtcblx0XHRcdF9yZW5kZXJEZXNjcmlwdGlvbihjb3VudGVyLCBkZXNjcmlwdGlvbkFycmF5LCBkZXNjcmlwdGlvbkVsZW0pO1xuXHRcdH0pXG5cdH1cblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdF9wcm9jZXNzVGl0bGVzKHRpdGxlcywgdGl0bGVzQXJyYXkpO1xuXHRcdF9wcm9jZXNzRGVzY3JpcHRpb24oZGVzY3JpcHRpb24sIGRlc2NyaXB0aW9uQXJyYXkpO1xuXHRcdF9yZW5kZXJUaXRsZSgwLCB0aXRsZXNBcnJheSwgdGl0bGVFbGVtKTtcblx0XHRfcmVuZGVyRGVzY3JpcHRpb24oMCwgZGVzY3JpcHRpb25BcnJheSwgZGVzY3JpcHRpb25FbGVtKTtcblx0XHRfc2V0RXZlbnRMaXN0ZW5lcnMoKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG5cbn0oKSk7XG4iLCJ2YXIgdGFiID0gKGZ1bmN0aW9uKCkge1xuXG5cdHZhciB0YWJzID0gJCgnLnRhYnNfX2xpc3QtaXRlbScpO1xuXHR2YXIgdGFic0xpbmsgPSAkKCcudGFic19fY29udHJvbC1pdGVtJyk7XG5cblx0ZnVuY3Rpb24gX3NldHVwRXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0dGFicy5lcSgwKS5hZGRDbGFzcygnYWN0aXZlVGFiJyk7XG5cdFx0dGFic0xpbmsuZXEoMCkuYWRkQ2xhc3MoJ2FjdGl2ZVRhYkxpbmsnKTtcblxuXHRcdHRhYnNMaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGFjdGl2ZSA9ICQodGhpcykuZGF0YSgnY2xhc3MnKTtcblx0XHRcdHRhYnMucmVtb3ZlQ2xhc3MoJ2FjdGl2ZVRhYicpO1xuXHRcdFx0dGFic0xpbmsucmVtb3ZlQ2xhc3MoJ2FjdGl2ZVRhYkxpbmsnKTtcblx0XHRcdHRhYnMuZXEoYWN0aXZlKS5hZGRDbGFzcygnYWN0aXZlVGFiJyk7XG5cdFx0XHR0YWJzTGluay5lcShhY3RpdmUpLmFkZENsYXNzKCdhY3RpdmVUYWJMaW5rJyk7XG5cdFx0fSlcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0X3NldHVwRXZlbnRMaXN0ZW5lcnMoKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG59KCkpO1xuIiwidmFyIGRpYWdyYW0gPSAoZnVuY3Rpb24oKSB7XG5cblx0dmFyIGVsZW0gPSAkKCcuc2tpbGxzX19lbGVtcycpLmVxKDApO1xuXHR2YXIgZGlhZ3JhbUFycmF5ID0gJCgnLnNlY3RvcicpO1xuXHR2YXIgZGlhZ3JhbVZhbHVlcztcblxuXHRmdW5jdGlvbiBfc2V0RXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcblx0XHRcdHZhciB0b3BFZGdlID0gJChlbGVtKS5vZmZzZXQoKS50b3A7XG5cdFx0XHR2YXIgc2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXHRcdFx0dmFyIGhlaWdodCA9ICQod2luZG93KS5pbm5lckhlaWdodCgpO1xuXHRcdFx0dmFyIGFuaW1hdGlvblN0YXJ0ID0gaGVpZ2h0ICsgc2Nyb2xsIC0gaGVpZ2h0IC8gNTtcblx0XHRcdGlmIChhbmltYXRpb25TdGFydCA+IHRvcEVkZ2UpIHtcblx0XHRcdFx0X2FuaW1hdGUoKTtcblx0XHRcdH1cblx0XHR9KVxuXHR9XG5cblx0ZnVuY3Rpb24gX2FuaW1hdGUoKSB7XG5cdFx0dmFyIG1heFZhbCA9IDI4MDtcblx0XHRkaWFncmFtQXJyYXkuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XG5cdFx0XHR2YXIgZGF0YUlkID0gJHRoaXMuZGF0YSgnZGlhZ3JhbScpO1xuXHRcdFx0dmFyIGVsZW1WYWx1ZSA9IGRpYWdyYW1WYWx1ZXNbZGF0YUlkXTtcblx0XHRcdHZhciBkYXNoID0gKGVsZW1WYWx1ZSAvIDEwMCkgKiBtYXhWYWw7XG5cdFx0XHQkdGhpcy5jc3Moe1xuXHRcdFx0XHQnc3Ryb2tlLWRhc2hhcnJheSc6IGRhc2ggKyAnICcgKyBtYXhWYWxcblx0XHRcdH0pXG5cblx0XHR9KVxuXHR9XG5cblx0ZnVuY3Rpb24gX2dldFZhbHVlcygpIHtcblx0XHQkLmdldCgnL2dldGRpYWdyYW0nLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRkaWFncmFtVmFsdWVzID0gZGF0YVswXTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0X2dldFZhbHVlcygpO1xuXHRcdF9zZXRFdmVudExpc3RlbmVycygpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cbn0oKSk7XG4iLCJ2YXIgc2Nyb2xsQXJyb3cgPSAoZnVuY3Rpb24oKSB7XG5cblx0ZnVuY3Rpb24gX3NldEV2ZW50TGlzdGVuZXJzKCkge1xuXHRcdCQoJy5hcnJvdy1kb3duLWljb24nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBoZWlnaHQgPSAkKHdpbmRvdykuaW5uZXJIZWlnaHQoKTtcblx0XHRcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcblx0XHRcdFx0c2Nyb2xsVG9wOiBoZWlnaHRcblx0XHRcdH0sIDgwMCk7XG5cdFx0fSlcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0X3NldEV2ZW50TGlzdGVuZXJzKCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxuXG59KCkpO1xuIiwidmFyIHZhbGlkYXRpb24gPSAoZnVuY3Rpb24oKSB7XG5cbiAgdmFyIG1vZGFsQ29udGFpbmVyUm9ib3QgPSAkKCcjaW5kZXgtbW9kYWwtY29udGFpbmVyLXJvYm90cycpO1xuICB2YXIgbW9kYWxDb250YWluZXJGaWVsZCA9ICQoJyNpbmRleC1tb2RhbC1jb250YWluZXItZmllbGQnKTtcbiAgdmFyIGFsbE1vZGFscyA9ICQoJy5pbmRleC1tb2RhbC1jb250YWluZXInKTtcbiAgdmFyIGFjdGl2ZU1vZGFsID0gJ2luZGV4LW1vZGFsLWFjdGl2ZSc7XG4gIHZhciBpc0h1bWFuID0gJCgnI2lzSHVtYW4nKTtcbiAgdmFyIG5vdFJvYm90ID0gJCgnI3JhZGlvMScpO1xuICB2YXIgbG9naW4gPSAkKCcjaW5kZXhfbG9naW4nKTtcbiAgdmFyIHBhc3MgPSAkKCcjaW5kZXhfcGFzcycpO1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgX3NldFVwRXZlbnRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9zZXRVcEV2ZW50TGlzdGVuZXJzKCkge1xuXG4gICAgJCgnI2F1dGhvcml6ZScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgaWYoIWlzSHVtYW4ucHJvcCgnY2hlY2tlZCcpIHx8ICFub3RSb2JvdC5wcm9wKCdjaGVja2VkJykpIHtcbiAgICAgICAgX3Nob3dNb2RhbChtb2RhbENvbnRhaW5lclJvYm90KTtcbiAgICAgIH0gZWxzZSBpZiAobG9naW4udmFsKCkgPT09ICcnIHx8IHBhc3MudmFsKCkgPT09ICcnKSB7XG4gICAgICAgIF9zaG93TW9kYWwobW9kYWxDb250YWluZXJGaWVsZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBmb3JtID0gJCgnLmF1dGhfZm9ybScpO1xuICAgICAgICAgIHZhciBkZWZPYmogPSBfYWpheEZvcm0oZm9ybSwgJy4vbG9naW4nKTtcbiAgICAgICAgICBpZiAoZGVmT2JqKSB7XG4gICAgICAgICAgICBkZWZPYmouZG9uZShmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgdmFyIHN0YXR1cyA9IHJlcy5zdGF0dXM7XG4gICAgICAgICAgICAgIGlmIChzdGF0dXMgPT09ICdPSycpe1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9hZG1pbic7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZGVmT2JqLmZhaWwoZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihyZXMpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJCgnLmluZGV4LW1vZGFsLWJsb2NrLWJ1dHRvbicpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIF9oaWRlTW9kYWwoYWxsTW9kYWxzKTtcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gX3Nob3dNb2RhbChlbGVtZW50KSB7XG4gICAgZWxlbWVudC5hZGRDbGFzcyhhY3RpdmVNb2RhbCk7XG4gIH1cbiAgZnVuY3Rpb24gX2hpZGVNb2RhbChlbGVtZW50KSB7XG4gICAgZWxlbWVudC5yZW1vdmVDbGFzcyhhY3RpdmVNb2RhbClcbiAgfVxuICBmdW5jdGlvbiBfYWpheEZvcm0oZm9ybSwgdXJsKXtcbiAgICB2YXIgZGF0YSA9IGZvcm0uc2VyaWFsaXplKCk7XG4gICAgdmFyIGRlZk9iaiA9ICQuYWpheCh7XG4gICAgICB0eXBlIDogXCJQT1NUXCIsXG4gICAgICB1cmwgOiB1cmwsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGVmT2JqO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0XG4gIH1cbn0oKSk7IiwidmFyIGFkbWluID0gKGZ1bmN0aW9uKCkge1xuXG4gIHZhciBtb2RhbCA9ICQoJy5tb2RhbC1jb250YWluZXInKTtcbiAgdmFyIG9rQnV0dG9uID0gJCgnLm1vZGFsT2snKTtcbiAgdmFyIGJhY2tUb01haW4gPSAkKCcuYWRtaW5faGVhZGVyX3JldHVybicpO1xuICB2YXIgc2F2ZURpYWdyYW0gPSAkKCcjc2F2ZURpYWdyYW0nKTtcblxuICBmdW5jdGlvbiBfc2hvd01vZGFsKHJlc3VsdCkge1xuICAgIGlmIChyZXN1bHQgPT09ICdzdWNjZXNzJykge1xuICAgICAgbW9kYWwuZXEoMCkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vZGFsLmVxKDEpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9sb2dPdXQoKSB7XG4gICAgZGVmT2JqID0gJC5hamF4KHtcbiAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgdXJsOiAnLi9sb2dvdXQnXG4gICAgfSkuZmFpbChmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmxvZygnZXJyb3InKTtcbiAgICB9KS5jb21wbGV0ZShmdW5jdGlvbiAoKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvJztcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gX2FkZE5ld1dvcmsoKSB7XG4gICAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCQoJyN1cGxvYWRGb3JtJylbMF0pO1xuXG4gICAgJC5hamF4KHtcbiAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgICAgdXJsOiBcIi4vdXBsb2FkXCIsXG4gICAgICBkYXRhOiAgZm9ybURhdGFcbiAgICB9KVxuICAgICAgLmRvbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgIF9zaG93TW9kYWwoJ3N1Y2Nlc3MnKVxuICAgICAgfSkuZmFpbChmdW5jdGlvbigpIHtcbiAgICAgIF9zaG93TW9kYWwoJ2ZhaWwnKVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBfcG9zdERpYWdyYW1WYWx1ZXMoKSB7XG4gICAgdmFyIGVsZW1lbnRzID0gJCgnLnRhYnNfX2xpc3RfYmxvY2stZWxlbScpO1xuICAgIHZhciB0ZXh0ID0gJCgnLnRhYnNfX2xpc3QtdGV4dCcpO1xuICAgIHZhciB2YWx1ZSA9ICQoJy50YWJzX19saXN0LWlucHV0Jyk7XG4gICAgdmFyIGRpYWdyYW1WYWx1ZXMgPSB7fTtcblxuICAgIGVsZW1lbnRzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG5hbWUgPSAkKHRoaXMpLmZpbmQodGV4dCkudGV4dCgpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnLicsICcnKTtcbiAgICAgIGRpYWdyYW1WYWx1ZXNbbmFtZV0gPSAkKHRoaXMpLmZpbmQodmFsdWUpLnZhbCgpO1xuICAgIH0pO1xuXG4gICAgJC5wb3N0KFwiL2RpYWdyYW1cIiwgZGlhZ3JhbVZhbHVlcykuZG9uZShmdW5jdGlvbiAoKSB7XG4gICAgICBfc2hvd01vZGFsKCdzdWNjZXNzJylcbiAgICB9KS5mYWlsKGZ1bmN0aW9uICgpIHtcbiAgICAgIF9zaG93TW9kYWwoJ2ZhaWwnKVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBfc2V0dXBFdmVudExpc3RlbmVycygpIHtcbiAgICBva0J1dHRvbi5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICBtb2RhbC5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpXG4gICAgfSk7XG5cbiAgICBiYWNrVG9NYWluLmNsaWNrKF9sb2dPdXQpO1xuICAgIHNhdmVEaWFncmFtLmNsaWNrKF9wb3N0RGlhZ3JhbVZhbHVlcyk7XG5cbiAgICAkKCcjdXBsb2FkRm9ybScpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBfYWRkTmV3V29yaygpO1xuICAgIH0pO1xuXG4gICAgJCgnI2Jsb2dQb3N0Jykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHZhciBkYXRhID0gJCh0aGlzKS5zZXJpYWxpemUoKTtcblxuICAgICAgJC5wb3N0KFwiLi9hZGRibG9ncG9zdFwiLCBkYXRhKS5kb25lKGZ1bmN0aW9uKCkge1xuICAgICAgICBfc2hvd01vZGFsKCdzdWNjZXNzJylcbiAgICAgICAgJCgnI2Jsb2dQb3N0JylbMF0ucmVzZXQoKTtcbiAgICAgIH0pLmZhaWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIF9zaG93TW9kYWwoJ2ZhaWwnKVxuICAgICAgfSk7XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgX3NldHVwRXZlbnRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdDogaW5pdFxuICB9XG59KCkpO1xuIiwiZnVuY3Rpb24gbmF2aWdhdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHQkKCcjbmF2LWljb24nKS5jbGljayhmdW5jdGlvbigpIHtcblx0XHQkKHRoaXMpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XG5cdFx0JCgnI292ZXJsYXknKS50b2dnbGVDbGFzcygnb3BlbicpO1xuXHR9KTtcbn07XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXG5cdHZhciBwYXRoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuXG5cdHByZWxvYWRlci5pbml0KCk7XG5cdG5hdmlnYXRpb24oKTtcblxuXHRpZiAocGF0aCA9PT0gJy8nIHx8IHBhdGggPT09ICcvaW5kZXguaHRtbCcpIHtcblx0XHRwYXJhbGxheC5pbml0KCk7XG5cdFx0ZmxpcHBlci5pbml0KCk7XG5cdFx0dmFsaWRhdGlvbi5pbml0KCk7XG5cdH0gZWxzZSB7XG5cdFx0c2Nyb2xsLmluaXQoKTtcblx0fVxuXG5cdGlmIChwYXRoID09PSAnL2Jsb2cuaHRtbCcgfHwgcGF0aCA9PT0gJy9ibG9nJykge1xuXHRcdGJsb2dOYXYuaW5pdCgpO1xuXHR9XG5cblx0aWYgKHBhdGggPT09ICcvd29ya3MuaHRtbCcgfHwgcGF0aCA9PT0gJy93b3JrcycpIHtcblx0XHRzbGlkZXIuaW5pdCgpO1xuXHRcdHNsaWRlclRleHQuaW5pdCgpO1xuXHR9XG5cblx0aWYgKHBhdGggPT09ICcvYWJvdXRtZS5odG1sJyB8fCBwYXRoID09PSAnL2Fib3V0bWUnKSB7XG5cdFx0Z29vZ2xlTWFwLmluaXQoKTtcblx0XHRkaWFncmFtLmluaXQoKTtcblx0fVxuXG5cdGlmIChwYXRoID09PSAnL2FkbWluLmh0bWwnIHx8IHBhdGggPT09ICcvYWRtaW4nKSB7XG5cdFx0dGFiLmluaXQoKTtcblx0fVxuXG5cdGlmIChwYXRoICE9PSAnYWRtaW4nKSB7XG5cdFx0c2Nyb2xsQXJyb3cuaW5pdCgpO1xuXHRcdGFkbWluLmluaXQoKTtcblx0fVxuXG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
