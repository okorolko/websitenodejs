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
			}]
		};
		var mapElement = document.getElementById('map');
		var map = new google.maps.Map(mapElement, mapOptions);
		var locations = [
			['Oleg Korolko', 'undefined', 'undefined', '', 'undefined', 59.9342802, 30.335098600000038, 'https://mapbuildr.com/assets/img/markers/ellipse-red.png']
		];
		for (var i = 0; i < locations.length; i++) {
			if (locations[i][1] == 'undefined') {
				var description = '';
			} else {
				var description = locations[i][1];
			}
			if (locations[i][2] == 'undefined') {
				var telephone = '';
			} else {
				var telephone = locations[i][2];
			}
			if (locations[i][3] == 'undefined') {
				var email = '';
			} else {
				var email = locations[i][3];
			}
			if (locations[i][4] == 'undefined') {
				var web = '';
			} else {
				var web = locations[i][4];
			}
			if (locations[i][7] == 'undefined') {
				var markericon = '';
			} else {
				markericon = locations[i][7];
			}
			var marker = new google.maps.Marker({
				icon: markericon,
				position: new google.maps.LatLng(locations[i][5], locations[i][6]),
				map: map,
				title: locations[i][0],
				desc: description,
				tel: telephone,
				email: email,
				web: web
			});
			var link = '';
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
			var iw = new google.maps.InfoWindow();
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

	}());

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
		_imgs = [],
		contentReady = $.Deferred();

	function init() {
		_countImages();
		_startPreloader();
	}

	function _countImages() {

		$.each($('*'), function() {
			var $this = $(this),
				background = $this.css('background-image'),
				img = $this.is('img');

			if (background != 'none') {

				var path = background.replace('url("', "").replace('")', "");
				path = path.replace('url(', "").replace(')', "");

				_imgs.push(path);
			}
			if (img) {
				path = '' + $this.attr('src');
				if ((path) && ($this.css('display') !== 'none')) {
					_imgs.push(path);
				}
			}
		});
	}

	function _startPreloader() {
		$('body').addClass('overflow-hidden');

		var loaded = 0;

		for (var i = 0; i < _imgs.length; i++) {
			var image = $('<img>', {
				attr: {
					src: _imgs[i]
				}
			});

			$(image).load(function() {
				loaded++;
				var percentLoaded = _countPercent(loaded, _imgs.length);
				_setPercent(percentLoaded);
			});

		}
	}

	function _countPercent(current, total) {
		return Math.ceil(current / total * 100);
	}

	function _setPercent(percent) {

		$('.preloader_text').text(percent);

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdvb2dsZU1hcC5qcyIsImJsb2dOYXYuanMiLCJwcmVsb2FkZXIuanMiLCJwYXJhbGxheC5qcyIsImZsaXBwZXIuanMiLCJzY3JvbGwuanMiLCJzbGlkZXIuanMiLCJzbGlkZXJUZXh0LmpzIiwidGFiLmpzIiwiZGlhZ3JhbS5qcyIsInNjcm9sbEFycm93LmpzIiwidmFsaWRhdGlvbi5qcyIsImFkbWluLmpzIiwiYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gZ29vZ2xlLm1hcHMuZXZlbnQuYWRkRG9tTGlzdGVuZXIod2luZG93LCAnbG9hZCcsIGluaXQpO1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBnb29nbGVNYXAgPSAoZnVuY3Rpb24oKSB7XG5cblx0dmFyIG1hcDtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdHZhciBtYXBPcHRpb25zID0ge1xuXHRcdFx0Y2VudGVyOiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDU5LjI5OTM3NiwgMjYuNTMwNzIzKSxcblx0XHRcdHpvb206IDQsXG5cdFx0XHR6b29tQ29udHJvbDogdHJ1ZSxcblx0XHRcdHpvb21Db250cm9sT3B0aW9uczoge1xuXHRcdFx0XHRzdHlsZTogZ29vZ2xlLm1hcHMuWm9vbUNvbnRyb2xTdHlsZS5ERUZBVUxULFxuXHRcdFx0fSxcblx0XHRcdGRpc2FibGVEb3VibGVDbGlja1pvb206IHRydWUsXG5cdFx0XHRtYXBUeXBlQ29udHJvbDogZmFsc2UsXG5cdFx0XHRzY2FsZUNvbnRyb2w6IGZhbHNlLFxuXHRcdFx0c2Nyb2xsd2hlZWw6IGZhbHNlLFxuXHRcdFx0cGFuQ29udHJvbDogZmFsc2UsXG5cdFx0XHRzdHJlZXRWaWV3Q29udHJvbDogZmFsc2UsXG5cdFx0XHRkcmFnZ2FibGU6IGZhbHNlLFxuXHRcdFx0b3ZlcnZpZXdNYXBDb250cm9sOiBmYWxzZSxcblx0XHRcdG92ZXJ2aWV3TWFwQ29udHJvbE9wdGlvbnM6IHtcblx0XHRcdFx0b3BlbmVkOiBmYWxzZSxcblx0XHRcdH0sXG5cdFx0XHRtYXBUeXBlSWQ6IGdvb2dsZS5tYXBzLk1hcFR5cGVJZC5ST0FETUFQLFxuXHRcdFx0c3R5bGVzOiBbe1xuXHRcdFx0XHRcImZlYXR1cmVUeXBlXCI6IFwiYWRtaW5pc3RyYXRpdmVcIixcblx0XHRcdFx0XCJlbGVtZW50VHlwZVwiOiBcImFsbFwiLFxuXHRcdFx0XHRcInN0eWxlcnNcIjogW3tcblx0XHRcdFx0XHRcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcblx0XHRcdFx0fV1cblx0XHRcdH0sIHtcblx0XHRcdFx0XCJmZWF0dXJlVHlwZVwiOiBcImxhbmRzY2FwZVwiLFxuXHRcdFx0XHRcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcblx0XHRcdFx0XCJzdHlsZXJzXCI6IFt7XG5cdFx0XHRcdFx0XCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcImNvbG9yXCI6IFwiI2ZjZmNmY1wiXG5cdFx0XHRcdH1dXG5cdFx0XHR9LCB7XG5cdFx0XHRcdFwiZmVhdHVyZVR5cGVcIjogXCJwb2lcIixcblx0XHRcdFx0XCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG5cdFx0XHRcdFwic3R5bGVyc1wiOiBbe1xuXHRcdFx0XHRcdFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XCJjb2xvclwiOiBcIiNmY2ZjZmNcIlxuXHRcdFx0XHR9XVxuXHRcdFx0fSwge1xuXHRcdFx0XHRcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5oaWdod2F5XCIsXG5cdFx0XHRcdFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuXHRcdFx0XHRcInN0eWxlcnNcIjogW3tcblx0XHRcdFx0XHRcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFwiY29sb3JcIjogXCIjZGRkZGRkXCJcblx0XHRcdFx0fV1cblx0XHRcdH0sIHtcblx0XHRcdFx0XCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuYXJ0ZXJpYWxcIixcblx0XHRcdFx0XCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG5cdFx0XHRcdFwic3R5bGVyc1wiOiBbe1xuXHRcdFx0XHRcdFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XCJjb2xvclwiOiBcIiNkZGRkZGRcIlxuXHRcdFx0XHR9XVxuXHRcdFx0fSwge1xuXHRcdFx0XHRcImZlYXR1cmVUeXBlXCI6IFwicm9hZC5sb2NhbFwiLFxuXHRcdFx0XHRcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcblx0XHRcdFx0XCJzdHlsZXJzXCI6IFt7XG5cdFx0XHRcdFx0XCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcImNvbG9yXCI6IFwiI2VlZWVlZVwiXG5cdFx0XHRcdH1dXG5cdFx0XHR9LCB7XG5cdFx0XHRcdFwiZmVhdHVyZVR5cGVcIjogXCJ3YXRlclwiLFxuXHRcdFx0XHRcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcblx0XHRcdFx0XCJzdHlsZXJzXCI6IFt7XG5cdFx0XHRcdFx0XCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcImNvbG9yXCI6IFwiIzAwYmZhNVwiXG5cdFx0XHRcdH1dXG5cdFx0XHR9XVxuXHRcdH07XG5cdFx0dmFyIG1hcEVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFwJyk7XG5cdFx0dmFyIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAobWFwRWxlbWVudCwgbWFwT3B0aW9ucyk7XG5cdFx0dmFyIGxvY2F0aW9ucyA9IFtcblx0XHRcdFsnT2xlZyBLb3JvbGtvJywgJ3VuZGVmaW5lZCcsICd1bmRlZmluZWQnLCAnJywgJ3VuZGVmaW5lZCcsIDU5LjkzNDI4MDIsIDMwLjMzNTA5ODYwMDAwMDAzOCwgJ2h0dHBzOi8vbWFwYnVpbGRyLmNvbS9hc3NldHMvaW1nL21hcmtlcnMvZWxsaXBzZS1yZWQucG5nJ11cblx0XHRdO1xuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbG9jYXRpb25zLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRpZiAobG9jYXRpb25zW2ldWzFdID09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHZhciBkZXNjcmlwdGlvbiA9ICcnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIGRlc2NyaXB0aW9uID0gbG9jYXRpb25zW2ldWzFdO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGxvY2F0aW9uc1tpXVsyXSA9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHR2YXIgdGVsZXBob25lID0gJyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgdGVsZXBob25lID0gbG9jYXRpb25zW2ldWzJdO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGxvY2F0aW9uc1tpXVszXSA9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHR2YXIgZW1haWwgPSAnJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciBlbWFpbCA9IGxvY2F0aW9uc1tpXVszXTtcblx0XHRcdH1cblx0XHRcdGlmIChsb2NhdGlvbnNbaV1bNF0gPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0dmFyIHdlYiA9ICcnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIHdlYiA9IGxvY2F0aW9uc1tpXVs0XTtcblx0XHRcdH1cblx0XHRcdGlmIChsb2NhdGlvbnNbaV1bN10gPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0dmFyIG1hcmtlcmljb24gPSAnJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG1hcmtlcmljb24gPSBsb2NhdGlvbnNbaV1bN107XG5cdFx0XHR9XG5cdFx0XHR2YXIgbWFya2VyID0gbmV3IGdvb2dsZS5tYXBzLk1hcmtlcih7XG5cdFx0XHRcdGljb246IG1hcmtlcmljb24sXG5cdFx0XHRcdHBvc2l0aW9uOiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKGxvY2F0aW9uc1tpXVs1XSwgbG9jYXRpb25zW2ldWzZdKSxcblx0XHRcdFx0bWFwOiBtYXAsXG5cdFx0XHRcdHRpdGxlOiBsb2NhdGlvbnNbaV1bMF0sXG5cdFx0XHRcdGRlc2M6IGRlc2NyaXB0aW9uLFxuXHRcdFx0XHR0ZWw6IHRlbGVwaG9uZSxcblx0XHRcdFx0ZW1haWw6IGVtYWlsLFxuXHRcdFx0XHR3ZWI6IHdlYlxuXHRcdFx0fSk7XG5cdFx0XHR2YXIgbGluayA9ICcnO1xuXHRcdFx0YmluZEluZm9XaW5kb3cobWFya2VyLCBtYXAsIGxvY2F0aW9uc1tpXVswXSwgZGVzY3JpcHRpb24sIHRlbGVwaG9uZSwgZW1haWwsIHdlYiwgbGluayk7XG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gYmluZEluZm9XaW5kb3cobWFya2VyLCBtYXAsIHRpdGxlLCBkZXNjLCB0ZWxlcGhvbmUsIGVtYWlsLCB3ZWIsIGxpbmspIHtcblx0XHRcdHZhciBpbmZvV2luZG93VmlzaWJsZSA9IChmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIGN1cnJlbnRseVZpc2libGUgPSBmYWxzZTtcblx0XHRcdFx0cmV0dXJuIGZ1bmN0aW9uKHZpc2libGUpIHtcblx0XHRcdFx0XHRpZiAodmlzaWJsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRcdFx0XHRjdXJyZW50bHlWaXNpYmxlID0gdmlzaWJsZTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0cmV0dXJuIGN1cnJlbnRseVZpc2libGU7XG5cdFx0XHRcdH07XG5cdFx0XHR9KCkpO1xuXHRcdFx0dmFyIGl3ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coKTtcblx0XHRcdGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKG1hcmtlciwgJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGlmIChpbmZvV2luZG93VmlzaWJsZSgpKSB7XG5cdFx0XHRcdFx0aXcuY2xvc2UoKTtcblx0XHRcdFx0XHRpbmZvV2luZG93VmlzaWJsZShmYWxzZSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFyIGh0bWwgPSBcIjxkaXYgc3R5bGU9J2NvbG9yOiMwMDA7YmFja2dyb3VuZC1jb2xvcjojZmZmO3BhZGRpbmc6NXB4O3dpZHRoOjE1MHB4Oyc+PC9kaXY+XCI7XG5cdFx0XHRcdFx0aXcgPSBuZXcgZ29vZ2xlLm1hcHMuSW5mb1dpbmRvdyh7XG5cdFx0XHRcdFx0XHRjb250ZW50OiBodG1sXG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdFx0aXcub3BlbihtYXAsIG1hcmtlcik7XG5cdFx0XHRcdFx0aW5mb1dpbmRvd1Zpc2libGUodHJ1ZSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0Z29vZ2xlLm1hcHMuZXZlbnQuYWRkTGlzdGVuZXIoaXcsICdjbG9zZWNsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGluZm9XaW5kb3dWaXNpYmxlKGZhbHNlKTtcblx0XHRcdH0pO1xuXHRcdH1cblx0fVxuXG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cblxuXHR9KCkpO1xuIiwidmFyIGJsb2dOYXYgPSAoZnVuY3Rpb24oKSB7XG5cbiAgdmFyIHNpZGVCYXIgPSAkKCcuYmxvZy1tZW51Jyk7XG4gIHZhciBzaWRlQmFyRWxlbSA9ICQoJy5ibG9nLW1lbnUtZWxlbScpO1xuICB2YXIgc2VjdGlvbiA9ICQoJy5ibG9nLWFydGljbGUnKTtcblxuICBmdW5jdGlvbiBfc2V0VXBFdmVudExpc3RlbmVycygpIHtcbiAgICAkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xuICAgICAgX3Njcm9sbGVkKClcbiAgICB9KTtcblxuICAgIHNpZGVCYXJFbGVtLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIGlkID0gJCh0aGlzKS5kYXRhKCdpZCcpO1xuICAgICAgdmFyIHRvcCA9ICQoc2VjdGlvbi5lcShpZCkpLm9mZnNldCgpLnRvcDtcblxuICAgICAgJCgnYm9keScpLmFuaW1hdGUoe1xuICAgICAgICBzY3JvbGxUb3A6IHRvcFxuICAgICAgfSwgMzAwKTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9zY3JvbGxlZCgpIHtcbiAgICB2YXIgc2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG4gICAgdmFyIG1lbnVUb3BQb3MgPSAkKHNlY3Rpb24uZXEoMCkpLm9mZnNldCgpLnRvcCAtIHNjcm9sbDtcbiAgICBpZiAobWVudVRvcFBvcyA8IDEwKSB7XG4gICAgICAkKHNpZGVCYXIpLmFkZENsYXNzKCdmaXhlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAkKHNpZGVCYXIpLnJlbW92ZUNsYXNzKCdmaXhlZCcpO1xuICAgIH1cblxuICAgIHNlY3Rpb24uZWFjaChmdW5jdGlvbiAoaW5kZXgsIGVsZW0pIHtcbiAgICAgIHZhciBlbGVtQm90dG9tID0gJChlbGVtKS5vZmZzZXQoKS50b3AgKyAkKGVsZW0pLmhlaWdodCgpO1xuICAgICAgdmFyIHdpbmRvd0JvdHRvbSA9IHNjcm9sbCArICQod2luZG93KS5oZWlnaHQoKTtcbiAgICAgIHZhciBlbGVtQm90dG9tUG9zID0gd2luZG93Qm90dG9tIC0gZWxlbUJvdHRvbSAtIDEwMDtcbiAgICAgIHZhciBlbGVtVG9wUG9zID0gJChlbGVtKS5vZmZzZXQoKS50b3AgLSBzY3JvbGw7XG5cbiAgICAgIGlmIChlbGVtVG9wUG9zIDwgMCB8fCBlbGVtQm90dG9tUG9zID4gMCkge1xuICAgICAgICBzaWRlQmFyRWxlbS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgIHNpZGVCYXJFbGVtLmVxKGluZGV4KS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgJChzaWRlQmFyRWxlbS5lcSgwKSkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIF9zZXRVcEV2ZW50TGlzdGVuZXJzKCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXQ6IGluaXRcbiAgfVxufSkoKTsiLCJ2YXIgcHJlbG9hZGVyID0gKGZ1bmN0aW9uKCkge1xuXG5cdHZhclxuXHRcdF9pbWdzID0gW10sXG5cdFx0Y29udGVudFJlYWR5ID0gJC5EZWZlcnJlZCgpO1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0X2NvdW50SW1hZ2VzKCk7XG5cdFx0X3N0YXJ0UHJlbG9hZGVyKCk7XG5cdH1cblxuXHRmdW5jdGlvbiBfY291bnRJbWFnZXMoKSB7XG5cblx0XHQkLmVhY2goJCgnKicpLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyksXG5cdFx0XHRcdGJhY2tncm91bmQgPSAkdGhpcy5jc3MoJ2JhY2tncm91bmQtaW1hZ2UnKSxcblx0XHRcdFx0aW1nID0gJHRoaXMuaXMoJ2ltZycpO1xuXG5cdFx0XHRpZiAoYmFja2dyb3VuZCAhPSAnbm9uZScpIHtcblxuXHRcdFx0XHR2YXIgcGF0aCA9IGJhY2tncm91bmQucmVwbGFjZSgndXJsKFwiJywgXCJcIikucmVwbGFjZSgnXCIpJywgXCJcIik7XG5cdFx0XHRcdHBhdGggPSBwYXRoLnJlcGxhY2UoJ3VybCgnLCBcIlwiKS5yZXBsYWNlKCcpJywgXCJcIik7XG5cblx0XHRcdFx0X2ltZ3MucHVzaChwYXRoKTtcblx0XHRcdH1cblx0XHRcdGlmIChpbWcpIHtcblx0XHRcdFx0cGF0aCA9ICcnICsgJHRoaXMuYXR0cignc3JjJyk7XG5cdFx0XHRcdGlmICgocGF0aCkgJiYgKCR0aGlzLmNzcygnZGlzcGxheScpICE9PSAnbm9uZScpKSB7XG5cdFx0XHRcdFx0X2ltZ3MucHVzaChwYXRoKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gX3N0YXJ0UHJlbG9hZGVyKCkge1xuXHRcdCQoJ2JvZHknKS5hZGRDbGFzcygnb3ZlcmZsb3ctaGlkZGVuJyk7XG5cblx0XHR2YXIgbG9hZGVkID0gMDtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgX2ltZ3MubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpbWFnZSA9ICQoJzxpbWc+Jywge1xuXHRcdFx0XHRhdHRyOiB7XG5cdFx0XHRcdFx0c3JjOiBfaW1nc1tpXVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0JChpbWFnZSkubG9hZChmdW5jdGlvbigpIHtcblx0XHRcdFx0bG9hZGVkKys7XG5cdFx0XHRcdHZhciBwZXJjZW50TG9hZGVkID0gX2NvdW50UGVyY2VudChsb2FkZWQsIF9pbWdzLmxlbmd0aCk7XG5cdFx0XHRcdF9zZXRQZXJjZW50KHBlcmNlbnRMb2FkZWQpO1xuXHRcdFx0fSk7XG5cblx0XHR9XG5cdH1cblxuXHRmdW5jdGlvbiBfY291bnRQZXJjZW50KGN1cnJlbnQsIHRvdGFsKSB7XG5cdFx0cmV0dXJuIE1hdGguY2VpbChjdXJyZW50IC8gdG90YWwgKiAxMDApO1xuXHR9XG5cblx0ZnVuY3Rpb24gX3NldFBlcmNlbnQocGVyY2VudCkge1xuXG5cdFx0JCgnLnByZWxvYWRlcl90ZXh0JykudGV4dChwZXJjZW50KTtcblxuXHRcdGlmIChwZXJjZW50ID49IDEwMCkge1xuXHRcdFx0JCgnLnByZWxvYWRlcl9jb250YWluZXInKS5kZWxheSg3MDApLmZhZGVPdXQoNTAwKTtcblx0XHRcdCQoJ2JvZHknKS5yZW1vdmVDbGFzcygnb3ZlcmZsb3ctaGlkZGVuJyk7XG5cdFx0XHRfZmluaXNoUHJlbG9hZGVyKCk7XG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gX2ZpbmlzaFByZWxvYWRlcigpIHtcblx0XHRjb250ZW50UmVhZHkucmVzb2x2ZSgpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0LFxuXHRcdGNvbnRlbnRSZWFkeTogY29udGVudFJlYWR5XG5cdH07XG5cbn0pKCk7XG4iLCJ2YXIgcGFyYWxsYXggPSAoZnVuY3Rpb24oKSB7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblxuXHRcdFx0dmFyIGxheWVyID0gJCgnLnBhcmFsbGF4JykuZmluZCgnLnBhcmFsbGF4X19sYXllcicpO1xuXG5cdFx0XHRsYXllci5tYXAoZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuXHRcdFx0XHR2YXIgYm90dG9tUG9zaXRpb24gPSAoKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpICogKGtleSAvIDEwMCkpO1xuXHRcdFx0XHQkKHZhbHVlKS5jc3Moe1xuXHRcdFx0XHRcdCdib3R0b20nOiAnLScgKyBib3R0b21Qb3NpdGlvbiArICdweCcsXG5cdFx0XHRcdFx0J3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUzZCgwcHgsIDBweCwgMCknXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cblx0XHRpZigvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcblx0XHRcdHJldHVyblxuXHRcdH1cblx0XHRcdCQod2luZG93KS5vbignbW91c2Vtb3ZlJywgZnVuY3Rpb24oZSkge1xuXHRcdFx0XHR2YXIgbW91c2VfZHggPSAoZS5wYWdlWCk7XG5cdFx0XHRcdHZhciBtb3VzZV9keSA9IChlLnBhZ2VZKTtcblxuXHRcdFx0XHR2YXIgdyA9ICh3aW5kb3cuaW5uZXJXaWR0aCAvIDIpIC0gbW91c2VfZHg7XG5cdFx0XHRcdHZhciBoID0gKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpIC0gbW91c2VfZHk7XG5cblx0XHRcdFx0bGF5ZXIubWFwKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcblx0XHRcdFx0XHR2YXIgYm90dG9tUG9zaXRpb24gPSAoKHdpbmRvdy5pbm5lckhlaWdodCAvIDIpICogKGtleSAvIDEwMCkpO1xuXHRcdFx0XHRcdHZhciB3aWR0aFBvc2l0aW9uID0gdyAqIChrZXkgLyA4MCk7XG5cdFx0XHRcdFx0dmFyIGhlaWdodFBvc2l0aW9uID0gaCAqIChrZXkgLyA4MCk7XG5cdFx0XHRcdFx0JCh2YWx1ZSkuY3NzKHtcblx0XHRcdFx0XHRcdCdib3R0b20nOiAnLScgKyBib3R0b21Qb3NpdGlvbiArICdweCcsXG5cdFx0XHRcdFx0XHQndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZTNkKCcgKyB3aWR0aFBvc2l0aW9uICsgJ3B4LCAnICsgaGVpZ2h0UG9zaXRpb24gKyAncHgsIDApJ1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cblxufSgpKTtcbiIsInZhciBmbGlwcGVyID0gKGZ1bmN0aW9uKCkge1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0c2V0VXBFdmVudExpc3RlbmVycygpO1xuXHR9XG5cblx0ZnVuY3Rpb24gc2V0VXBFdmVudExpc3RlbmVycygpIHtcblx0XHR2YXIgYXV0aEVsZW0gPSAkKCcuYXV0aG9yaXplJyk7XG5cdFx0dmFyIGZsaXBFbGVtID0gJCgnLmZsaXAnKTtcblx0XHR2YXIgb3V0c2lkZUVsZW0gPSAkKCcucGFyYWxsYXhfX2xheWVyJyk7XG5cdFx0dmFyIGJhY2sgPSAkKCcjYmFja1RvTWFpbicpO1xuXG5cblx0XHRvdXRzaWRlRWxlbS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRpZihlLnRhcmdldC5pZCAhPSAnYXV0aG9yaXplJyAmJiBlLnRhcmdldC5pZCAhPSAnYXV0aG9yaXplX2RpdicpIHtcblx0XHRcdFx0YXV0aEVsZW0uZmFkZUluKDMwMCk7XG5cdFx0XHRcdGZsaXBFbGVtLnJlbW92ZUNsYXNzKCdmbGlwcGluZycpXG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRhdXRoRWxlbS5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRhdXRoRWxlbS5mYWRlT3V0KDMwMCk7XG5cdFx0XHRmbGlwRWxlbS50b2dnbGVDbGFzcygnZmxpcHBpbmcnKVxuXHRcdH0pO1xuXG5cdFx0YmFjay5jbGljayhmdW5jdGlvbihlKSB7XG5cdFx0XHRlLnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRmbGlwRWxlbS5yZW1vdmVDbGFzcygnZmxpcHBpbmcnKTtcblx0XHRcdGF1dGhFbGVtLmZhZGVJbigzMDApO1xuXHRcdH0pXG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxufSgpKTtcbiIsInZhciBzY3JvbGwgPSAoZnVuY3Rpb24oKSB7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRpZigvQW5kcm9pZHx3ZWJPU3xpUGhvbmV8aVBhZHxpUG9kfEJsYWNrQmVycnl8SUVNb2JpbGV8T3BlcmEgTWluaS9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkpIHtcblx0XHRcdHJldHVyblxuXHRcdH1cblxuXHRcdHZhciBsYXllcnMgPSAkKCcucGFyYWxsYXgtc2Nyb2xsX19sYXllcicpO1xuXHRcdFx0dmFyIG1haW4gPSAkKCcubWFpbicpO1xuXG5cdFx0XHQkKHdpbmRvdykub24oJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHR2YXIgc2Nyb2xsVG9wID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXG5cdFx0XHRcdGxheWVycy5tYXAoZnVuY3Rpb24oa2V5LCB2YWx1ZSkge1xuXHRcdFx0XHRcdHZhciBib3R0b21Qb3NpdGlvbiA9IHNjcm9sbFRvcCAqIGtleSAvIDkwO1xuXHRcdFx0XHRcdHZhciBoZWlnaHRQb3NpdGlvbiA9IC1zY3JvbGxUb3AgKiBrZXkgLyA5MDtcblxuXHRcdFx0XHRcdCQodmFsdWUpLmNzcyh7XG5cdFx0XHRcdFx0XHQndG9wJzogJy0nICsgYm90dG9tUG9zaXRpb24gKyAncHgnLFxuXHRcdFx0XHRcdFx0J3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUzZCgwLCcgKyBoZWlnaHRQb3NpdGlvbiArICdweCwgMCknXG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fSk7XG5cblx0XHRcdFx0dmFyIHRvcFBvcyA9IHNjcm9sbFRvcCAvIDc7XG5cdFx0XHRcdHZhciBib3R0b21Qb3MgPSAtc2Nyb2xsVG9wIC8gNztcblx0XHRcdFx0bWFpbi5jc3Moe1xuXHRcdFx0XHRcdCd0b3AnOiAnLScgKyB0b3BQb3MgKyAncHgnLFxuXHRcdFx0XHRcdCd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoMCwnICsgYm90dG9tUG9zICsgJ3B4LCAwKSdcblx0XHRcdFx0fSlcblx0XHRcdH0pXG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxuXG59KCkpO1xuIiwidmFyIHNsaWRlciA9IChmdW5jdGlvbigpIHtcblxuXHQvL0FycmF5cyBvZiBpbWFnZXMgaW4gZWFjaCBzbGlkZXIgcGFydFxuXHR2YXIgbWFpbkltYWdlcyA9ICQoJy5zbGlkZXJfX21haW4taW1nX2NvbnRhaW5lcicpO1xuXHR2YXIgcHJldkltYWdlcyA9ICQoJy5uZXh0U2xpZGVJbWcnKTtcblx0dmFyIG5leHRJbWFnZXMgPSAkKCcucHJldlNsaWRlSW1nJyk7XG5cblx0Ly8gQ29udHJvbCBidXR0b25zXG5cdHZhciBuZXh0U2xpZGUgPSAkKCcuc2xpZGVyX19uZXh0Jyk7XG5cdHZhciBwcmV2U2xpZGUgPSAkKCcuc2xpZGVyX19wcmV2Jyk7XG5cdHZhciBjdXJyZW50ID0gMDtcblxuXHR2YXIgdGltZSA9IDI1MDtcblx0dmFyIGFub3RoZXJTdGF0ZTtcblxuXHR2YXIgY3VycmVudFNsaWRlID0gMDtcblx0ZnVuY3Rpb24gX3JlbmRlck1haW4oY2hhbmdlKSB7XG5cdFx0YW5vdGhlclN0YXRlID0gJC5EZWZlcnJlZCgpO1xuXG5cdFx0bWFpbkltYWdlcy5lcShjdXJyZW50U2xpZGUpLmZhZGVPdXQoMTUwKTtcblxuXHRcdGlmKGNoYW5nZSA9PT0gJ2luY3JlYXNlJykge1xuXHRcdFx0Y3VycmVudFNsaWRlKys7XG5cdFx0XHRjdXJyZW50U2xpZGUgPSBjdXJyZW50U2xpZGUgPiBtYWluSW1hZ2VzLmxlbmd0aCAtIDEgPyAwIDogY3VycmVudFNsaWRlO1xuXHRcdH0gZWxzZSBpZihjaGFuZ2UgPT09ICdkZWNyZWFzZScpIHtcblx0XHRcdGN1cnJlbnRTbGlkZS0tO1xuXHRcdFx0Y3VycmVudFNsaWRlID0gY3VycmVudFNsaWRlIDwgMCA/IG1haW5JbWFnZXMubGVuZ3RoIC0gMSA6IGN1cnJlbnRTbGlkZTtcblx0XHR9XG5cblx0XHRtYWluSW1hZ2VzLmVxKGN1cnJlbnRTbGlkZSkuZGVsYXkoMTAwKS5mYWRlSW4oMTUwLCBmdW5jdGlvbigpIHtcblx0XHRcdGFub3RoZXJTdGF0ZS5yZXNvbHZlKCk7XG5cdFx0fSk7XG5cdH1cblxuXG5cdHZhciBjdXJyZW50TmV4dCA9IDE7XG5cdGZ1bmN0aW9uIF9zbGlkZXJOZXh0QnV0dG9uTmV4dCgpIHtcblx0XHRcdG5leHRJbWFnZXMuZXEoY3VycmVudE5leHQpLmFuaW1hdGUoe1xuXHRcdFx0XHR0b3A6ICctMTAwJSdcblx0XHRcdH0sIHRpbWUgKTtcblxuXHRcdFx0Y3VycmVudE5leHQrKztcblx0XHRcdGN1cnJlbnROZXh0ID0gY3VycmVudE5leHQgPiBtYWluSW1hZ2VzLmxlbmd0aCAtIDEgPyAwIDogY3VycmVudE5leHQ7XG5cblx0XHRcdG5leHRJbWFnZXMuZXEoY3VycmVudE5leHQpLmFuaW1hdGUoe1xuXHRcdFx0XHRkaXNwbGF5OiAnbm9uZScsXG5cdFx0XHRcdHRvcDogJzEwMCUnXG5cdFx0XHR9LCAwLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0bmV4dEltYWdlcy5lcShjdXJyZW50TmV4dCkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cdFx0XHR9KTtcblxuXHRcdFx0bmV4dEltYWdlcy5lcShjdXJyZW50TmV4dCkuYW5pbWF0ZSh7XG5cdFx0XHRcdHRvcDogJzAnXG5cdFx0XHR9LCB0aW1lKTtcblx0fVxuXG5cdGZ1bmN0aW9uIF9zbGlkZXJOZXh0QnV0dG9uUHJldigpIHtcblx0XHRuZXh0SW1hZ2VzLmVxKGN1cnJlbnROZXh0KS5hbmltYXRlKHtcblx0XHRcdHRvcDogJysxMDAlJ1xuXHRcdH0sIHRpbWUgKTtcblxuXHRcdGN1cnJlbnROZXh0LS07XG5cdFx0Y3VycmVudE5leHQgPSBjdXJyZW50TmV4dCA8IDAgPyBtYWluSW1hZ2VzLmxlbmd0aCAtIDEgOiBjdXJyZW50TmV4dDtcblxuXHRcdG5leHRJbWFnZXMuZXEoY3VycmVudE5leHQpLmFuaW1hdGUoe1xuXHRcdFx0ZGlzcGxheTogJ25vbmUnLFxuXHRcdFx0dG9wOiAnLTEwMCUnXG5cdFx0fSwgMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRuZXh0SW1hZ2VzLmVxKGN1cnJlbnROZXh0KS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcblx0XHR9KTtcblxuXHRcdG5leHRJbWFnZXMuZXEoY3VycmVudE5leHQpLmFuaW1hdGUoe1xuXHRcdFx0dG9wOiAnMCdcblx0XHR9LCB0aW1lKTtcblx0fVxuXG5cblx0dmFyIGN1cnJlbnRQcmV2ID0gbWFpbkltYWdlcy5sZW5ndGggLSAxO1xuXHRmdW5jdGlvbiBfc2xpZGVyUHJldkJ1dHRvbk5leHQoKSB7XG5cdFx0cHJldkltYWdlcy5lcShjdXJyZW50UHJldikuYW5pbWF0ZSh7XG5cdFx0XHR0b3A6ICcrMTAwJSdcblx0XHR9LCB0aW1lICk7XG5cblx0XHRjdXJyZW50UHJldisrO1xuXHRcdGN1cnJlbnRQcmV2ID0gY3VycmVudFByZXYgPiBtYWluSW1hZ2VzLmxlbmd0aCAtIDEgPyAwIDogY3VycmVudFByZXY7XG5cblx0XHRwcmV2SW1hZ2VzLmVxKGN1cnJlbnRQcmV2KS5hbmltYXRlKHtcblx0XHRcdGRpc3BsYXk6ICdub25lJyxcblx0XHRcdHRvcDogJy0xMDAlJ1xuXHRcdH0sIDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0cHJldkltYWdlcy5lcShjdXJyZW50UHJldikuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cdFx0fSk7XG5cblx0XHRwcmV2SW1hZ2VzLmVxKGN1cnJlbnRQcmV2KS5hbmltYXRlKHtcblx0XHRcdHRvcDogJzAnXG5cdFx0fSwgdGltZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBfc2xpZGVyUHJldkJ1dHRvblByZXYoKSB7XG5cdFx0cHJldkltYWdlcy5lcShjdXJyZW50UHJldikuYW5pbWF0ZSh7XG5cdFx0XHR0b3A6ICctMTAwJSdcblx0XHR9LCB0aW1lICk7XG5cblx0XHRjdXJyZW50UHJldi0tO1xuXHRcdGN1cnJlbnRQcmV2ID0gY3VycmVudFByZXYgPCAwID8gbWFpbkltYWdlcy5sZW5ndGggLSAxIDogY3VycmVudFByZXY7XG5cblx0XHRwcmV2SW1hZ2VzLmVxKGN1cnJlbnRQcmV2KS5hbmltYXRlKHtcblx0XHRcdGRpc3BsYXk6ICdub25lJyxcblx0XHRcdHRvcDogJysxMDAlJ1xuXHRcdH0sIDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0cHJldkltYWdlcy5lcShjdXJyZW50UHJldikuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cdFx0fSk7XG5cblx0XHRwcmV2SW1hZ2VzLmVxKGN1cnJlbnRQcmV2KS5hbmltYXRlKHtcblx0XHRcdHRvcDogJzAnXG5cdFx0fSwgdGltZSk7XG5cdH1cblxuXG5cdG5leHRTbGlkZS5jbGljayhmdW5jdGlvbigpIHtcblx0XHQkLndoZW4oX3JlbmRlck1haW4oJ2luY3JlYXNlJyksIF9zbGlkZXJOZXh0QnV0dG9uTmV4dCgpLCBfc2xpZGVyUHJldkJ1dHRvbk5leHQoKSxhbm90aGVyU3RhdGUpLmRvbmUoZnVuY3Rpb24gKCkge1xuXHRcdFx0Y29uc29sZS5sb2coJ2luY3JlYXNlZCcpO1xuXHRcdH0pO1xuXHR9KTtcblxuXHRwcmV2U2xpZGUuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0JC53aGVuKF9yZW5kZXJNYWluKCdkZWNyZWFzZScpLCBfc2xpZGVyTmV4dEJ1dHRvblByZXYoKSwgX3NsaWRlclByZXZCdXR0b25QcmV2KCksYW5vdGhlclN0YXRlKS5kb25lKGZ1bmN0aW9uICgpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdkZWNyZWFzZWQnKTtcblx0XHR9KTtcblx0fSk7XG5cblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdG1haW5JbWFnZXMuZmFkZU91dCgzMCk7XG5cdFx0bWFpbkltYWdlcy5lcSgwKS5mYWRlSW4oMzApO1xuXG5cdFx0cHJldkltYWdlcy5lcSgobWFpbkltYWdlcy5sZW5ndGggLSAxKSkuY3NzKHtcblx0XHRcdCd0b3AnOiAnMCdcblx0XHR9KTtcblx0XHRuZXh0SW1hZ2VzLmVxKDEpLmNzcyh7XG5cdFx0XHQndG9wJzogJzAnXG5cdFx0fSk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxufSgpKTsiLCJ2YXIgc2xpZGVyVGV4dCA9IChmdW5jdGlvbigpIHtcblx0dmFyIHRpdGxlc0NvbnRhaW5lciA9ICQoJy53b3Jrc19fbGVmdF9oZWFkZXInKTtcblx0dmFyIHRpdGxlcyA9ICQoJy53b3Jrc19fbGVmdF9oZWFkZXJfaW5uZXInKTtcblx0dmFyIHRpdGxlRWxlbSA9ICQoJy53b3Jrc19fbGVmdF9oZWFkZXJfaW5uZXInKS5lcSgwKTtcblxuXHR2YXIgZGVzY3JpcHRpb25Db250YWluZXIgPSAkKCcud29ya3NfX2xlZnRfZG9uZS13aXRoJyk7XG5cdHZhciBkZXNjcmlwdGlvbiA9ICQoJy53b3Jrc19fbGVmdF9kb25lLXdpdGhfaW5uZXInKTtcblx0dmFyIGRlc2NyaXB0aW9uRWxlbSA9ICQoJy53b3Jrc19fbGVmdF9kb25lLXdpdGhfaW5uZXInKS5lcSgwKTtcblxuXHQvL2NvbnRyb2wgYnV0dG9uc1xuXHR2YXIgbmV4dEJ1dHRvbiA9ICQoJy5zbGlkZXJfX25leHQnKTtcblx0dmFyIHByZXZCdXR0b24gPSAkKCcuc2xpZGVyX19wcmV2Jyk7XG5cblx0Ly9hcnJheXMgd2l0aCB0aXRsZXMgYW5kIGRlc2NyaXB0aW9uXG5cdHZhciB0aXRsZXNBcnJheSA9IFtdO1xuXHR2YXIgZGVzY3JpcHRpb25BcnJheSA9IFtdO1xuXG5cdC8vIFNhdmVzIGFsbCB0aXRsZXMgaW50byBhcnJheVxuXHRmdW5jdGlvbiBfcHJvY2Vzc1RpdGxlcyh0aXRsZXMsIGFycmF5KSB7XG5cdFx0dGl0bGVzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXHRcdFx0dmFyIHRleHQgPSAkdGhpcy50ZXh0KCk7XG5cdFx0XHQkdGhpcy5odG1sKCcnKTtcblx0XHRcdGFycmF5LnB1c2goX3NwYW5pZnkodGV4dCkpO1xuXHRcdH0pO1xuXG5cdFx0Ly9yZW1vdmVzIGFsbCBlbGVtZW50cyBleGNlcHQgb25lIGZyb20gRE9NXG5cdFx0ZGVzY3JpcHRpb25Db250YWluZXIuZW1wdHkoKTtcblx0XHRkZXNjcmlwdGlvbkNvbnRhaW5lci5hcHBlbmQoZGVzY3JpcHRpb25FbGVtKTtcblx0XHR0aXRsZXNDb250YWluZXIuZW1wdHkoKTtcblx0XHR0aXRsZXNDb250YWluZXIuYXBwZW5kKHRpdGxlRWxlbSk7XG5cdH1cblxuXHQvLyBTYXZlcyBhbGwgZGVzY3JpcHRpb25zIGludG8gYXJyYXlcblx0ZnVuY3Rpb24gX3Byb2Nlc3NEZXNjcmlwdGlvbih0aXRsZXMsIGFycmF5KSB7XG5cdFx0dGl0bGVzLmVhY2goZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgdGV4dCA9ICQodGhpcykuaHRtbCgpO1xuXHRcdFx0YXJyYXkucHVzaCh0ZXh0KVxuXHRcdH0pXG5cdH1cblxuXHQvLyBGdW5jdGlvbiBhZGRzIHNwYW4gd2l0aCAud29yZCBjbGFzcyB0byBlYWNoIHdvcmQgYW5kIHNwYW4gd2l0aCAubGV0dGVyIGNsYXNzXG5cdC8vIHRvIGVhY2ggbGV0dGVyXG5cdGZ1bmN0aW9uIF9zcGFuaWZ5KHRleHQpIHtcblx0XHR2YXIgYXJyYXkgPSBbXTtcblx0XHR2YXIgd29yZHNBcnJheSA9IHRleHQuc3BsaXQoJyAnKTtcblx0XHR2YXIgc3Bhbm5lZFRleHQgPSAnJztcblxuXHRcdHdvcmRzQXJyYXkuZm9yRWFjaChmdW5jdGlvbih3b3JkKSB7XG5cdFx0XHR2YXIgbGV0dGVyc0FycmF5ID0gd29yZC5zcGxpdCgnJyk7XG5cdFx0XHR2YXIgc3Bhbm5lZFdvcmQgPSAnJztcblxuXHRcdFx0bGV0dGVyc0FycmF5LmZvckVhY2goZnVuY3Rpb24obGV0dGVyKSB7XG5cdFx0XHRcdHNwYW5uZWRXb3JkICs9ICc8c3BhbiBjbGFzcz1cImxldHRlclwiPicgKyBsZXR0ZXIgKyAnPC9zcGFuPic7XG5cdFx0XHR9KTtcblxuXHRcdFx0c3Bhbm5lZFRleHQgKz0gJzxzcGFuIGNsYXNzPVwid29yZFwiPicgKyBzcGFubmVkV29yZCArICc8L3NwYW4+Jztcblx0XHR9KTtcblxuXHRcdGFycmF5LnB1c2goc3Bhbm5lZFRleHQpO1xuXHRcdHJldHVybiBhcnJheVxuXHR9XG5cblx0Ly9TaG93cyBzZWxlY3RlZCB0aXRsZVxuXHRmdW5jdGlvbiBfcmVuZGVyVGl0bGUobnVtLCBhcnJheSwgZWxlbSkge1xuXHRcdGVsZW0uaHRtbChhcnJheVtudW1dKTtcblx0XHRlbGVtLmZpbmQoJy5sZXR0ZXInKS5lYWNoKGZ1bmN0aW9uKGluZGV4KSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpO1xuXG5cdFx0XHQoZnVuY3Rpb24oZWxlbSkge1xuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdGVsZW0uYWRkQ2xhc3MoJ2FjdGl2ZUxldHRlcicpXG5cdFx0XHRcdH0sIDEwICogaW5kZXgpO1xuXHRcdFx0fSkoJHRoaXMpO1xuXG5cdFx0fSlcblx0fVxuXG5cdC8vU2hvd3Mgc2VsZWN0ZWQgZGVzY3JpcHRpb25cblx0ZnVuY3Rpb24gX3JlbmRlckRlc2NyaXB0aW9uKG51bSwgYXJyYXksIGVsZW0pIHtcblx0XHRlbGVtLmh0bWwoYXJyYXlbbnVtXSlcblx0fVxuXG5cdGZ1bmN0aW9uIF9zZXRFdmVudExpc3RlbmVycygpIHtcblx0XHR2YXIgcXR5ID0gdGl0bGVzLmxlbmd0aDtcblx0XHR2YXIgY291bnRlciA9IDA7XG5cblx0XHRuZXh0QnV0dG9uLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHRcdFx0Y291bnRlcisrO1xuXHRcdFx0Y291bnRlciA9IGNvdW50ZXIgPD0gKHF0eSAtIDEpID8gY291bnRlciA6IDA7XG5cdFx0XHRfcmVuZGVyVGl0bGUoY291bnRlciwgdGl0bGVzQXJyYXksIHRpdGxlRWxlbSk7XG5cdFx0XHRfcmVuZGVyRGVzY3JpcHRpb24oY291bnRlciwgZGVzY3JpcHRpb25BcnJheSwgZGVzY3JpcHRpb25FbGVtKTtcblx0XHR9KTtcblxuXHRcdHByZXZCdXR0b24uY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0XHRjb3VudGVyLS07XG5cdFx0XHRjb3VudGVyID0gY291bnRlciA8IDAgPyAocXR5IC0gMSkgOiBjb3VudGVyO1xuXHRcdFx0X3JlbmRlclRpdGxlKGNvdW50ZXIsIHRpdGxlc0FycmF5LCB0aXRsZUVsZW0pO1xuXHRcdFx0X3JlbmRlckRlc2NyaXB0aW9uKGNvdW50ZXIsIGRlc2NyaXB0aW9uQXJyYXksIGRlc2NyaXB0aW9uRWxlbSk7XG5cdFx0fSlcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0X3Byb2Nlc3NUaXRsZXModGl0bGVzLCB0aXRsZXNBcnJheSk7XG5cdFx0X3Byb2Nlc3NEZXNjcmlwdGlvbihkZXNjcmlwdGlvbiwgZGVzY3JpcHRpb25BcnJheSk7XG5cdFx0X3JlbmRlclRpdGxlKDAsIHRpdGxlc0FycmF5LCB0aXRsZUVsZW0pO1xuXHRcdF9yZW5kZXJEZXNjcmlwdGlvbigwLCBkZXNjcmlwdGlvbkFycmF5LCBkZXNjcmlwdGlvbkVsZW0pO1xuXHRcdF9zZXRFdmVudExpc3RlbmVycygpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cblxufSgpKTtcbiIsInZhciB0YWIgPSAoZnVuY3Rpb24oKSB7XG5cblx0dmFyIHRhYnMgPSAkKCcudGFic19fbGlzdC1pdGVtJyk7XG5cdHZhciB0YWJzTGluayA9ICQoJy50YWJzX19jb250cm9sLWl0ZW0nKTtcblxuXHRmdW5jdGlvbiBfc2V0dXBFdmVudExpc3RlbmVycygpIHtcblx0XHR0YWJzLmVxKDApLmFkZENsYXNzKCdhY3RpdmVUYWInKTtcblx0XHR0YWJzTGluay5lcSgwKS5hZGRDbGFzcygnYWN0aXZlVGFiTGluaycpO1xuXG5cdFx0dGFic0xpbmsub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgYWN0aXZlID0gJCh0aGlzKS5kYXRhKCdjbGFzcycpO1xuXHRcdFx0dGFicy5yZW1vdmVDbGFzcygnYWN0aXZlVGFiJyk7XG5cdFx0XHR0YWJzTGluay5yZW1vdmVDbGFzcygnYWN0aXZlVGFiTGluaycpO1xuXHRcdFx0dGFicy5lcShhY3RpdmUpLmFkZENsYXNzKCdhY3RpdmVUYWInKTtcblx0XHRcdHRhYnNMaW5rLmVxKGFjdGl2ZSkuYWRkQ2xhc3MoJ2FjdGl2ZVRhYkxpbmsnKTtcblx0XHR9KVxuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRfc2V0dXBFdmVudExpc3RlbmVycygpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cbn0oKSk7XG4iLCJ2YXIgZGlhZ3JhbSA9IChmdW5jdGlvbigpIHtcblxuXHR2YXIgZWxlbSA9ICQoJy5za2lsbHNfX2VsZW1zJykuZXEoMCk7XG5cdHZhciBkaWFncmFtQXJyYXkgPSAkKCcuc2VjdG9yJyk7XG5cdHZhciBkaWFncmFtVmFsdWVzO1xuXG5cdGZ1bmN0aW9uIF9zZXRFdmVudExpc3RlbmVycygpIHtcblx0XHQkKHdpbmRvdykuc2Nyb2xsKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHRvcEVkZ2UgPSAkKGVsZW0pLm9mZnNldCgpLnRvcDtcblx0XHRcdHZhciBzY3JvbGwgPSAkKHdpbmRvdykuc2Nyb2xsVG9wKCk7XG5cdFx0XHR2YXIgaGVpZ2h0ID0gJCh3aW5kb3cpLmlubmVySGVpZ2h0KCk7XG5cdFx0XHR2YXIgYW5pbWF0aW9uU3RhcnQgPSBoZWlnaHQgKyBzY3JvbGwgLSBoZWlnaHQgLyA1O1xuXHRcdFx0aWYgKGFuaW1hdGlvblN0YXJ0ID4gdG9wRWRnZSkge1xuXHRcdFx0XHRfYW5pbWF0ZSgpO1xuXHRcdFx0fVxuXHRcdH0pXG5cdH1cblxuXHRmdW5jdGlvbiBfYW5pbWF0ZSgpIHtcblx0XHR2YXIgbWF4VmFsID0gMjgwO1xuXHRcdGRpYWdyYW1BcnJheS5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHRcdHZhciBkYXRhSWQgPSAkdGhpcy5kYXRhKCdkaWFncmFtJyk7XG5cdFx0XHR2YXIgZWxlbVZhbHVlID0gZGlhZ3JhbVZhbHVlc1tkYXRhSWRdO1xuXHRcdFx0dmFyIGRhc2ggPSAoZWxlbVZhbHVlIC8gMTAwKSAqIG1heFZhbDtcblx0XHRcdCR0aGlzLmNzcyh7XG5cdFx0XHRcdCdzdHJva2UtZGFzaGFycmF5JzogZGFzaCArICcgJyArIG1heFZhbFxuXHRcdFx0fSlcblxuXHRcdH0pXG5cdH1cblxuXHRmdW5jdGlvbiBfZ2V0VmFsdWVzKCkge1xuXHRcdCQuZ2V0KCcvZ2V0ZGlhZ3JhbScsIGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdGRpYWdyYW1WYWx1ZXMgPSBkYXRhWzBdO1xuXHRcdH0pO1xuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRfZ2V0VmFsdWVzKCk7XG5cdFx0X3NldEV2ZW50TGlzdGVuZXJzKCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxufSgpKTtcbiIsInZhciBzY3JvbGxBcnJvdyA9IChmdW5jdGlvbigpIHtcblxuXHRmdW5jdGlvbiBfc2V0RXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0JCgnLmFycm93LWRvd24taWNvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGhlaWdodCA9ICQod2luZG93KS5pbm5lckhlaWdodCgpO1xuXHRcdFx0JCgnaHRtbCwgYm9keScpLmFuaW1hdGUoe1xuXHRcdFx0XHRzY3JvbGxUb3A6IGhlaWdodFxuXHRcdFx0fSwgODAwKTtcblx0XHR9KVxuXHR9XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRfc2V0RXZlbnRMaXN0ZW5lcnMoKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG5cbn0oKSk7XG4iLCJ2YXIgdmFsaWRhdGlvbiA9IChmdW5jdGlvbigpIHtcblxuICB2YXIgbW9kYWxDb250YWluZXJSb2JvdCA9ICQoJyNpbmRleC1tb2RhbC1jb250YWluZXItcm9ib3RzJyk7XG4gIHZhciBtb2RhbENvbnRhaW5lckZpZWxkID0gJCgnI2luZGV4LW1vZGFsLWNvbnRhaW5lci1maWVsZCcpO1xuICB2YXIgYWxsTW9kYWxzID0gJCgnLmluZGV4LW1vZGFsLWNvbnRhaW5lcicpO1xuICB2YXIgYWN0aXZlTW9kYWwgPSAnaW5kZXgtbW9kYWwtYWN0aXZlJztcbiAgdmFyIGlzSHVtYW4gPSAkKCcjaXNIdW1hbicpO1xuICB2YXIgbm90Um9ib3QgPSAkKCcjcmFkaW8xJyk7XG4gIHZhciBsb2dpbiA9ICQoJyNpbmRleF9sb2dpbicpO1xuICB2YXIgcGFzcyA9ICQoJyNpbmRleF9wYXNzJyk7XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBfc2V0VXBFdmVudExpc3RlbmVycygpO1xuICB9XG5cbiAgZnVuY3Rpb24gX3NldFVwRXZlbnRMaXN0ZW5lcnMoKSB7XG5cbiAgICAkKCcjYXV0aG9yaXplJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBpZighaXNIdW1hbi5wcm9wKCdjaGVja2VkJykgfHwgIW5vdFJvYm90LnByb3AoJ2NoZWNrZWQnKSkge1xuICAgICAgICBfc2hvd01vZGFsKG1vZGFsQ29udGFpbmVyUm9ib3QpO1xuICAgICAgfSBlbHNlIGlmIChsb2dpbi52YWwoKSA9PT0gJycgfHwgcGFzcy52YWwoKSA9PT0gJycpIHtcbiAgICAgICAgX3Nob3dNb2RhbChtb2RhbENvbnRhaW5lckZpZWxkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGZvcm0gPSAkKCcuYXV0aF9mb3JtJyk7XG4gICAgICAgICAgdmFyIGRlZk9iaiA9IF9hamF4Rm9ybShmb3JtLCAnLi9sb2dpbicpO1xuICAgICAgICAgIGlmIChkZWZPYmopIHtcbiAgICAgICAgICAgIGRlZk9iai5kb25lKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICB2YXIgc3RhdHVzID0gcmVzLnN0YXR1cztcbiAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gJ09LJyl7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL2FkbWluJztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkZWZPYmouZmFpbChmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKHJlcylcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKCcuaW5kZXgtbW9kYWwtYmxvY2stYnV0dG9uJykuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgX2hpZGVNb2RhbChhbGxNb2RhbHMpO1xuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBfc2hvd01vZGFsKGVsZW1lbnQpIHtcbiAgICBlbGVtZW50LmFkZENsYXNzKGFjdGl2ZU1vZGFsKTtcbiAgfVxuICBmdW5jdGlvbiBfaGlkZU1vZGFsKGVsZW1lbnQpIHtcbiAgICBlbGVtZW50LnJlbW92ZUNsYXNzKGFjdGl2ZU1vZGFsKVxuICB9XG4gIGZ1bmN0aW9uIF9hamF4Rm9ybShmb3JtLCB1cmwpe1xuICAgIHZhciBkYXRhID0gZm9ybS5zZXJpYWxpemUoKTtcbiAgICB2YXIgZGVmT2JqID0gJC5hamF4KHtcbiAgICAgIHR5cGUgOiBcIlBPU1RcIixcbiAgICAgIHVybCA6IHVybCxcbiAgICAgIGRhdGE6IGRhdGFcbiAgICB9KTtcblxuICAgIHJldHVybiBkZWZPYmo7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXQ6IGluaXRcbiAgfVxuXG59KCkpOyIsInZhciBhZG1pbiA9IChmdW5jdGlvbigpIHtcblxuICB2YXIgbW9kYWwgPSAkKCcubW9kYWwtY29udGFpbmVyJyk7XG4gIHZhciBva0J1dHRvbiA9ICQoJy5tb2RhbE9rJyk7XG4gIHZhciBiYWNrVG9NYWluID0gJCgnLmFkbWluX2hlYWRlcl9yZXR1cm4nKTtcbiAgdmFyIHNhdmVEaWFncmFtID0gJCgnI3NhdmVEaWFncmFtJyk7XG5cbiAgZnVuY3Rpb24gX3Nob3dNb2RhbChyZXN1bHQpIHtcbiAgICBpZiAocmVzdWx0ID09PSAnc3VjY2VzcycpIHtcbiAgICAgIG1vZGFsLmVxKDApLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtb2RhbC5lcSgxKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBfbG9nT3V0KCkge1xuICAgIGRlZk9iaiA9ICQuYWpheCh7XG4gICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgIHVybDogJy4vbG9nb3V0J1xuICAgIH0pLmZhaWwoZnVuY3Rpb24gKCkge1xuICAgICAgY29uc29sZS5sb2coJ2Vycm9yJyk7XG4gICAgfSkuY29tcGxldGUoZnVuY3Rpb24gKCkge1xuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnLyc7XG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIF9hZGROZXdXb3JrKCkge1xuICAgIHZhciBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgkKCcjdXBsb2FkRm9ybScpWzBdKTtcblxuICAgICQuYWpheCh7XG4gICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgIHByb2Nlc3NEYXRhOiBmYWxzZSxcbiAgICAgIGNvbnRlbnRUeXBlOiBmYWxzZSxcbiAgICAgIHVybDogXCIuL3VwbG9hZFwiLFxuICAgICAgZGF0YTogIGZvcm1EYXRhXG4gICAgfSlcbiAgICAgIC5kb25lKGZ1bmN0aW9uKCkge1xuICAgICAgICBfc2hvd01vZGFsKCdzdWNjZXNzJylcbiAgICAgIH0pLmZhaWwoZnVuY3Rpb24oKSB7XG4gICAgICBfc2hvd01vZGFsKCdmYWlsJylcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gX3Bvc3REaWFncmFtVmFsdWVzKCkge1xuICAgIHZhciBlbGVtZW50cyA9ICQoJy50YWJzX19saXN0X2Jsb2NrLWVsZW0nKTtcbiAgICB2YXIgdGV4dCA9ICQoJy50YWJzX19saXN0LXRleHQnKTtcbiAgICB2YXIgdmFsdWUgPSAkKCcudGFic19fbGlzdC1pbnB1dCcpO1xuICAgIHZhciBkaWFncmFtVmFsdWVzID0ge307XG5cbiAgICBlbGVtZW50cy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBuYW1lID0gJCh0aGlzKS5maW5kKHRleHQpLnRleHQoKS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoJy4nLCAnJyk7XG4gICAgICBkaWFncmFtVmFsdWVzW25hbWVdID0gJCh0aGlzKS5maW5kKHZhbHVlKS52YWwoKTtcbiAgICB9KTtcblxuICAgICQucG9zdChcIi9kaWFncmFtXCIsIGRpYWdyYW1WYWx1ZXMpLmRvbmUoZnVuY3Rpb24gKCkge1xuICAgICAgX3Nob3dNb2RhbCgnc3VjY2VzcycpXG4gICAgfSkuZmFpbChmdW5jdGlvbiAoKSB7XG4gICAgICBfc2hvd01vZGFsKCdmYWlsJylcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gX3NldHVwRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgb2tCdXR0b24uY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgbW9kYWwuY3NzKCdkaXNwbGF5JywgJ25vbmUnKVxuICAgIH0pO1xuXG4gICAgYmFja1RvTWFpbi5jbGljayhfbG9nT3V0KTtcbiAgICBzYXZlRGlhZ3JhbS5jbGljayhfcG9zdERpYWdyYW1WYWx1ZXMpO1xuXG4gICAgJCgnI3VwbG9hZEZvcm0nKS5vbignc3VibWl0JywgZnVuY3Rpb24oZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgX2FkZE5ld1dvcmsoKTtcbiAgICB9KTtcblxuICAgICQoJyNibG9nUG9zdCcpLm9uKCdzdWJtaXQnLCBmdW5jdGlvbihlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB2YXIgZGF0YSA9ICQodGhpcykuc2VyaWFsaXplKCk7XG5cbiAgICAgICQucG9zdChcIi4vYWRkYmxvZ3Bvc3RcIiwgZGF0YSkuZG9uZShmdW5jdGlvbigpIHtcbiAgICAgICAgX3Nob3dNb2RhbCgnc3VjY2VzcycpXG4gICAgICAgICQoJyNibG9nUG9zdCcpWzBdLnJlc2V0KCk7XG4gICAgICB9KS5mYWlsKGZ1bmN0aW9uKCkge1xuICAgICAgICBfc2hvd01vZGFsKCdmYWlsJylcbiAgICAgIH0pO1xuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgIF9zZXR1cEV2ZW50TGlzdGVuZXJzKCk7XG4gIH1cblxuICByZXR1cm4ge1xuICAgIGluaXQ6IGluaXRcbiAgfVxufSgpKTtcbiIsImZ1bmN0aW9uIG5hdmlnYXRpb24oKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0JCgnI25hdi1pY29uJykuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0JCh0aGlzKS50b2dnbGVDbGFzcygnb3BlbicpO1xuXHRcdCQoJyNvdmVybGF5JykudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcblx0fSk7XG59O1xuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcblxuXHR2YXIgcGF0aCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcblxuXHRwcmVsb2FkZXIuaW5pdCgpO1xuXHRuYXZpZ2F0aW9uKCk7XG5cblx0aWYgKHBhdGggPT09ICcvJyB8fCBwYXRoID09PSAnL2luZGV4Lmh0bWwnKSB7XG5cdFx0cGFyYWxsYXguaW5pdCgpO1xuXHRcdGZsaXBwZXIuaW5pdCgpO1xuXHRcdHZhbGlkYXRpb24uaW5pdCgpO1xuXHR9IGVsc2Uge1xuXHRcdHNjcm9sbC5pbml0KCk7XG5cdH1cblxuXHRpZiAocGF0aCA9PT0gJy9ibG9nLmh0bWwnIHx8IHBhdGggPT09ICcvYmxvZycpIHtcblx0XHRibG9nTmF2LmluaXQoKTtcblx0fVxuXG5cdGlmIChwYXRoID09PSAnL3dvcmtzLmh0bWwnIHx8IHBhdGggPT09ICcvd29ya3MnKSB7XG5cdFx0c2xpZGVyLmluaXQoKTtcblx0XHRzbGlkZXJUZXh0LmluaXQoKTtcblx0fVxuXG5cdGlmIChwYXRoID09PSAnL2Fib3V0bWUuaHRtbCcgfHwgcGF0aCA9PT0gJy9hYm91dG1lJykge1xuXHRcdGdvb2dsZU1hcC5pbml0KCk7XG5cdFx0ZGlhZ3JhbS5pbml0KCk7XG5cdH1cblxuXHRpZiAocGF0aCA9PT0gJy9hZG1pbi5odG1sJyB8fCBwYXRoID09PSAnL2FkbWluJykge1xuXHRcdHRhYi5pbml0KCk7XG5cdH1cblxuXHRpZiAocGF0aCAhPT0gJ2FkbWluJykge1xuXHRcdHNjcm9sbEFycm93LmluaXQoKTtcblx0XHRhZG1pbi5pbml0KCk7XG5cdH1cblxufSk7XG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
