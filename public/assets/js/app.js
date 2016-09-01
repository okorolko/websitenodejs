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
      var elemBottom = $(elem).offset().top + $(elem).height();
      var windowBottom = scroll + $(window).height();
      var elemBottomPos = windowBottom - elemBottom - 100;
      var elemTopPos = $(elem).offset().top - scroll;
      var documentHeight = $(document).height();
      console.log(documentHeight, windowBottom)
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdvb2dsZU1hcC5qcyIsImJsb2dOYXYuanMiLCJwcmVsb2FkZXIuanMiLCJwYXJhbGxheC5qcyIsImZsaXBwZXIuanMiLCJzY3JvbGwuanMiLCJzbGlkZXIuanMiLCJzbGlkZXJUZXh0LmpzIiwidGFiLmpzIiwiZGlhZ3JhbS5qcyIsInNjcm9sbEFycm93LmpzIiwidmFsaWRhdGlvbi5qcyIsImFkbWluLmpzIiwiYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuS0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25KQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBnb29nbGUubWFwcy5ldmVudC5hZGREb21MaXN0ZW5lcih3aW5kb3csICdsb2FkJywgaW5pdCk7XG5cbnZhciBnb29nbGVNYXAgPSAoZnVuY3Rpb24oKSB7XG5cblx0dmFyIG1hcDtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdHZhciBtYXBPcHRpb25zID0ge1xuXHRcdFx0Y2VudGVyOiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDU5LjI5OTM3NiwgMjYuNTMwNzIzKSxcblx0XHRcdHpvb206IDQsXG5cdFx0XHR6b29tQ29udHJvbDogdHJ1ZSxcblx0XHRcdHpvb21Db250cm9sT3B0aW9uczoge1xuXHRcdFx0XHRzdHlsZTogZ29vZ2xlLm1hcHMuWm9vbUNvbnRyb2xTdHlsZS5ERUZBVUxULFxuXHRcdFx0fSxcblx0XHRcdGRpc2FibGVEb3VibGVDbGlja1pvb206IHRydWUsXG5cdFx0XHRtYXBUeXBlQ29udHJvbDogZmFsc2UsXG5cdFx0XHRzY2FsZUNvbnRyb2w6IGZhbHNlLFxuXHRcdFx0c2Nyb2xsd2hlZWw6IGZhbHNlLFxuXHRcdFx0cGFuQ29udHJvbDogZmFsc2UsXG5cdFx0XHRzdHJlZXRWaWV3Q29udHJvbDogZmFsc2UsXG5cdFx0XHRkcmFnZ2FibGU6IGZhbHNlLFxuXHRcdFx0b3ZlcnZpZXdNYXBDb250cm9sOiBmYWxzZSxcblx0XHRcdG92ZXJ2aWV3TWFwQ29udHJvbE9wdGlvbnM6IHtcblx0XHRcdFx0b3BlbmVkOiBmYWxzZSxcblx0XHRcdH0sXG5cdFx0XHRtYXBUeXBlSWQ6IGdvb2dsZS5tYXBzLk1hcFR5cGVJZC5ST0FETUFQLFxuXHRcdFx0c3R5bGVzOiBbe1xuXHRcdFx0XHRcImZlYXR1cmVUeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIixcblx0XHRcdFx0XCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxuXHRcdFx0XHRcInN0eWxlcnNcIjogW3tcblx0XHRcdFx0XHRcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcblx0XHRcdFx0fV1cblx0XHRcdH0sIHtcblx0XHRcdFx0XCJmZWF0dXJlVHlwZVwiOiBcImxhbmRzY2FwZVwiLFxuXHRcdFx0XHRcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcblx0XHRcdFx0XCJzdHlsZXJzXCI6IFt7XG5cdFx0XHRcdFx0XCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcImNvbG9yXCI6IFwiI2ZjZmNmY1wiXG5cdFx0XHRcdH1dXG5cdFx0XHR9LCB7XG5cdFx0XHRcdFwiZmVhdHVyZVR5cGVcIjogXCJwb2lcIixcblx0XHRcdFx0XCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG5cdFx0XHRcdFwic3R5bGVyc1wiOiBbe1xuXHRcdFx0XHRcdFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XCJjb2xvclwiOiBcIiNmY2ZjZmNcIlxuXHRcdFx0XHR9XVxuXHRcdFx0fSwge1xuXHRcdFx0XHRcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5oaWdod2F5XCIsXG5cdFx0XHRcdFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuXHRcdFx0XHRcInN0eWxlcnNcIjogW3tcblx0XHRcdFx0XHRcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFwiY29sb3JcIjogXCIjZGRkZGRkXCJcblx0XHRcdFx0fV1cblx0XHRcdH0sIHtcblx0XHRcdFx0XCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuYXJ0ZXJpYWxcIixcblx0XHRcdFx0XCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG5cdFx0XHRcdFwic3R5bGVyc1wiOiBbe1xuXHRcdFx0XHRcdFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XCJjb2xvclwiOiBcIiNkZGRkZGRcIlxuXHRcdFx0XHR9XVxuXHRcdFx0fSwge1xuXHRcdFx0XHRcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5sb2NhbFwiLFxuXHRcdFx0XHRcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcblx0XHRcdFx0XCJzdHlsZXJzXCI6IFt7XG5cdFx0XHRcdFx0XCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcImNvbG9yXCI6IFwiI2VlZWVlZVwiXG5cdFx0XHRcdH1dXG5cdFx0XHR9LCB7XG5cdFx0XHRcdFwiZmVhdHVyZVR5cGVcIjogXCJ3YXRlclwiLFxuXHRcdFx0XHRcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcblx0XHRcdFx0XCJzdHlsZXJzXCI6IFt7XG5cdFx0XHRcdFx0XCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcImNvbG9yXCI6IFwiIzAwYmZhNVwiXG5cdFx0XHRcdH1dXG5cdFx0XHR9XSxcblx0XHR9XG5cdFx0dmFyIG1hcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyk7XG5cdFx0dmFyIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAobWFwRWxlbWVudCwgbWFwT3B0aW9ucyk7XG5cdFx0dmFyIGxvY2F0aW9ucyA9IFtcblx0XHRcdFsnT2xlZyBLb3JvbGtvJywgJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnLCAnJywgJ3VuZGVmaW5lZCcsIDU5LjkzNDI4MDIsIDMwLjMzNTA5ODYwMDAwMDAzOCwgJ2h0dHBzOi8vbWFwYnVpbGRyLmNvbS9hc3NldHMvaW1nL21hcmtlcnMvZWxsaXBzZS1yZWQucG5nJ11cblx0XHRdO1xuXHRcdGZvciAoaSA9IDA7IGkgPCBsb2NhdGlvbnMubGVuZ3RoOyBpKyspIHtcblx0XHRcdGlmIChsb2NhdGlvbnNbaV1bMV0gPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0ZGVzY3JpcHRpb24gPSAnJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGRlc2NyaXB0aW9uID0gbG9jYXRpb25zW2ldWzFdO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGxvY2F0aW9uc1tpXVsyXSA9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHR0ZWxlcGhvbmUgPSAnJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRlbGVwaG9uZSA9IGxvY2F0aW9uc1tpXVsyXTtcblx0XHRcdH1cblx0XHRcdGlmIChsb2NhdGlvbnNbaV1bM10gPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0ZW1haWwgPSAnJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGVtYWlsID0gbG9jYXRpb25zW2ldWzNdO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGxvY2F0aW9uc1tpXVs0XSA9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHR3ZWIgPSAnJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHdlYiA9IGxvY2F0aW9uc1tpXVs0XTtcblx0XHRcdH1cblx0XHRcdGlmIChsb2NhdGlvbnNbaV1bN10gPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0bWFya2VyaWNvbiA9ICcnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0bWFya2VyaWNvbiA9IGxvY2F0aW9uc1tpXVs3XTtcblx0XHRcdH1cblx0XHRcdG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuXHRcdFx0XHRpY29uOiBtYXJrZXJpY29uLFxuXHRcdFx0XHRwb3NpdGlvbjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsb2NhdGlvbnNbaV1bNV0sIGxvY2F0aW9uc1tpXVs2XSksXG5cdFx0XHRcdG1hcDogbWFwLFxuXHRcdFx0XHR0aXRsZTogbG9jYXRpb25zW2ldWzBdLFxuXHRcdFx0XHRkZXNjOiBkZXNjcmlwdGlvbixcblx0XHRcdFx0dGVsOiB0ZWxlcGhvbmUsXG5cdFx0XHRcdGVtYWlsOiBlbWFpbCxcblx0XHRcdFx0d2ViOiB3ZWJcblx0XHRcdH0pO1xuXHRcdFx0bGluayA9ICcnO1xuXHRcdFx0YmluZEluZm9XaW5kb3cobWFya2VyLCBtYXAsIGxvY2F0aW9uc1tpXVswXSwgZGVzY3JpcHRpb24sIHRlbGVwaG9uZSwgZW1haWwsIHdlYiwgbGluayk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gYmluZEluZm9XaW5kb3cobWFya2VyLCBtYXAsIHRpdGxlLCBkZXNjLCB0ZWxlcGhvbmUsIGVtYWlsLCB3ZWIsIGxpbmspIHtcblx0XHRcdHZhciBpbmZvV2luZG93VmlzaWJsZSA9IChmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIGN1cnJlbnRseVZpc2libGUgPSBmYWxzZTtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHZpc2libGUpIHtcblx0XHRcdFx0XHRpZiAodmlzaWJsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRjdXJyZW50bHlWaXNpYmxlID0gdmlzaWJsZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGN1cnJlbnRseVZpc2libGU7XG5cdFx0XHRcdH07XG5cdFx0XHR9KCkpO1xuXHRcdFx0aXcgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdygpO1xuXHRcdFx0Z29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIobWFya2VyLCAnY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0aWYgKGluZm9XaW5kb3dWaXNpYmxlKCkpIHtcblx0XHRcdFx0XHRpdy5jbG9zZSgpO1xuXHRcdFx0XHRcdGluZm9XaW5kb3dWaXNpYmxlKGZhbHNlKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YXIgaHRtbCA9IFwiPGRpdiBzdHlsZT0nY29sb3I6IzAwMDtiYWNrZ3JvdW5kLWNvbG9yOiNmZmY7cGFkZGluZzo1cHg7d2lkdGg6MTUwcHg7Jz48L2Rpdj5cIjtcblx0XHRcdFx0XHRpdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KHtcblx0XHRcdFx0XHRcdGNvbnRlbnQ6IGh0bWxcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0XHRpdy5vcGVuKG1hcCwgbWFya2VyKTtcblx0XHRcdFx0XHRpbmZvV2luZG93VmlzaWJsZSh0cnVlKTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihpdywgJ2Nsb3NlY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0aW5mb1dpbmRvd1Zpc2libGUoZmFsc2UpO1xuXHRcdFx0fSk7XG5cdFx0fVxuXHR9XG5cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxuXG5cdH0oKSlcbiIsInZhciBibG9nTmF2ID0gKGZ1bmN0aW9uKCkge1xuXG4gIHZhciBzaWRlQmFyID0gJCgnLmJsb2ctbWVudScpO1xuICB2YXIgc2lkZUJhckVsZW0gPSAkKCcuYmxvZy1tZW51LWVsZW0nKTtcbiAgdmFyIHNlY3Rpb24gPSAkKCcuYmxvZy1hcnRpY2xlJyk7XG5cbiAgZnVuY3Rpb24gX3NldFVwRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcbiAgICAgIF9zY3JvbGxlZCgpXG4gICAgfSk7XG5cbiAgICBzaWRlQmFyRWxlbS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpZCA9ICQodGhpcykuZGF0YSgnaWQnKTtcbiAgICAgIHZhciB0b3AgPSAkKHNlY3Rpb24uZXEoaWQpKS5vZmZzZXQoKS50b3A7XG5cbiAgICAgICQoJ2JvZHknKS5hbmltYXRlKHtcbiAgICAgICAgc2Nyb2xsVG9wOiB0b3BcbiAgICAgIH0sIDMwMCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfc2Nyb2xsZWQoKSB7XG4gICAgdmFyIHNjcm9sbCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblxuICAgIHZhciBtZW51VG9wUG9zID0gJChzZWN0aW9uLmVxKDApKS5vZmZzZXQoKS50b3AgLSBzY3JvbGw7XG4gICAgaWYgKG1lbnVUb3BQb3MgPCAxMCkge1xuICAgICAgJChzaWRlQmFyKS5hZGRDbGFzcygnZml4ZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJChzaWRlQmFyKS5yZW1vdmVDbGFzcygnZml4ZWQnKTtcbiAgICB9XG5cbiAgICBzZWN0aW9uLmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbGVtKSB7XG4gICAgICB2YXIgZWxlbUJvdHRvbSA9ICQoZWxlbSkub2Zmc2V0KCkudG9wICsgJChlbGVtKS5oZWlnaHQoKTtcbiAgICAgIHZhciB3aW5kb3dCb3R0b20gPSBzY3JvbGwgKyAkKHdpbmRvdykuaGVpZ2h0KCk7XG4gICAgICB2YXIgZWxlbUJvdHRvbVBvcyA9IHdpbmRvd0JvdHRvbSAtIGVsZW1Cb3R0b20gLSAxMDA7XG4gICAgICB2YXIgZWxlbVRvcFBvcyA9ICQoZWxlbSkub2Zmc2V0KCkudG9wIC0gc2Nyb2xsO1xuICAgICAgdmFyIGRvY3VtZW50SGVpZ2h0ID0gJChkb2N1bWVudCkuaGVpZ2h0KCk7XG4gICAgICBjb25zb2xlLmxvZyhkb2N1bWVudEhlaWdodCwgd2luZG93Qm90dG9tKVxuICAgICAgaWYgKGVsZW1Ub3BQb3MgPCAwIHx8IGVsZW1Cb3R0b21Qb3MgPiAwKSB7XG4gICAgICAgIHNpZGVCYXJFbGVtLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgc2lkZUJhckVsZW0uZXEoaW5kZXgpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICAkKHNpZGVCYXJFbGVtLmVxKDApKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgX3NldFVwRXZlbnRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdDogaW5pdFxuICB9XG59KSgpOyIsInZhciBwcmVsb2FkZXIgPSAoZnVuY3Rpb24oKSB7XG5cblx0dmFyXG5cdC8vINC80LDRgdGB0LjQsiDQtNC70Y8g0LLRgdC10YUg0LjQt9C+0LHRgNCw0LbQtdC90LjQuSDQvdCwINGB0YLRgNCw0L3QuNGG0LVcblx0XHRfaW1ncyA9IFtdLFxuXG5cdFx0Ly8g0LHRg9C00LXRgiDQuNGB0L/QvtC70YzQt9C+0LLQsNGC0YzRgdGPINC40Lcg0LTRgNGD0LPQuNGFINC80L7QtNGD0LvQtdC5LCDRh9GC0L7QsdGLINC/0YDQvtCy0LXRgNC40YLRjCwg0L7RgtGA0LjRgdC+0LLQsNC90Ysg0LvQuCDQstGB0LUg0Y3Qu9C10LzQtdC90YLRi1xuXHRcdC8vINGCLtC6LiBkb2N1bWVudC5yZWFkeSDQuNC3LdC30LAg0L/RgNC10LvQvtCw0LTQtdGA0LAg0YHRgNCw0LHQsNGC0YvQstCw0LXRgiDRgNCw0L3RjNGI0LUsINC60L7Qs9C00LAg0L7RgtGA0LjRgdC+0LLQsNC9INC/0YDQtdC70L7QsNC00LXRgCwg0LAg0L3QtSDQstGB0Y8g0YHRgtGA0LDQvdC40YbQsFxuXHRcdGNvbnRlbnRSZWFkeSA9ICQuRGVmZXJyZWQoKTtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdF9jb3VudEltYWdlcygpO1xuXHRcdF9zdGFydFByZWxvYWRlcigpO1xuXHR9XG5cblx0ZnVuY3Rpb24gX2NvdW50SW1hZ2VzKCkge1xuXG5cdFx0Ly8g0L/RgNC+0YXQvtC00LjQvCDQv9C+INCy0YHQtdC8INGN0LvQtdC80LXQvdGC0LDQvCDQvdCwINGB0YLRgNCw0L3QuNGG0LVcblx0XHQkLmVhY2goJCgnKicpLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyksXG5cdFx0XHRcdGJhY2tncm91bmQgPSAkdGhpcy5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKSxcblx0XHRcdFx0aW1nID0gJHRoaXMuaXMoJ2ltZycpO1xuXG5cdFx0XHQvLyDQt9Cw0L/QuNGB0YvQstCw0LXQvCDQsiDQvNCw0YHRgdC40LIg0LLRgdC1INC/0YPRgtC4INC6INCx0Y3QutCz0YDQsNGD0L3QtNCw0Lxcblx0XHRcdGlmIChiYWNrZ3JvdW5kICE9ICdub25lJykge1xuXG5cdFx0XHRcdC8vINCyIGNocm9tZSDQsiDRg9GA0LvQtSDQtdGB0YLRjCDQutCw0LLRi9GH0LrQuCwg0LLRi9GA0LXQt9Cw0LXQvCDRgSDQvdC40LzQuC4gdXJsKFwiLi4uXCIpIC0+IC4uLlxuXHRcdFx0XHQvLyDQsiBzYWZhcmkg0LIg0YPRgNC70LUg0L3QtdGCINC60LDQstGL0YfQtdC6LCDQstGL0YDQtdC30LDQtdC8INCx0LXQtyDQvdC40YUuIHVybCggLi4uICkgLT4gLi4uXG5cdFx0XHRcdHZhciBwYXRoID0gYmFja2dyb3VuZC5yZXBsYWNlKCd1cmwoXCInLCBcIlwiKS5yZXBsYWNlKCdcIiknLCBcIlwiKTtcblx0XHRcdFx0dmFyIHBhdGggPSBwYXRoLnJlcGxhY2UoJ3VybCgnLCBcIlwiKS5yZXBsYWNlKCcpJywgXCJcIik7XG5cblx0XHRcdFx0X2ltZ3MucHVzaChwYXRoKTtcblx0XHRcdH1cblx0XHRcdC8vINC30LDQv9C40YHRi9Cy0LDQtdC8INCyINC80LDRgdGB0LjQsiDQstGB0LUg0L/Rg9GC0Lgg0Log0LrQsNGA0YLQuNC90LrQsNC8XG5cdFx0XHRpZiAoaW1nKSB7XG5cdFx0XHRcdHZhciBwYXRoID0gJycgKyAkdGhpcy5hdHRyKCdzcmMnKTtcblx0XHRcdFx0aWYgKChwYXRoKSAmJiAoJHRoaXMuY3NzKCdkaXNwbGF5JykgIT09ICdub25lJykpIHtcblx0XHRcdFx0XHRfaW1ncy5wdXNoKHBhdGgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH1cblxuXHRmdW5jdGlvbiBfc3RhcnRQcmVsb2FkZXIoKSB7XG5cblx0XHQkKCdib2R5JykuYWRkQ2xhc3MoJ292ZXJmbG93LWhpZGRlbicpO1xuXG5cdFx0Ly8g0LfQsNCz0YDRg9C20LXQvdC+IDAg0LrQsNGA0YLQuNC90L7QulxuXHRcdHZhciBsb2FkZWQgPSAwO1xuXG5cdFx0Ly8g0L/RgNC+0YXQvtC00LjQvCDQv9C+INCy0YHQtdC8INGB0L7QsdGA0LDQvdC90YvQvCDQutCw0YDRgtC40L3QutCw0Lxcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IF9pbWdzLmxlbmd0aDsgaSsrKSB7XG5cblx0XHRcdHZhciBpbWFnZSA9ICQoJzxpbWc+Jywge1xuXHRcdFx0XHRhdHRyOiB7XG5cdFx0XHRcdFx0c3JjOiBfaW1nc1tpXVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Ly8g0LfQsNCz0YDRg9C20LDQtdC8INC/0L4g0L/QvtC00L3QvtC5XG5cdFx0XHQkKGltYWdlKS5sb2FkKGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRsb2FkZWQrKztcblx0XHRcdFx0dmFyIHBlcmNlbnRMb2FkZWQgPSBfY291bnRQZXJjZW50KGxvYWRlZCwgX2ltZ3MubGVuZ3RoKTtcblx0XHRcdFx0X3NldFBlcmNlbnQocGVyY2VudExvYWRlZCk7XG5cdFx0XHR9KTtcblxuXHRcdH1cblx0fVxuXG5cdC8vINC/0LXRgNC10YHRh9C40YLRi9Cy0LDQtdGCINCyINC/0YDQvtGG0LXQvdGC0YssINGB0LrQvtC70YzQutC+INC60LDRgNGC0LjQvdC+0Log0LfQsNCz0YDRg9C20LXQvdC+XG5cdC8vIGN1cnJlbnQgLSBudW1iZXIsINGB0LrQvtC70YzQutC+INC60LDRgNGC0LjQvdC+0Log0LfQsNCz0YDRg9C20LXQvdC+XG5cdC8vIHRvdGFsIC0gbnVtYmVyLCDRgdC60L7Qu9GM0LrQviDQuNGFINCy0YHQtdCz0L5cblx0ZnVuY3Rpb24gX2NvdW50UGVyY2VudChjdXJyZW50LCB0b3RhbCkge1xuXHRcdHJldHVybiBNYXRoLmNlaWwoY3VycmVudCAvIHRvdGFsICogMTAwKTtcblx0fVxuXG5cdC8vINC30LDQv9C40YHRi9Cy0LDQtdGCINC/0YDQvtGG0LXQvdGCINCyIGRpdiDQv9GA0LXQu9C+0LDQtNC10YBcblx0Ly8gcGVyY2VudCAtIG51bWJlciwg0LrQsNC60YPRjiDRhtC40YTRgNGDINC30LDQv9C40YHQsNGC0Yxcblx0ZnVuY3Rpb24gX3NldFBlcmNlbnQocGVyY2VudCkge1xuXG5cdFx0JCgnLnByZWxvYWRlcl90ZXh0JykudGV4dChwZXJjZW50KTtcblxuXHRcdC8v0LrQvtCz0LTQsCDQtNC+0YjQu9C4INC00L4gMTAwJSwg0YHQutGA0YvQstCw0LXQvCDQv9GA0LXQu9C+0LDQtNC10YAg0Lgg0L/QvtC60LDQt9GL0LLQsNC10Lwg0YHQvtC00LXRgNC20LjQvNC+0LUg0YHRgtGA0LDQvdC40YbRi1xuXHRcdGlmIChwZXJjZW50ID49IDEwMCkge1xuXHRcdFx0JCgnLnByZWxvYWRlcl9jb250YWluZXInKS5kZWxheSg3MDApLmZhZGVPdXQoNTAwKTtcblx0XHRcdCQoJ2JvZHknKS5yZW1vdmVDbGFzcygnb3ZlcmZsb3ctaGlkZGVuJyk7XG5cdFx0XHRfZmluaXNoUHJlbG9hZGVyKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gX2ZpbmlzaFByZWxvYWRlcigpIHtcblx0XHRjb250ZW50UmVhZHkucmVzb2x2ZSgpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0LFxuXHRcdGNvbnRlbnRSZWFkeTogY29udGVudFJlYWR5XG5cdH07XG5cbn0pKCk7XG4iLCJ2YXIgcGFyYWxsYXggPSAoZnVuY3Rpb24oKSB7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblxuXHRcdFx0dmFyIGxheWVyID0gJCgnLnBhcmFsbGF4JykuZmluZCgnLnBhcmFsbGF4X19sYXllcicpO1xuXG5cdFx0XHRsYXllci5tYXAoZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuXHRcdFx0XHR2YXIgYm90dG9tUG9zaXRpb24gPSAoKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpICogKGtleSAvIDEwMCkpO1xuXHRcdFx0XHQkKHZhbHVlKS5jc3Moe1xuXHRcdFx0XHRcdCdib3R0b20nOiAnLScgKyBib3R0b21Qb3NpdGlvbiArICdweCcsXG5cdFx0XHRcdFx0J3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUzZCgwcHgsIDBweCwgMCknXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRpZigvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcblx0XHRcdHJldHVyblxuXHRcdH1cblx0XHRcdCQod2luZG93KS5vbignbW91c2Vtb3ZlJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHR2YXIgbW91c2VfZHggPSAoZS5wYWdlWCk7XG5cdFx0XHRcdHZhciBtb3VzZV9keSA9IChlLnBhZ2VZKTtcblxuXHRcdFx0XHR2YXIgdyA9ICh3aW5kb3cuaW5uZXJXaWR0aCAvIDIpIC0gbW91c2VfZHg7XG5cdFx0XHRcdHZhciBoID0gKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpIC0gbW91c2VfZHk7XG5cblx0XHRcdFx0bGF5ZXIubWFwKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcblx0XHRcdFx0XHR2YXIgYm90dG9tUG9zaXRpb24gPSAoKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpICogKGtleSAvIDEwMCkpO1xuXHRcdFx0XHRcdHZhciB3aWR0aFBvc2l0aW9uID0gdyAqIChrZXkgLyA4MCk7XG5cdFx0XHRcdFx0dmFyIGhlaWdodFBvc2l0aW9uID0gaCAqIChrZXkgLyA4MCk7XG5cdFx0XHRcdFx0JCh2YWx1ZSkuY3NzKHtcblx0XHRcdFx0XHRcdCdib3R0b20nOiAnLScgKyBib3R0b21Qb3NpdGlvbiArICdweCcsXG5cdFx0XHRcdFx0XHQndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aFBvc2l0aW9uICsgJ3B4LCAnICsgaGVpZ2h0UG9zaXRpb24gKyAncHgsIDApJ1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cblxufSgpKTtcbiIsInZhciBmbGlwcGVyID0gKGZ1bmN0aW9uKCkge1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0c2V0VXBFdmVudExpc3RlbmVycygpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0VXBFdmVudExpc3RlbmVycygpIHtcblx0XHR2YXIgYXV0aEVsZW0gPSAkKCcuYXV0aG9yaXplJyk7XG5cdFx0dmFyIGZsaXBFbGVtID0gJCgnLmZsaXAnKTtcblx0XHR2YXIgb3V0c2lkZUVsZW0gPSAkKCcucGFyYWxsYXhfX2xheWVyJyk7XG5cdFx0dmFyIGJhY2sgPSAkKCcjYmFja1RvTWFpbicpO1xuXG5cblx0XHRvdXRzaWRlRWxlbS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRpZihlLnRhcmdldC5pZCAhPSAnYXV0aG9yaXplJyAmJiBlLnRhcmdldC5pZCAhPSAnYXV0aG9yaXplX2RpdicpIHtcblx0XHRcdFx0YXV0aEVsZW0uZmFkZUluKDMwMCk7XG5cdFx0XHRcdGZsaXBFbGVtLnJlbW92ZUNsYXNzKCdmbGlwcGluZycpXG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRhdXRoRWxlbS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRhdXRoRWxlbS5mYWRlT3V0KDMwMCk7XG5cdFx0XHRmbGlwRWxlbS50b2dnbGVDbGFzcygnZmxpcHBpbmcnKVxuXHRcdH0pO1xuXG5cdFx0YmFjay5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRmbGlwRWxlbS5yZW1vdmVDbGFzcygnZmxpcHBpbmcnKTtcblx0XHRcdGF1dGhFbGVtLmZhZGVJbigzMDApO1xuXHRcdH0pXG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxufSgpKTtcbiIsInZhciBzY3JvbGwgPSAoZnVuY3Rpb24oKSB7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRpZigvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcblx0XHRcdHJldHVyblxuXHRcdH1cblxuXHRcdHZhciBsYXllcnMgPSAkKCcucGFyYWxsYXgtc2Nyb2xsX19sYXllcicpO1xuXHRcdFx0dmFyIG1haW4gPSAkKCcubWFpbicpO1xuXG5cdFx0XHQkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgc2Nyb2xsVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG5cdFx0XHRcdGxheWVycy5tYXAoZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuXHRcdFx0XHRcdHZhciBib3R0b21Qb3NpdGlvbiA9IHNjcm9sbFRvcCAqIGtleSAvIDkwO1xuXHRcdFx0XHRcdHZhciBoZWlnaHRQb3NpdGlvbiA9IC1zY3JvbGxUb3AgKiBrZXkgLyA5MDtcblxuXHRcdFx0XHRcdCQodmFsdWUpLmNzcyh7XG5cdFx0XHRcdFx0XHQndG9wJzogJy0nICsgYm90dG9tUG9zaXRpb24gKyAncHgnLFxuXHRcdFx0XHRcdFx0J3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUzZCgwLCcgKyBoZWlnaHRQb3NpdGlvbiArICdweCwgMCknXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dmFyIHRvcFBvcyA9IHNjcm9sbFRvcCAvIDc7XG5cdFx0XHRcdHZhciBib3R0b21Qb3MgPSAtc2Nyb2xsVG9wIC8gNztcblx0XHRcdFx0bWFpbi5jc3Moe1xuXHRcdFx0XHRcdCd0b3AnOiAnLScgKyB0b3BQb3MgKyAncHgnLFxuXHRcdFx0XHRcdCd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoMCwnICsgYm90dG9tUG9zICsgJ3B4LCAwKSdcblx0XHRcdFx0fSlcblx0XHRcdH0pXG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxuXG59KCkpO1xuIiwidmFyIHNsaWRlciA9IChmdW5jdGlvbigpIHtcblxuXHQvL0FycmF5cyBvZiBpbWFnZXMgaW4gZWFjaCBzbGlkZXIgcGFydFxuXHR2YXIgbWFpbkltYWdlcyA9ICQoJy5zbGlkZXJfX21haW4taW1nX2NvbnRhaW5lcicpO1xuXHR2YXIgcHJldkltYWdlcyA9ICQoJy5uZXh0U2xpZGVJbWcnKTtcblx0dmFyIG5leHRJbWFnZXMgPSAkKCcucHJldlNsaWRlSW1nJyk7XG5cblx0Ly8gQ29udHJvbCBidXR0b25zXG5cdHZhciBuZXh0U2xpZGUgPSAkKCcuc2xpZGVyX19uZXh0Jyk7XG5cdHZhciBwcmV2U2xpZGUgPSAkKCcuc2xpZGVyX19wcmV2Jyk7XG5cdHZhciBjdXJyZW50ID0gMDtcblxuXHR2YXIgdGltZSA9IDI1MDtcblx0dmFyIGFub3RoZXJTdGF0ZTtcblxuXHR2YXIgY3VycmVudFNsaWRlID0gMDtcblx0ZnVuY3Rpb24gX3JlbmRlck1haW4oY2hhbmdlKSB7XG5cdFx0YW5vdGhlclN0YXRlID0gJC5EZWZlcnJlZCgpO1xuXG5cdFx0bWFpbkltYWdlcy5lcShjdXJyZW50U2xpZGUpLmZhZGVPdXQoMTUwKTtcblxuXHRcdGlmKGNoYW5nZSA9PT0gJ2luY3JlYXNlJykge1xuXHRcdFx0Y3VycmVudFNsaWRlKys7XG5cdFx0XHRjdXJyZW50U2xpZGUgPSBjdXJyZW50U2xpZGUgPiBtYWluSW1hZ2VzLmxlbmd0aCAtIDEgPyAwIDogY3VycmVudFNsaWRlO1xuXHRcdH0gZWxzZSBpZihjaGFuZ2UgPT09ICdkZWNyZWFzZScpIHtcblx0XHRcdGN1cnJlbnRTbGlkZS0tO1xuXHRcdFx0Y3VycmVudFNsaWRlID0gY3VycmVudFNsaWRlIDwgMCA/IG1haW5JbWFnZXMubGVuZ3RoIC0gMSA6IGN1cnJlbnRTbGlkZTtcblx0XHR9XG5cblx0XHRtYWluSW1hZ2VzLmVxKGN1cnJlbnRTbGlkZSkuZGVsYXkoMTAwKS5mYWRlSW4oMTUwLCBmdW5jdGlvbigpIHtcblx0XHRcdGFub3RoZXJTdGF0ZS5yZXNvbHZlKCk7XG5cdFx0fSk7XG5cdH1cblxuXG5cdHZhciBjdXJyZW50TmV4dCA9IDE7XG5cdGZ1bmN0aW9uIF9zbGlkZXJOZXh0QnV0dG9uTmV4dCgpIHtcblx0XHRcdG5leHRJbWFnZXMuZXEoY3VycmVudE5leHQpLmFuaW1hdGUoe1xuXHRcdFx0XHR0b3A6ICctMTAwJSdcblx0XHRcdH0sIHRpbWUgKTtcblxuXHRcdFx0Y3VycmVudE5leHQrKztcblx0XHRcdGN1cnJlbnROZXh0ID0gY3VycmVudE5leHQgPiBtYWluSW1hZ2VzLmxlbmd0aCAtIDEgPyAwIDogY3VycmVudE5leHQ7XG5cblx0XHRcdG5leHRJbWFnZXMuZXEoY3VycmVudE5leHQpLmFuaW1hdGUoe1xuXHRcdFx0XHRkaXNwbGF5OiAnbm9uZScsXG5cdFx0XHRcdHRvcDogJzEwMCUnXG5cdFx0XHR9LCAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0bmV4dEltYWdlcy5lcShjdXJyZW50TmV4dCkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cdFx0XHR9KTtcblxuXHRcdFx0bmV4dEltYWdlcy5lcShjdXJyZW50TmV4dCkuYW5pbWF0ZSh7XG5cdFx0XHRcdHRvcDogJzAnXG5cdFx0XHR9LCB0aW1lKTtcblx0fVxuXG5cdGZ1bmN0aW9uIF9zbGlkZXJOZXh0QnV0dG9uUHJldigpIHtcblx0XHRuZXh0SW1hZ2VzLmVxKGN1cnJlbnROZXh0KS5hbmltYXRlKHtcblx0XHRcdHRvcDogJysxMDAlJ1xuXHRcdH0sIHRpbWUgKTtcblxuXHRcdGN1cnJlbnROZXh0LS07XG5cdFx0Y3VycmVudE5leHQgPSBjdXJyZW50TmV4dCA8IDAgPyBtYWluSW1hZ2VzLmxlbmd0aCAtIDEgOiBjdXJyZW50TmV4dDtcblxuXHRcdG5leHRJbWFnZXMuZXEoY3VycmVudE5leHQpLmFuaW1hdGUoe1xuXHRcdFx0ZGlzcGxheTogJ25vbmUnLFxuXHRcdFx0dG9wOiAnLTEwMCUnXG5cdFx0fSwgMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRuZXh0SW1hZ2VzLmVxKGN1cnJlbnROZXh0KS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblx0XHR9KTtcblxuXHRcdG5leHRJbWFnZXMuZXEoY3VycmVudE5leHQpLmFuaW1hdGUoe1xuXHRcdFx0dG9wOiAnMCdcblx0XHR9LCB0aW1lKTtcblx0fVxuXG5cblx0dmFyIGN1cnJlbnRQcmV2ID0gbWFpbkltYWdlcy5sZW5ndGggLSAxO1xuXHRmdW5jdGlvbiBfc2xpZGVyUHJldkJ1dHRvbk5leHQoKSB7XG5cdFx0cHJldkltYWdlcy5lcShjdXJyZW50UHJldikuYW5pbWF0ZSh7XG5cdFx0XHR0b3A6ICcrMTAwJSdcblx0XHR9LCB0aW1lICk7XG5cblx0XHRjdXJyZW50UHJldisrO1xuXHRcdGN1cnJlbnRQcmV2ID0gY3VycmVudFByZXYgPiBtYWluSW1hZ2VzLmxlbmd0aCAtIDEgPyAwIDogY3VycmVudFByZXY7XG5cblx0XHRwcmV2SW1hZ2VzLmVxKGN1cnJlbnRQcmV2KS5hbmltYXRlKHtcblx0XHRcdGRpc3BsYXk6ICdub25lJyxcblx0XHRcdHRvcDogJy0xMDAlJ1xuXHRcdH0sIDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0cHJldkltYWdlcy5lcShjdXJyZW50UHJldikuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cdFx0fSk7XG5cblx0XHRwcmV2SW1hZ2VzLmVxKGN1cnJlbnRQcmV2KS5hbmltYXRlKHtcblx0XHRcdHRvcDogJzAnXG5cdFx0fSwgdGltZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBfc2xpZGVyUHJldkJ1dHRvblByZXYoKSB7XG5cdFx0cHJldkltYWdlcy5lcShjdXJyZW50UHJldikuYW5pbWF0ZSh7XG5cdFx0XHR0b3A6ICctMTAwJSdcblx0XHR9LCB0aW1lICk7XG5cblx0XHRjdXJyZW50UHJldi0tO1xuXHRcdGN1cnJlbnRQcmV2ID0gY3VycmVudFByZXYgPCAwID8gbWFpbkltYWdlcy5sZW5ndGggLSAxIDogY3VycmVudFByZXY7XG5cblx0XHRwcmV2SW1hZ2VzLmVxKGN1cnJlbnRQcmV2KS5hbmltYXRlKHtcblx0XHRcdGRpc3BsYXk6ICdub25lJyxcblx0XHRcdHRvcDogJysxMDAlJ1xuXHRcdH0sIDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0cHJldkltYWdlcy5lcShjdXJyZW50UHJldikuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cdFx0fSk7XG5cblx0XHRwcmV2SW1hZ2VzLmVxKGN1cnJlbnRQcmV2KS5hbmltYXRlKHtcblx0XHRcdHRvcDogJzAnXG5cdFx0fSwgdGltZSk7XG5cdH1cblxuXG5cdG5leHRTbGlkZS5jbGljayhmdW5jdGlvbigpIHtcblx0XHQkLndoZW4oX3JlbmRlck1haW4oJ2luY3JlYXNlJyksIF9zbGlkZXJOZXh0QnV0dG9uTmV4dCgpLCBfc2xpZGVyUHJldkJ1dHRvbk5leHQoKSxhbm90aGVyU3RhdGUpLmRvbmUoZnVuY3Rpb24gKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ2luY3JlYXNlZCcpO1xuXHRcdH0pO1xuXHR9KTtcblxuXHRwcmV2U2xpZGUuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0JC53aGVuKF9yZW5kZXJNYWluKCdkZWNyZWFzZScpLCBfc2xpZGVyTmV4dEJ1dHRvblByZXYoKSwgX3NsaWRlclByZXZCdXR0b25QcmV2KCksYW5vdGhlclN0YXRlKS5kb25lKGZ1bmN0aW9uICgpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdkZWNyZWFzZWQnKTtcblx0XHR9KTtcblx0fSk7XG5cblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdG1haW5JbWFnZXMuZmFkZU91dCgzMCk7XG5cdFx0bWFpbkltYWdlcy5lcSgwKS5mYWRlSW4oMzApO1xuXG5cdFx0cHJldkltYWdlcy5lcSgobWFpbkltYWdlcy5sZW5ndGggLSAxKSkuY3NzKHtcblx0XHRcdCd0b3AnOiAnMCdcblx0XHR9KTtcblx0XHRuZXh0SW1hZ2VzLmVxKDEpLmNzcyh7XG5cdFx0XHQndG9wJzogJzAnXG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxufSgpKTsiLCJ2YXIgc2xpZGVyVGV4dCA9IChmdW5jdGlvbigpIHtcblx0dmFyIHRpdGxlc0NvbnRhaW5lciA9ICQoJy53b3Jrc19fbGVmdF9oZWFkZXInKTtcblx0dmFyIHRpdGxlcyA9ICQoJy53b3Jrc19fbGVmdF9oZWFkZXJfaW5uZXInKTtcblx0dmFyIHRpdGxlRWxlbSA9ICQoJy53b3Jrc19fbGVmdF9oZWFkZXJfaW5uZXInKS5lcSgwKTtcblxuXHR2YXIgZGVzY3JpcHRpb25Db250YWluZXIgPSAkKCcud29ya3NfX2xlZnRfZG9uZS13aXRoJyk7XG5cdHZhciBkZXNjcmlwdGlvbiA9ICQoJy53b3Jrc19fbGVmdF9kb25lLXdpdGhfaW5uZXInKTtcblx0dmFyIGRlc2NyaXB0aW9uRWxlbSA9ICQoJy53b3Jrc19fbGVmdF9kb25lLXdpdGhfaW5uZXInKS5lcSgwKTtcblxuXHQvL2NvbnRyb2wgYnV0dG9uc1xuXHR2YXIgbmV4dEJ1dHRvbiA9ICQoJy5zbGlkZXJfX25leHQnKTtcblx0dmFyIHByZXZCdXR0b24gPSAkKCcuc2xpZGVyX19wcmV2Jyk7XG5cblx0Ly9hcnJheXMgd2l0aCB0aXRsZXMgYW5kIGRlc2NyaXB0aW9uXG5cdHZhciB0aXRsZXNBcnJheSA9IFtdO1xuXHR2YXIgZGVzY3JpcHRpb25BcnJheSA9IFtdO1xuXG5cdC8vIFNhdmVzIGFsbCB0aXRsZXMgaW50byBhcnJheVxuXHRmdW5jdGlvbiBfcHJvY2Vzc1RpdGxlcyh0aXRsZXMsIGFycmF5KSB7XG5cdFx0dGl0bGVzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHQkdGhpcyA9ICQodGhpcyk7XG5cdFx0XHR2YXIgdGV4dCA9ICR0aGlzLnRleHQoKTtcblx0XHRcdCR0aGlzLmh0bWwoJycpO1xuXHRcdFx0YXJyYXkucHVzaChfc3BhbmlmeSh0ZXh0KSk7XG5cdFx0fSk7XG5cblx0XHQvL3JlbW92ZXMgYWxsIGVsZW1lbnRzIGV4Y2VwdCBvbmUgZnJvbSBET01cblx0XHRkZXNjcmlwdGlvbkNvbnRhaW5lci5lbXB0eSgpO1xuXHRcdGRlc2NyaXB0aW9uQ29udGFpbmVyLmFwcGVuZChkZXNjcmlwdGlvbkVsZW0pO1xuXHRcdHRpdGxlc0NvbnRhaW5lci5lbXB0eSgpO1xuXHRcdHRpdGxlc0NvbnRhaW5lci5hcHBlbmQodGl0bGVFbGVtKTtcblx0fVxuXG5cdC8vIFNhdmVzIGFsbCBkZXNjcmlwdGlvbnMgaW50byBhcnJheVxuXHRmdW5jdGlvbiBfcHJvY2Vzc0Rlc2NyaXB0aW9uKHRpdGxlcywgYXJyYXkpIHtcblx0XHR0aXRsZXMuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdHZhciB0ZXh0ID0gJCh0aGlzKS5odG1sKCk7XG5cdFx0XHRhcnJheS5wdXNoKHRleHQpXG5cdFx0fSlcblx0fVxuXG5cdC8vIEZ1bmN0aW9uIGFkZHMgc3BhbiB3aXRoIC53b3JkIGNsYXNzIHRvIGVhY2ggd29yZCBhbmQgc3BhbiB3aXRoIC5sZXR0ZXIgY2xhc3Ncblx0Ly8gdG8gZWFjaCBsZXR0ZXJcblx0ZnVuY3Rpb24gX3NwYW5pZnkodGV4dCkge1xuXHRcdHZhciBhcnJheSA9IFtdO1xuXHRcdHZhciB3b3Jkc0FycmF5ID0gdGV4dC5zcGxpdCgnICcpO1xuXHRcdHZhciBzcGFubmVkVGV4dCA9ICcnO1xuXG5cdFx0d29yZHNBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKHdvcmQpIHtcblx0XHRcdHZhciBsZXR0ZXJzQXJyYXkgPSB3b3JkLnNwbGl0KCcnKTtcblx0XHRcdHZhciBzcGFubmVkV29yZCA9ICcnO1xuXG5cdFx0XHRsZXR0ZXJzQXJyYXkuZm9yRWFjaChmdW5jdGlvbihsZXR0ZXIpIHtcblx0XHRcdFx0c3Bhbm5lZFdvcmQgKz0gJzxzcGFuIGNsYXNzPVwibGV0dGVyXCI+JyArIGxldHRlciArICc8L3NwYW4+Jztcblx0XHRcdH0pO1xuXG5cdFx0XHRzcGFubmVkVGV4dCArPSAnPHNwYW4gY2xhc3M9XCJ3b3JkXCI+JyArIHNwYW5uZWRXb3JkICsgJzwvc3Bhbj4nO1xuXHRcdH0pO1xuXG5cdFx0YXJyYXkucHVzaChzcGFubmVkVGV4dCk7XG5cdFx0cmV0dXJuIGFycmF5XG5cdH1cblxuXHQvL1Nob3dzIHNlbGVjdGVkIHRpdGxlXG5cdGZ1bmN0aW9uIF9yZW5kZXJUaXRsZShudW0sIGFycmF5LCBlbGVtKSB7XG5cdFx0ZWxlbS5odG1sKGFycmF5W251bV0pO1xuXHRcdGVsZW0uZmluZCgnLmxldHRlcicpLmVhY2goZnVuY3Rpb24oaW5kZXgpIHtcblx0XHRcdCR0aGlzID0gJCh0aGlzKTtcblxuXHRcdFx0KGZ1bmN0aW9uKGVsZW0pIHtcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRlbGVtLmFkZENsYXNzKCdhY3RpdmVMZXR0ZXInKVxuXHRcdFx0XHR9LCAxMCAqIGluZGV4KTtcblx0XHRcdH0pKCR0aGlzKTtcblxuXHRcdH0pXG5cdH1cblxuXHQvL1Nob3dzIHNlbGVjdGVkIGRlc2NyaXB0aW9uXG5cdGZ1bmN0aW9uIF9yZW5kZXJEZXNjcmlwdGlvbihudW0sIGFycmF5LCBlbGVtKSB7XG5cdFx0ZWxlbS5odG1sKGFycmF5W251bV0pXG5cdH1cblxuXHRmdW5jdGlvbiBfc2V0RXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0dmFyIHF0eSA9IHRpdGxlcy5sZW5ndGg7XG5cdFx0dmFyIGNvdW50ZXIgPSAwO1xuXG5cdFx0bmV4dEJ1dHRvbi5jbGljayhmdW5jdGlvbigpIHtcblx0XHRcdGNvdW50ZXIrKztcblx0XHRcdGNvdW50ZXIgPSBjb3VudGVyIDw9IChxdHkgLSAxKSA/IGNvdW50ZXIgOiAwO1xuXHRcdFx0X3JlbmRlclRpdGxlKGNvdW50ZXIsIHRpdGxlc0FycmF5LCB0aXRsZUVsZW0pO1xuXHRcdFx0X3JlbmRlckRlc2NyaXB0aW9uKGNvdW50ZXIsIGRlc2NyaXB0aW9uQXJyYXksIGRlc2NyaXB0aW9uRWxlbSk7XG5cdFx0fSk7XG5cblx0XHRwcmV2QnV0dG9uLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHRcdFx0Y291bnRlci0tO1xuXHRcdFx0Y291bnRlciA9IGNvdW50ZXIgPCAwID8gKHF0eSAtIDEpIDogY291bnRlcjtcblx0XHRcdF9yZW5kZXJUaXRsZShjb3VudGVyLCB0aXRsZXNBcnJheSwgdGl0bGVFbGVtKTtcblx0XHRcdF9yZW5kZXJEZXNjcmlwdGlvbihjb3VudGVyLCBkZXNjcmlwdGlvbkFycmF5LCBkZXNjcmlwdGlvbkVsZW0pO1xuXHRcdH0pXG5cdH1cblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdF9wcm9jZXNzVGl0bGVzKHRpdGxlcywgdGl0bGVzQXJyYXkpO1xuXHRcdF9wcm9jZXNzRGVzY3JpcHRpb24oZGVzY3JpcHRpb24sIGRlc2NyaXB0aW9uQXJyYXkpO1xuXHRcdF9yZW5kZXJUaXRsZSgwLCB0aXRsZXNBcnJheSwgdGl0bGVFbGVtKTtcblx0XHRfcmVuZGVyRGVzY3JpcHRpb24oMCwgZGVzY3JpcHRpb25BcnJheSwgZGVzY3JpcHRpb25FbGVtKTtcblx0XHRfc2V0RXZlbnRMaXN0ZW5lcnMoKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG5cbn0oKSk7XG4iLCJ2YXIgdGFiID0gKGZ1bmN0aW9uKCkge1xuXG5cdHZhciB0YWJzID0gJCgnLnRhYnNfX2xpc3QtaXRlbScpO1xuXHR2YXIgdGFic0xpbmsgPSAkKCcudGFic19fY29udHJvbC1pdGVtJyk7XG5cblx0ZnVuY3Rpb24gX3NldHVwRXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0dGFicy5lcSgwKS5hZGRDbGFzcygnYWN0aXZlVGFiJyk7XG5cdFx0dGFic0xpbmsuZXEoMCkuYWRkQ2xhc3MoJ2FjdGl2ZVRhYkxpbmsnKTtcblxuXHRcdHRhYnNMaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGFjdGl2ZSA9ICQodGhpcykuZGF0YSgnY2xhc3MnKTtcblx0XHRcdHRhYnMucmVtb3ZlQ2xhc3MoJ2FjdGl2ZVRhYicpO1xuXHRcdFx0dGFic0xpbmsucmVtb3ZlQ2xhc3MoJ2FjdGl2ZVRhYkxpbmsnKTtcblx0XHRcdHRhYnMuZXEoYWN0aXZlKS5hZGRDbGFzcygnYWN0aXZlVGFiJyk7XG5cdFx0XHR0YWJzTGluay5lcShhY3RpdmUpLmFkZENsYXNzKCdhY3RpdmVUYWJMaW5rJyk7XG5cdFx0fSlcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0X3NldHVwRXZlbnRMaXN0ZW5lcnMoKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG59KCkpO1xuIiwidmFyIGRpYWdyYW0gPSAoZnVuY3Rpb24oKSB7XG5cblx0dmFyIGVsZW0gPSAkKCcuc2tpbGxzX19lbGVtcycpLmVxKDApO1xuXHR2YXIgZGlhZ3JhbUFycmF5ID0gJCgnLnNlY3RvcicpO1xuXHR2YXIgZGlhZ3JhbVZhbHVlcztcblxuXHRmdW5jdGlvbiBfc2V0RXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcblx0XHRcdHZhciB0b3BFZGdlID0gJChlbGVtKS5vZmZzZXQoKS50b3A7XG5cdFx0XHR2YXIgc2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXHRcdFx0dmFyIGhlaWdodCA9ICQod2luZG93KS5pbm5lckhlaWdodCgpO1xuXHRcdFx0dmFyIGFuaW1hdGlvblN0YXJ0ID0gaGVpZ2h0ICsgc2Nyb2xsIC0gaGVpZ2h0IC8gNTtcblx0XHRcdGlmIChhbmltYXRpb25TdGFydCA+IHRvcEVkZ2UpIHtcblx0XHRcdFx0X2FuaW1hdGUoKTtcblx0XHRcdH1cblx0XHR9KVxuXHR9XG5cblx0ZnVuY3Rpb24gX2FuaW1hdGUoKSB7XG5cdFx0dmFyIG1heFZhbCA9IDI4MDtcblx0XHRkaWFncmFtQXJyYXkuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XG5cdFx0XHR2YXIgZGF0YUlkID0gJHRoaXMuZGF0YSgnZGlhZ3JhbScpO1xuXHRcdFx0dmFyIGVsZW1WYWx1ZSA9IGRpYWdyYW1WYWx1ZXNbZGF0YUlkXTtcblx0XHRcdHZhciBkYXNoID0gKGVsZW1WYWx1ZSAvIDEwMCkgKiBtYXhWYWw7XG5cdFx0XHQkdGhpcy5jc3Moe1xuXHRcdFx0XHQnc3Ryb2tlLWRhc2hhcnJheSc6IGRhc2ggKyAnICcgKyBtYXhWYWxcblx0XHRcdH0pXG5cblx0XHR9KVxuXHR9XG5cblx0ZnVuY3Rpb24gX2dldFZhbHVlcygpIHtcblx0XHQkLmdldCgnL2dldGRpYWdyYW0nLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRkaWFncmFtVmFsdWVzID0gZGF0YVswXTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0X2dldFZhbHVlcygpO1xuXHRcdF9zZXRFdmVudExpc3RlbmVycygpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cbn0oKSk7XG4iLCJ2YXIgc2Nyb2xsQXJyb3cgPSAoZnVuY3Rpb24oKSB7XG5cblx0ZnVuY3Rpb24gX3NldEV2ZW50TGlzdGVuZXJzKCkge1xuXHRcdCQoJy5hcnJvdy1kb3duLWljb24nKS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBoZWlnaHQgPSAkKHdpbmRvdykuaW5uZXJIZWlnaHQoKTtcblx0XHRcdCQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHtcblx0XHRcdFx0c2Nyb2xsVG9wOiBoZWlnaHRcblx0XHRcdH0sIDgwMCk7XG5cdFx0fSlcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0X3NldEV2ZW50TGlzdGVuZXJzKCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxuXG59KCkpO1xuIiwidmFyIHZhbGlkYXRpb24gPSAoZnVuY3Rpb24oKSB7XG5cbiAgdmFyIG1vZGFsQ29udGFpbmVyUm9ib3QgPSAkKCcjaW5kZXgtbW9kYWwtY29udGFpbmVyLXJvYm90cycpO1xuICB2YXIgbW9kYWxDb250YWluZXJGaWVsZCA9ICQoJyNpbmRleC1tb2RhbC1jb250YWluZXItZmllbGQnKTtcbiAgdmFyIGFsbE1vZGFscyA9ICQoJy5pbmRleC1tb2RhbC1jb250YWluZXInKTtcbiAgdmFyIGFjdGl2ZU1vZGFsID0gJ2luZGV4LW1vZGFsLWFjdGl2ZSc7XG4gIHZhciBpc0h1bWFuID0gJCgnI2lzSHVtYW4nKTtcbiAgdmFyIG5vdFJvYm90ID0gJCgnI3JhZGlvMScpO1xuICB2YXIgbG9naW4gPSAkKCcjaW5kZXhfbG9naW4nKTtcbiAgdmFyIHBhc3MgPSAkKCcjaW5kZXhfcGFzcycpO1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgX3NldFVwRXZlbnRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9zZXRVcEV2ZW50TGlzdGVuZXJzKCkge1xuXG4gICAgJCgnI2F1dGhvcml6ZScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgaWYoIWlzSHVtYW4ucHJvcCgnY2hlY2tlZCcpIHx8ICFub3RSb2JvdC5wcm9wKCdjaGVja2VkJykpIHtcbiAgICAgICAgX3Nob3dNb2RhbChtb2RhbENvbnRhaW5lclJvYm90KTtcbiAgICAgIH0gZWxzZSBpZiAobG9naW4udmFsKCkgPT09ICcnIHx8IHBhc3MudmFsKCkgPT09ICcnKSB7XG4gICAgICAgIF9zaG93TW9kYWwobW9kYWxDb250YWluZXJGaWVsZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBmb3JtID0gJCgnLmF1dGhfZm9ybScpO1xuICAgICAgICAgIHZhciBkZWZPYmogPSBfYWpheEZvcm0oZm9ybSwgJy4vbG9naW4nKTtcbiAgICAgICAgICBpZiAoZGVmT2JqKSB7XG4gICAgICAgICAgICBkZWZPYmouZG9uZShmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgdmFyIHN0YXR1cyA9IHJlcy5zdGF0dXM7XG4gICAgICAgICAgICAgIGlmIChzdGF0dXMgPT09ICdPSycpe1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9hZG1pbic7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZGVmT2JqLmZhaWwoZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihyZXMpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJCgnLmluZGV4LW1vZGFsLWJsb2NrLWJ1dHRvbicpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIF9oaWRlTW9kYWwoYWxsTW9kYWxzKTtcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gX3Nob3dNb2RhbChlbGVtZW50KSB7XG4gICAgZWxlbWVudC5hZGRDbGFzcyhhY3RpdmVNb2RhbCk7XG4gIH1cbiAgZnVuY3Rpb24gX2hpZGVNb2RhbChlbGVtZW50KSB7XG4gICAgZWxlbWVudC5yZW1vdmVDbGFzcyhhY3RpdmVNb2RhbClcbiAgfVxuICBmdW5jdGlvbiBfYWpheEZvcm0oZm9ybSwgdXJsKXtcbiAgICB2YXIgZGF0YSA9IGZvcm0uc2VyaWFsaXplKCk7XG4gICAgdmFyIGRlZk9iaiA9ICQuYWpheCh7XG4gICAgICB0eXBlIDogXCJQT1NUXCIsXG4gICAgICB1cmwgOiB1cmwsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGVmT2JqO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0XG4gIH1cbn0oKSk7IiwidmFyIGFkbWluID0gKGZ1bmN0aW9uKCkge1xuXG4gIHZhciBtb2RhbCA9ICQoJy5tb2RhbC1jb250YWluZXInKTtcbiAgdmFyIG9rQnV0dG9uID0gJCgnLm1vZGFsT2snKTtcbiAgdmFyIGJhY2tUb01haW4gPSAkKCcuYWRtaW5faGVhZGVyX3JldHVybicpO1xuICB2YXIgc2F2ZURpYWdyYW0gPSAkKCcjc2F2ZURpYWdyYW0nKTtcblxuICBmdW5jdGlvbiBfc2hvd01vZGFsKHJlc3VsdCkge1xuICAgIGlmIChyZXN1bHQgPT09ICdzdWNjZXNzJykge1xuICAgICAgbW9kYWwuZXEoMCkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1vZGFsLmVxKDEpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIF9sb2dPdXQoKSB7XG4gICAgZGVmT2JqID0gJC5hamF4KHtcbiAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgdXJsOiAnLi9sb2dvdXQnXG4gICAgfSkuZmFpbChmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmxvZygnZXJyb3InKTtcbiAgICB9KS5jb21wbGV0ZShmdW5jdGlvbiAoKSB7XG4gICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvJztcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gX2FkZE5ld1dvcmsoKSB7XG4gICAgdmFyIGZvcm1EYXRhID0gbmV3IEZvcm1EYXRhKCQoJyN1cGxvYWRGb3JtJylbMF0pO1xuXG4gICAgJC5hamF4KHtcbiAgICAgIHR5cGU6IFwiUE9TVFwiLFxuICAgICAgcHJvY2Vzc0RhdGE6IGZhbHNlLFxuICAgICAgY29udGVudFR5cGU6IGZhbHNlLFxuICAgICAgdXJsOiBcIi4vdXBsb2FkXCIsXG4gICAgICBkYXRhOiAgZm9ybURhdGFcbiAgICB9KVxuICAgICAgLmRvbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgIF9zaG93TW9kYWwoJ3N1Y2Nlc3MnKVxuICAgICAgfSkuZmFpbChmdW5jdGlvbigpIHtcbiAgICAgIF9zaG93TW9kYWwoJ2ZhaWwnKVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBfcG9zdERpYWdyYW1WYWx1ZXMoKSB7XG4gICAgdmFyIGVsZW1lbnRzID0gJCgnLnRhYnNfX2xpc3RfYmxvY2stZWxlbScpO1xuICAgIHZhciB0ZXh0ID0gJCgnLnRhYnNfX2xpc3QtdGV4dCcpO1xuICAgIHZhciB2YWx1ZSA9ICQoJy50YWJzX19saXN0LWlucHV0Jyk7XG4gICAgdmFyIGRpYWdyYW1WYWx1ZXMgPSB7fTtcblxuICAgIGVsZW1lbnRzLmVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIG5hbWUgPSAkKHRoaXMpLmZpbmQodGV4dCkudGV4dCgpLnRvTG93ZXJDYXNlKCkucmVwbGFjZSgnLicsICcnKTtcbiAgICAgIGRpYWdyYW1WYWx1ZXNbbmFtZV0gPSAkKHRoaXMpLmZpbmQodmFsdWUpLnZhbCgpO1xuICAgIH0pO1xuXG4gICAgJC5wb3N0KFwiL2RpYWdyYW1cIiwgZGlhZ3JhbVZhbHVlcykuZG9uZShmdW5jdGlvbiAoKSB7XG4gICAgICBfc2hvd01vZGFsKCdzdWNjZXNzJylcbiAgICB9KS5mYWlsKGZ1bmN0aW9uICgpIHtcbiAgICAgIF9zaG93TW9kYWwoJ2ZhaWwnKVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBfc2V0dXBFdmVudExpc3RlbmVycygpIHtcbiAgICBva0J1dHRvbi5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICBtb2RhbC5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpXG4gICAgfSk7XG5cbiAgICBiYWNrVG9NYWluLmNsaWNrKF9sb2dPdXQpO1xuICAgIHNhdmVEaWFncmFtLmNsaWNrKF9wb3N0RGlhZ3JhbVZhbHVlcyk7XG5cbiAgICAkKCcjdXBsb2FkRm9ybScpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBfYWRkTmV3V29yaygpO1xuICAgIH0pO1xuXG4gICAgJCgnI2Jsb2dQb3N0Jykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHZhciBkYXRhID0gJCh0aGlzKS5zZXJpYWxpemUoKTtcblxuICAgICAgJC5wb3N0KFwiLi9hZGRibG9ncG9zdFwiLCBkYXRhKS5kb25lKGZ1bmN0aW9uKCkge1xuICAgICAgICBfc2hvd01vZGFsKCdzdWNjZXNzJylcbiAgICAgICAgJCgnI2Jsb2dQb3N0JylbMF0ucmVzZXQoKTtcbiAgICAgIH0pLmZhaWwoZnVuY3Rpb24oKSB7XG4gICAgICAgIF9zaG93TW9kYWwoJ2ZhaWwnKVxuICAgICAgfSk7XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgX3NldHVwRXZlbnRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgaW5pdDogaW5pdFxuICB9XG59KCkpO1xuIiwiZnVuY3Rpb24gbmF2aWdhdGlvbigpIHtcblx0J3VzZSBzdHJpY3QnO1xuXHQkKCcjbmF2LWljb24nKS5jbGljayhmdW5jdGlvbigpIHtcblx0XHQkKHRoaXMpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XG5cdFx0JCgnI292ZXJsYXknKS50b2dnbGVDbGFzcygnb3BlbicpO1xuXHR9KTtcbn07XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXG5cdHZhciBwYXRoID0gd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lO1xuXG5cdHByZWxvYWRlci5pbml0KCk7XG5cdG5hdmlnYXRpb24oKTtcblxuXHRpZiAocGF0aCA9PT0gJy8nIHx8IHBhdGggPT09ICcvaW5kZXguaHRtbCcpIHtcblx0XHRwYXJhbGxheC5pbml0KCk7XG5cdFx0ZmxpcHBlci5pbml0KCk7XG5cdFx0dmFsaWRhdGlvbi5pbml0KCk7XG5cdH0gZWxzZSB7XG5cdFx0c2Nyb2xsLmluaXQoKTtcblx0fVxuXG5cdGlmIChwYXRoID09PSAnL2Jsb2cuaHRtbCcgfHwgcGF0aCA9PT0gJy9ibG9nJykge1xuXHRcdGJsb2dOYXYuaW5pdCgpO1xuXHR9XG5cblx0aWYgKHBhdGggPT09ICcvd29ya3MuaHRtbCcgfHwgcGF0aCA9PT0gJy93b3JrcycpIHtcblx0XHRzbGlkZXIuaW5pdCgpO1xuXHRcdHNsaWRlclRleHQuaW5pdCgpO1xuXHR9XG5cblx0aWYgKHBhdGggPT09ICcvYWJvdXRtZS5odG1sJyB8fCBwYXRoID09PSAnL2Fib3V0bWUnKSB7XG5cdFx0Z29vZ2xlTWFwLmluaXQoKTtcblx0XHRkaWFncmFtLmluaXQoKTtcblx0fVxuXG5cdGlmIChwYXRoID09PSAnL2FkbWluLmh0bWwnIHx8IHBhdGggPT09ICcvYWRtaW4nKSB7XG5cdFx0dGFiLmluaXQoKTtcblx0fVxuXG5cdGlmIChwYXRoICE9PSAnYWRtaW4nKSB7XG5cdFx0c2Nyb2xsQXJyb3cuaW5pdCgpO1xuXHRcdGFkbWluLmluaXQoKTtcblx0fVxuXG59KTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
