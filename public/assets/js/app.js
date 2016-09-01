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

		$('.arrow-down-icon').on('click', function(e) {
			e.preventDefault();
			var height = $(window).innerHeight();
			$('body').animate({
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdvb2dsZU1hcC5qcyIsImJsb2dOYXYuanMiLCJwcmVsb2FkZXIuanMiLCJwYXJhbGxheC5qcyIsImZsaXBwZXIuanMiLCJzY3JvbGwuanMiLCJzbGlkZXIuanMiLCJzbGlkZXJUZXh0LmpzIiwidGFiLmpzIiwiZGlhZ3JhbS5qcyIsInNjcm9sbEFycm93LmpzIiwidmFsaWRhdGlvbi5qcyIsImFkbWluLmpzIiwiYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGdvb2dsZS5tYXBzLmV2ZW50LmFkZERvbUxpc3RlbmVyKHdpbmRvdywgJ2xvYWQnLCBpbml0KTtcblwidXNlIHN0cmljdFwiO1xuXG52YXIgZ29vZ2xlTWFwID0gKGZ1bmN0aW9uKCkge1xuXG5cdHZhciBtYXA7XG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHR2YXIgbWFwT3B0aW9ucyA9IHtcblx0XHRcdGNlbnRlcjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZyg1OS4yOTkzNzYsIDI2LjUzMDcyMyksXG5cdFx0XHR6b29tOiA0LFxuXHRcdFx0em9vbUNvbnRyb2w6IHRydWUsXG5cdFx0XHR6b29tQ29udHJvbE9wdGlvbnM6IHtcblx0XHRcdFx0c3R5bGU6IGdvb2dsZS5tYXBzLlpvb21Db250cm9sU3R5bGUuREVGQVVMVCxcblx0XHRcdH0sXG5cdFx0XHRkaXNhYmxlRG91YmxlQ2xpY2tab29tOiB0cnVlLFxuXHRcdFx0bWFwVHlwZUNvbnRyb2w6IGZhbHNlLFxuXHRcdFx0c2NhbGVDb250cm9sOiBmYWxzZSxcblx0XHRcdHNjcm9sbHdoZWVsOiBmYWxzZSxcblx0XHRcdHBhbkNvbnRyb2w6IGZhbHNlLFxuXHRcdFx0c3RyZWV0Vmlld0NvbnRyb2w6IGZhbHNlLFxuXHRcdFx0ZHJhZ2dhYmxlOiBmYWxzZSxcblx0XHRcdG92ZXJ2aWV3TWFwQ29udHJvbDogZmFsc2UsXG5cdFx0XHRvdmVydmlld01hcENvbnRyb2xPcHRpb25zOiB7XG5cdFx0XHRcdG9wZW5lZDogZmFsc2UsXG5cdFx0XHR9LFxuXHRcdFx0bWFwVHlwZUlkOiBnb29nbGUubWFwcy5NYXBUeXBlSWQuUk9BRE1BUCxcblx0XHRcdHN0eWxlczogW3tcblx0XHRcdFx0XCJmZWF0dXJlVHlwZVwiOiBcImFkbWluaXN0cmF0aXZlXCIsXG5cdFx0XHRcdFwiZWxlbWVudFR5cGVcIjogXCJhbGxcIixcblx0XHRcdFx0XCJzdHlsZXJzXCI6IFt7XG5cdFx0XHRcdFx0XCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG5cdFx0XHRcdH1dXG5cdFx0XHR9LCB7XG5cdFx0XHRcdFwiZmVhdHVyZVR5cGVcIjogXCJsYW5kc2NhcGVcIixcblx0XHRcdFx0XCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG5cdFx0XHRcdFwic3R5bGVyc1wiOiBbe1xuXHRcdFx0XHRcdFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XCJjb2xvclwiOiBcIiNmY2ZjZmNcIlxuXHRcdFx0XHR9XVxuXHRcdFx0fSwge1xuXHRcdFx0XHRcImZlYXR1cmVUeXBlXCI6IFwicG9pXCIsXG5cdFx0XHRcdFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuXHRcdFx0XHRcInN0eWxlcnNcIjogW3tcblx0XHRcdFx0XHRcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFwiY29sb3JcIjogXCIjZmNmY2ZjXCJcblx0XHRcdFx0fV1cblx0XHRcdH0sIHtcblx0XHRcdFx0XCJmZWF0dXJlVHlwZVwiOiBcInJvYWQuaGlnaHdheVwiLFxuXHRcdFx0XHRcImVsZW1lbnRUeXBlXCI6IFwiZ2VvbWV0cnlcIixcblx0XHRcdFx0XCJzdHlsZXJzXCI6IFt7XG5cdFx0XHRcdFx0XCJ2aXNpYmlsaXR5XCI6IFwic2ltcGxpZmllZFwiXG5cdFx0XHRcdH0sIHtcblx0XHRcdFx0XHRcImNvbG9yXCI6IFwiI2RkZGRkZFwiXG5cdFx0XHRcdH1dXG5cdFx0XHR9LCB7XG5cdFx0XHRcdFwiZmVhdHVyZVR5cGVcIjogXCJyb2FkLmFydGVyaWFsXCIsXG5cdFx0XHRcdFwiZWxlbWVudFR5cGVcIjogXCJnZW9tZXRyeVwiLFxuXHRcdFx0XHRcInN0eWxlcnNcIjogW3tcblx0XHRcdFx0XHRcInZpc2liaWxpdHlcIjogXCJzaW1wbGlmaWVkXCJcblx0XHRcdFx0fSwge1xuXHRcdFx0XHRcdFwiY29sb3JcIjogXCIjZGRkZGRkXCJcblx0XHRcdFx0fV1cblx0XHRcdH0sIHtcblx0XHRcdFx0XCJmZWF0dXJlVHlwZVwiOiBcInJvYWQubG9jYWxcIixcblx0XHRcdFx0XCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG5cdFx0XHRcdFwic3R5bGVyc1wiOiBbe1xuXHRcdFx0XHRcdFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XCJjb2xvclwiOiBcIiNlZWVlZWVcIlxuXHRcdFx0XHR9XVxuXHRcdFx0fSwge1xuXHRcdFx0XHRcImZlYXR1cmVUeXBlXCI6IFwid2F0ZXJcIixcblx0XHRcdFx0XCJlbGVtZW50VHlwZVwiOiBcImdlb21ldHJ5XCIsXG5cdFx0XHRcdFwic3R5bGVyc1wiOiBbe1xuXHRcdFx0XHRcdFwidmlzaWJpbGl0eVwiOiBcInNpbXBsaWZpZWRcIlxuXHRcdFx0XHR9LCB7XG5cdFx0XHRcdFx0XCJjb2xvclwiOiBcIiMwMGJmYTVcIlxuXHRcdFx0XHR9XVxuXHRcdFx0fV1cblx0XHR9O1xuXHRcdHZhciBtYXBFbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21hcCcpO1xuXHRcdHZhciBtYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKG1hcEVsZW1lbnQsIG1hcE9wdGlvbnMpO1xuXHRcdHZhciBsb2NhdGlvbnMgPSBbXG5cdFx0XHRbJ09sZWcgS29yb2xrbycsICd1bmRlZmluZWQnLCAndW5kZWZpbmVkJywgJycsICd1bmRlZmluZWQnLCA1OS45MzQyODAyLCAzMC4zMzUwOTg2MDAwMDAwMzgsICdodHRwczovL21hcGJ1aWxkci5jb20vYXNzZXRzL2ltZy9tYXJrZXJzL2VsbGlwc2UtcmVkLnBuZyddXG5cdFx0XTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxvY2F0aW9ucy5sZW5ndGg7IGkrKykge1xuXHRcdFx0aWYgKGxvY2F0aW9uc1tpXVsxXSA9PSAndW5kZWZpbmVkJykge1xuXHRcdFx0XHR2YXIgZGVzY3JpcHRpb24gPSAnJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciBkZXNjcmlwdGlvbiA9IGxvY2F0aW9uc1tpXVsxXTtcblx0XHRcdH1cblx0XHRcdGlmIChsb2NhdGlvbnNbaV1bMl0gPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0dmFyIHRlbGVwaG9uZSA9ICcnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIHRlbGVwaG9uZSA9IGxvY2F0aW9uc1tpXVsyXTtcblx0XHRcdH1cblx0XHRcdGlmIChsb2NhdGlvbnNbaV1bM10gPT0gJ3VuZGVmaW5lZCcpIHtcblx0XHRcdFx0dmFyIGVtYWlsID0gJyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgZW1haWwgPSBsb2NhdGlvbnNbaV1bM107XG5cdFx0XHR9XG5cdFx0XHRpZiAobG9jYXRpb25zW2ldWzRdID09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHZhciB3ZWIgPSAnJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciB3ZWIgPSBsb2NhdGlvbnNbaV1bNF07XG5cdFx0XHR9XG5cdFx0XHRpZiAobG9jYXRpb25zW2ldWzddID09ICd1bmRlZmluZWQnKSB7XG5cdFx0XHRcdHZhciBtYXJrZXJpY29uID0gJyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRtYXJrZXJpY29uID0gbG9jYXRpb25zW2ldWzddO1xuXHRcdFx0fVxuXHRcdFx0dmFyIG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuXHRcdFx0XHRpY29uOiBtYXJrZXJpY29uLFxuXHRcdFx0XHRwb3NpdGlvbjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZyhsb2NhdGlvbnNbaV1bNV0sIGxvY2F0aW9uc1tpXVs2XSksXG5cdFx0XHRcdG1hcDogbWFwLFxuXHRcdFx0XHR0aXRsZTogbG9jYXRpb25zW2ldWzBdLFxuXHRcdFx0XHRkZXNjOiBkZXNjcmlwdGlvbixcblx0XHRcdFx0dGVsOiB0ZWxlcGhvbmUsXG5cdFx0XHRcdGVtYWlsOiBlbWFpbCxcblx0XHRcdFx0d2ViOiB3ZWJcblx0XHRcdH0pO1xuXHRcdFx0dmFyIGxpbmsgPSAnJztcblx0XHRcdGJpbmRJbmZvV2luZG93KG1hcmtlciwgbWFwLCBsb2NhdGlvbnNbaV1bMF0sIGRlc2NyaXB0aW9uLCB0ZWxlcGhvbmUsIGVtYWlsLCB3ZWIsIGxpbmspO1xuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIGJpbmRJbmZvV2luZG93KG1hcmtlciwgbWFwLCB0aXRsZSwgZGVzYywgdGVsZXBob25lLCBlbWFpbCwgd2ViLCBsaW5rKSB7XG5cdFx0XHR2YXIgaW5mb1dpbmRvd1Zpc2libGUgPSAoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdHZhciBjdXJyZW50bHlWaXNpYmxlID0gZmFsc2U7XG5cdFx0XHRcdHJldHVybiBmdW5jdGlvbih2aXNpYmxlKSB7XG5cdFx0XHRcdFx0aWYgKHZpc2libGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0Y3VycmVudGx5VmlzaWJsZSA9IHZpc2libGU7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybiBjdXJyZW50bHlWaXNpYmxlO1xuXHRcdFx0XHR9O1xuXHRcdFx0fSgpKTtcblx0XHRcdHZhciBpdyA9IG5ldyBnb29nbGUubWFwcy5JbmZvV2luZG93KCk7XG5cdFx0XHRnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpZiAoaW5mb1dpbmRvd1Zpc2libGUoKSkge1xuXHRcdFx0XHRcdGl3LmNsb3NlKCk7XG5cdFx0XHRcdFx0aW5mb1dpbmRvd1Zpc2libGUoZmFsc2UpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhciBodG1sID0gXCI8ZGl2IHN0eWxlPSdjb2xvcjojMDAwO2JhY2tncm91bmQtY29sb3I6I2ZmZjtwYWRkaW5nOjVweDt3aWR0aDoxNTBweDsnPjwvZGl2PlwiO1xuXHRcdFx0XHRcdGl3ID0gbmV3IGdvb2dsZS5tYXBzLkluZm9XaW5kb3coe1xuXHRcdFx0XHRcdFx0Y29udGVudDogaHRtbFxuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdGl3Lm9wZW4obWFwLCBtYXJrZXIpO1xuXHRcdFx0XHRcdGluZm9XaW5kb3dWaXNpYmxlKHRydWUpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdGdvb2dsZS5tYXBzLmV2ZW50LmFkZExpc3RlbmVyKGl3LCAnY2xvc2VjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRpbmZvV2luZG93VmlzaWJsZShmYWxzZSk7XG5cdFx0XHR9KTtcblx0XHR9XG5cdH1cblxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG5cblx0fSgpKTtcbiIsInZhciBibG9nTmF2ID0gKGZ1bmN0aW9uKCkge1xuXG4gIHZhciBzaWRlQmFyID0gJCgnLmJsb2ctbWVudScpO1xuICB2YXIgc2lkZUJhckVsZW0gPSAkKCcuYmxvZy1tZW51LWVsZW0nKTtcbiAgdmFyIHNlY3Rpb24gPSAkKCcuYmxvZy1hcnRpY2xlJyk7XG5cbiAgZnVuY3Rpb24gX3NldFVwRXZlbnRMaXN0ZW5lcnMoKSB7XG4gICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcbiAgICAgIF9zY3JvbGxlZCgpXG4gICAgfSk7XG5cbiAgICBzaWRlQmFyRWxlbS5vbignY2xpY2snLCBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBpZCA9ICQodGhpcykuZGF0YSgnaWQnKTtcbiAgICAgIHZhciB0b3AgPSAkKHNlY3Rpb24uZXEoaWQpKS5vZmZzZXQoKS50b3A7XG5cbiAgICAgICQoJ2JvZHknKS5hbmltYXRlKHtcbiAgICAgICAgc2Nyb2xsVG9wOiB0b3BcbiAgICAgIH0sIDMwMCk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBfc2Nyb2xsZWQoKSB7XG4gICAgdmFyIHNjcm9sbCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblxuICAgIHZhciBtZW51VG9wUG9zID0gJChzZWN0aW9uLmVxKDApKS5vZmZzZXQoKS50b3AgLSBzY3JvbGw7XG4gICAgaWYgKG1lbnVUb3BQb3MgPCAxMCkge1xuICAgICAgJChzaWRlQmFyKS5hZGRDbGFzcygnZml4ZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgJChzaWRlQmFyKS5yZW1vdmVDbGFzcygnZml4ZWQnKTtcbiAgICB9XG5cbiAgICBzZWN0aW9uLmVhY2goZnVuY3Rpb24gKGluZGV4LCBlbGVtKSB7XG4gICAgICB2YXIgZWxlbUJvdHRvbSA9ICQoZWxlbSkub2Zmc2V0KCkudG9wICsgJChlbGVtKS5oZWlnaHQoKTtcbiAgICAgIHZhciB3aW5kb3dCb3R0b20gPSBzY3JvbGwgKyAkKHdpbmRvdykuaGVpZ2h0KCk7XG4gICAgICB2YXIgZWxlbUJvdHRvbVBvcyA9IHdpbmRvd0JvdHRvbSAtIGVsZW1Cb3R0b20gLSAxMDA7XG4gICAgICB2YXIgZWxlbVRvcFBvcyA9ICQoZWxlbSkub2Zmc2V0KCkudG9wIC0gc2Nyb2xsO1xuXG4gICAgICBpZiAoZWxlbVRvcFBvcyA8IDAgfHwgZWxlbUJvdHRvbVBvcyA+IDApIHtcbiAgICAgICAgc2lkZUJhckVsZW0ucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICBzaWRlQmFyRWxlbS5lcShpbmRleCkuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBpbml0KCkge1xuICAgICQoc2lkZUJhckVsZW0uZXEoMCkpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICBfc2V0VXBFdmVudExpc3RlbmVycygpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0XG4gIH1cbn0pKCk7IiwidmFyIHByZWxvYWRlciA9IChmdW5jdGlvbigpIHtcblxuXHR2YXJcblx0XHRfaW1ncyA9IFtdLFxuXHRcdGNvbnRlbnRSZWFkeSA9ICQuRGVmZXJyZWQoKTtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdF9jb3VudEltYWdlcygpO1xuXHRcdF9zdGFydFByZWxvYWRlcigpO1xuXHR9XG5cblx0ZnVuY3Rpb24gX2NvdW50SW1hZ2VzKCkge1xuXG5cdFx0JC5lYWNoKCQoJyonKSwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgJHRoaXMgPSAkKHRoaXMpLFxuXHRcdFx0XHRiYWNrZ3JvdW5kID0gJHRoaXMuY3NzKCdiYWNrZ3JvdW5kLWltYWdlJyksXG5cdFx0XHRcdGltZyA9ICR0aGlzLmlzKCdpbWcnKTtcblxuXHRcdFx0aWYgKGJhY2tncm91bmQgIT0gJ25vbmUnKSB7XG5cblx0XHRcdFx0dmFyIHBhdGggPSBiYWNrZ3JvdW5kLnJlcGxhY2UoJ3VybChcIicsIFwiXCIpLnJlcGxhY2UoJ1wiKScsIFwiXCIpO1xuXHRcdFx0XHRwYXRoID0gcGF0aC5yZXBsYWNlKCd1cmwoJywgXCJcIikucmVwbGFjZSgnKScsIFwiXCIpO1xuXG5cdFx0XHRcdF9pbWdzLnB1c2gocGF0aCk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaW1nKSB7XG5cdFx0XHRcdHBhdGggPSAnJyArICR0aGlzLmF0dHIoJ3NyYycpO1xuXHRcdFx0XHRpZiAoKHBhdGgpICYmICgkdGhpcy5jc3MoJ2Rpc3BsYXknKSAhPT0gJ25vbmUnKSkge1xuXHRcdFx0XHRcdF9pbWdzLnB1c2gocGF0aCk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIF9zdGFydFByZWxvYWRlcigpIHtcblx0XHQkKCdib2R5JykuYWRkQ2xhc3MoJ292ZXJmbG93LWhpZGRlbicpO1xuXG5cdFx0dmFyIGxvYWRlZCA9IDA7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IF9pbWdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaW1hZ2UgPSAkKCc8aW1nPicsIHtcblx0XHRcdFx0YXR0cjoge1xuXHRcdFx0XHRcdHNyYzogX2ltZ3NbaV1cblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdCQoaW1hZ2UpLmxvYWQoZnVuY3Rpb24oKSB7XG5cdFx0XHRcdGxvYWRlZCsrO1xuXHRcdFx0XHR2YXIgcGVyY2VudExvYWRlZCA9IF9jb3VudFBlcmNlbnQobG9hZGVkLCBfaW1ncy5sZW5ndGgpO1xuXHRcdFx0XHRfc2V0UGVyY2VudChwZXJjZW50TG9hZGVkKTtcblx0XHRcdH0pO1xuXG5cdFx0fVxuXHR9XG5cblx0ZnVuY3Rpb24gX2NvdW50UGVyY2VudChjdXJyZW50LCB0b3RhbCkge1xuXHRcdHJldHVybiBNYXRoLmNlaWwoY3VycmVudCAvIHRvdGFsICogMTAwKTtcblx0fVxuXG5cdGZ1bmN0aW9uIF9zZXRQZXJjZW50KHBlcmNlbnQpIHtcblxuXHRcdCQoJy5wcmVsb2FkZXJfdGV4dCcpLnRleHQocGVyY2VudCk7XG5cblx0XHRpZiAocGVyY2VudCA+PSAxMDApIHtcblx0XHRcdCQoJy5wcmVsb2FkZXJfY29udGFpbmVyJykuZGVsYXkoNzAwKS5mYWRlT3V0KDUwMCk7XG5cdFx0XHQkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ292ZXJmbG93LWhpZGRlbicpO1xuXHRcdFx0X2ZpbmlzaFByZWxvYWRlcigpO1xuXHRcdH1cblx0fVxuXG5cdGZ1bmN0aW9uIF9maW5pc2hQcmVsb2FkZXIoKSB7XG5cdFx0Y29udGVudFJlYWR5LnJlc29sdmUoKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdCxcblx0XHRjb250ZW50UmVhZHk6IGNvbnRlbnRSZWFkeVxuXHR9O1xuXG59KSgpO1xuIiwidmFyIHBhcmFsbGF4ID0gKGZ1bmN0aW9uKCkge1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cblx0XHRcdHZhciBsYXllciA9ICQoJy5wYXJhbGxheCcpLmZpbmQoJy5wYXJhbGxheF9fbGF5ZXInKTtcblxuXHRcdFx0bGF5ZXIubWFwKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcblx0XHRcdFx0dmFyIGJvdHRvbVBvc2l0aW9uID0gKCh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAqIChrZXkgLyAxMDApKTtcblx0XHRcdFx0JCh2YWx1ZSkuY3NzKHtcblx0XHRcdFx0XHQnYm90dG9tJzogJy0nICsgYm90dG9tUG9zaXRpb24gKyAncHgnLFxuXHRcdFx0XHRcdCd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoMHB4LCAwcHgsIDApJ1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXG5cdFx0aWYoL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG5cdFx0XHRyZXR1cm5cblx0XHR9XG5cdFx0XHQkKHdpbmRvdykub24oJ21vdXNlbW92ZScsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0dmFyIG1vdXNlX2R4ID0gKGUucGFnZVgpO1xuXHRcdFx0XHR2YXIgbW91c2VfZHkgPSAoZS5wYWdlWSk7XG5cblx0XHRcdFx0dmFyIHcgPSAod2luZG93LmlubmVyV2lkdGggLyAyKSAtIG1vdXNlX2R4O1xuXHRcdFx0XHR2YXIgaCA9ICh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAtIG1vdXNlX2R5O1xuXG5cdFx0XHRcdGxheWVyLm1hcChmdW5jdGlvbihrZXksIHZhbHVlKSB7XG5cdFx0XHRcdFx0dmFyIGJvdHRvbVBvc2l0aW9uID0gKCh3aW5kb3cuaW5uZXJIZWlnaHQgLyAyKSAqIChrZXkgLyAxMDApKTtcblx0XHRcdFx0XHR2YXIgd2lkdGhQb3NpdGlvbiA9IHcgKiAoa2V5IC8gODApO1xuXHRcdFx0XHRcdHZhciBoZWlnaHRQb3NpdGlvbiA9IGggKiAoa2V5IC8gODApO1xuXHRcdFx0XHRcdCQodmFsdWUpLmNzcyh7XG5cdFx0XHRcdFx0XHQnYm90dG9tJzogJy0nICsgYm90dG9tUG9zaXRpb24gKyAncHgnLFxuXHRcdFx0XHRcdFx0J3RyYW5zZm9ybSc6ICd0cmFuc2xhdGUzZCgnICsgd2lkdGhQb3NpdGlvbiArICdweCwgJyArIGhlaWdodFBvc2l0aW9uICsgJ3B4LCAwKSdcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG5cbn0oKSk7XG4iLCJ2YXIgZmxpcHBlciA9IChmdW5jdGlvbigpIHtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdHNldFVwRXZlbnRMaXN0ZW5lcnMoKTtcblx0fVxuXG5cdGZ1bmN0aW9uIHNldFVwRXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0dmFyIGF1dGhFbGVtID0gJCgnLmF1dGhvcml6ZScpO1xuXHRcdHZhciBmbGlwRWxlbSA9ICQoJy5mbGlwJyk7XG5cdFx0dmFyIG91dHNpZGVFbGVtID0gJCgnLnBhcmFsbGF4X19sYXllcicpO1xuXHRcdHZhciBiYWNrID0gJCgnI2JhY2tUb01haW4nKTtcblxuXG5cdFx0b3V0c2lkZUVsZW0uY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0aWYoZS50YXJnZXQuaWQgIT0gJ2F1dGhvcml6ZScgJiYgZS50YXJnZXQuaWQgIT0gJ2F1dGhvcml6ZV9kaXYnKSB7XG5cdFx0XHRcdGF1dGhFbGVtLmZhZGVJbigzMDApO1xuXHRcdFx0XHRmbGlwRWxlbS5yZW1vdmVDbGFzcygnZmxpcHBpbmcnKVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0YXV0aEVsZW0uY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0YXV0aEVsZW0uZmFkZU91dCgzMDApO1xuXHRcdFx0ZmxpcEVsZW0udG9nZ2xlQ2xhc3MoJ2ZsaXBwaW5nJylcblx0XHR9KTtcblxuXHRcdGJhY2suY2xpY2soZnVuY3Rpb24oZSkge1xuXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0ZmxpcEVsZW0ucmVtb3ZlQ2xhc3MoJ2ZsaXBwaW5nJyk7XG5cdFx0XHRhdXRoRWxlbS5mYWRlSW4oMzAwKTtcblx0XHR9KVxuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cbn0oKSk7XG4iLCJ2YXIgc2Nyb2xsID0gKGZ1bmN0aW9uKCkge1xuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0aWYoL0FuZHJvaWR8d2ViT1N8aVBob25lfGlQYWR8aVBvZHxCbGFja0JlcnJ5fElFTW9iaWxlfE9wZXJhIE1pbmkvaS50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpKSB7XG5cdFx0XHRyZXR1cm5cblx0XHR9XG5cblx0XHR2YXIgbGF5ZXJzID0gJCgnLnBhcmFsbGF4LXNjcm9sbF9fbGF5ZXInKTtcblx0XHRcdHZhciBtYWluID0gJCgnLm1haW4nKTtcblxuXHRcdFx0JCh3aW5kb3cpLm9uKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcblx0XHRcdFx0dmFyIHNjcm9sbFRvcCA9ICQod2luZG93KS5zY3JvbGxUb3AoKTtcblxuXHRcdFx0XHRsYXllcnMubWFwKGZ1bmN0aW9uKGtleSwgdmFsdWUpIHtcblx0XHRcdFx0XHR2YXIgYm90dG9tUG9zaXRpb24gPSBzY3JvbGxUb3AgKiBrZXkgLyA5MDtcblx0XHRcdFx0XHR2YXIgaGVpZ2h0UG9zaXRpb24gPSAtc2Nyb2xsVG9wICoga2V5IC8gOTA7XG5cblx0XHRcdFx0XHQkKHZhbHVlKS5jc3Moe1xuXHRcdFx0XHRcdFx0J3RvcCc6ICctJyArIGJvdHRvbVBvc2l0aW9uICsgJ3B4Jyxcblx0XHRcdFx0XHRcdCd0cmFuc2Zvcm0nOiAndHJhbnNsYXRlM2QoMCwnICsgaGVpZ2h0UG9zaXRpb24gKyAncHgsIDApJ1xuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHRcdHZhciB0b3BQb3MgPSBzY3JvbGxUb3AgLyA3O1xuXHRcdFx0XHR2YXIgYm90dG9tUG9zID0gLXNjcm9sbFRvcCAvIDc7XG5cdFx0XHRcdG1haW4uY3NzKHtcblx0XHRcdFx0XHQndG9wJzogJy0nICsgdG9wUG9zICsgJ3B4Jyxcblx0XHRcdFx0XHQndHJhbnNmb3JtJzogJ3RyYW5zbGF0ZTNkKDAsJyArIGJvdHRvbVBvcyArICdweCwgMCknXG5cdFx0XHRcdH0pXG5cdFx0XHR9KVxuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cblxufSgpKTtcbiIsInZhciBzbGlkZXIgPSAoZnVuY3Rpb24oKSB7XG5cblx0Ly9BcnJheXMgb2YgaW1hZ2VzIGluIGVhY2ggc2xpZGVyIHBhcnRcblx0dmFyIG1haW5JbWFnZXMgPSAkKCcuc2xpZGVyX19tYWluLWltZ19jb250YWluZXInKTtcblx0dmFyIHByZXZJbWFnZXMgPSAkKCcubmV4dFNsaWRlSW1nJyk7XG5cdHZhciBuZXh0SW1hZ2VzID0gJCgnLnByZXZTbGlkZUltZycpO1xuXG5cdC8vIENvbnRyb2wgYnV0dG9uc1xuXHR2YXIgbmV4dFNsaWRlID0gJCgnLnNsaWRlcl9fbmV4dCcpO1xuXHR2YXIgcHJldlNsaWRlID0gJCgnLnNsaWRlcl9fcHJldicpO1xuXHR2YXIgY3VycmVudCA9IDA7XG5cblx0dmFyIHRpbWUgPSAyNTA7XG5cdHZhciBhbm90aGVyU3RhdGU7XG5cblx0dmFyIGN1cnJlbnRTbGlkZSA9IDA7XG5cdGZ1bmN0aW9uIF9yZW5kZXJNYWluKGNoYW5nZSkge1xuXHRcdGFub3RoZXJTdGF0ZSA9ICQuRGVmZXJyZWQoKTtcblxuXHRcdG1haW5JbWFnZXMuZXEoY3VycmVudFNsaWRlKS5mYWRlT3V0KDE1MCk7XG5cblx0XHRpZihjaGFuZ2UgPT09ICdpbmNyZWFzZScpIHtcblx0XHRcdGN1cnJlbnRTbGlkZSsrO1xuXHRcdFx0Y3VycmVudFNsaWRlID0gY3VycmVudFNsaWRlID4gbWFpbkltYWdlcy5sZW5ndGggLSAxID8gMCA6IGN1cnJlbnRTbGlkZTtcblx0XHR9IGVsc2UgaWYoY2hhbmdlID09PSAnZGVjcmVhc2UnKSB7XG5cdFx0XHRjdXJyZW50U2xpZGUtLTtcblx0XHRcdGN1cnJlbnRTbGlkZSA9IGN1cnJlbnRTbGlkZSA8IDAgPyBtYWluSW1hZ2VzLmxlbmd0aCAtIDEgOiBjdXJyZW50U2xpZGU7XG5cdFx0fVxuXG5cdFx0bWFpbkltYWdlcy5lcShjdXJyZW50U2xpZGUpLmRlbGF5KDEwMCkuZmFkZUluKDE1MCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRhbm90aGVyU3RhdGUucmVzb2x2ZSgpO1xuXHRcdH0pO1xuXHR9XG5cblxuXHR2YXIgY3VycmVudE5leHQgPSAxO1xuXHRmdW5jdGlvbiBfc2xpZGVyTmV4dEJ1dHRvbk5leHQoKSB7XG5cdFx0XHRuZXh0SW1hZ2VzLmVxKGN1cnJlbnROZXh0KS5hbmltYXRlKHtcblx0XHRcdFx0dG9wOiAnLTEwMCUnXG5cdFx0XHR9LCB0aW1lICk7XG5cblx0XHRcdGN1cnJlbnROZXh0Kys7XG5cdFx0XHRjdXJyZW50TmV4dCA9IGN1cnJlbnROZXh0ID4gbWFpbkltYWdlcy5sZW5ndGggLSAxID8gMCA6IGN1cnJlbnROZXh0O1xuXG5cdFx0XHRuZXh0SW1hZ2VzLmVxKGN1cnJlbnROZXh0KS5hbmltYXRlKHtcblx0XHRcdFx0ZGlzcGxheTogJ25vbmUnLFxuXHRcdFx0XHR0b3A6ICcxMDAlJ1xuXHRcdFx0fSwgMCwgZnVuY3Rpb24oKSB7XG5cdFx0XHRcdG5leHRJbWFnZXMuZXEoY3VycmVudE5leHQpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXHRcdFx0fSk7XG5cblx0XHRcdG5leHRJbWFnZXMuZXEoY3VycmVudE5leHQpLmFuaW1hdGUoe1xuXHRcdFx0XHR0b3A6ICcwJ1xuXHRcdFx0fSwgdGltZSk7XG5cdH1cblxuXHRmdW5jdGlvbiBfc2xpZGVyTmV4dEJ1dHRvblByZXYoKSB7XG5cdFx0bmV4dEltYWdlcy5lcShjdXJyZW50TmV4dCkuYW5pbWF0ZSh7XG5cdFx0XHR0b3A6ICcrMTAwJSdcblx0XHR9LCB0aW1lICk7XG5cblx0XHRjdXJyZW50TmV4dC0tO1xuXHRcdGN1cnJlbnROZXh0ID0gY3VycmVudE5leHQgPCAwID8gbWFpbkltYWdlcy5sZW5ndGggLSAxIDogY3VycmVudE5leHQ7XG5cblx0XHRuZXh0SW1hZ2VzLmVxKGN1cnJlbnROZXh0KS5hbmltYXRlKHtcblx0XHRcdGRpc3BsYXk6ICdub25lJyxcblx0XHRcdHRvcDogJy0xMDAlJ1xuXHRcdH0sIDAsIGZ1bmN0aW9uKCkge1xuXHRcdFx0bmV4dEltYWdlcy5lcShjdXJyZW50TmV4dCkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cdFx0fSk7XG5cblx0XHRuZXh0SW1hZ2VzLmVxKGN1cnJlbnROZXh0KS5hbmltYXRlKHtcblx0XHRcdHRvcDogJzAnXG5cdFx0fSwgdGltZSk7XG5cdH1cblxuXG5cdHZhciBjdXJyZW50UHJldiA9IG1haW5JbWFnZXMubGVuZ3RoIC0gMTtcblx0ZnVuY3Rpb24gX3NsaWRlclByZXZCdXR0b25OZXh0KCkge1xuXHRcdHByZXZJbWFnZXMuZXEoY3VycmVudFByZXYpLmFuaW1hdGUoe1xuXHRcdFx0dG9wOiAnKzEwMCUnXG5cdFx0fSwgdGltZSApO1xuXG5cdFx0Y3VycmVudFByZXYrKztcblx0XHRjdXJyZW50UHJldiA9IGN1cnJlbnRQcmV2ID4gbWFpbkltYWdlcy5sZW5ndGggLSAxID8gMCA6IGN1cnJlbnRQcmV2O1xuXG5cdFx0cHJldkltYWdlcy5lcShjdXJyZW50UHJldikuYW5pbWF0ZSh7XG5cdFx0XHRkaXNwbGF5OiAnbm9uZScsXG5cdFx0XHR0b3A6ICctMTAwJSdcblx0XHR9LCAwLCBmdW5jdGlvbigpIHtcblx0XHRcdHByZXZJbWFnZXMuZXEoY3VycmVudFByZXYpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXHRcdH0pO1xuXG5cdFx0cHJldkltYWdlcy5lcShjdXJyZW50UHJldikuYW5pbWF0ZSh7XG5cdFx0XHR0b3A6ICcwJ1xuXHRcdH0sIHRpbWUpO1xuXHR9XG5cblx0ZnVuY3Rpb24gX3NsaWRlclByZXZCdXR0b25QcmV2KCkge1xuXHRcdHByZXZJbWFnZXMuZXEoY3VycmVudFByZXYpLmFuaW1hdGUoe1xuXHRcdFx0dG9wOiAnLTEwMCUnXG5cdFx0fSwgdGltZSApO1xuXG5cdFx0Y3VycmVudFByZXYtLTtcblx0XHRjdXJyZW50UHJldiA9IGN1cnJlbnRQcmV2IDwgMCA/IG1haW5JbWFnZXMubGVuZ3RoIC0gMSA6IGN1cnJlbnRQcmV2O1xuXG5cdFx0cHJldkltYWdlcy5lcShjdXJyZW50UHJldikuYW5pbWF0ZSh7XG5cdFx0XHRkaXNwbGF5OiAnbm9uZScsXG5cdFx0XHR0b3A6ICcrMTAwJSdcblx0XHR9LCAwLCBmdW5jdGlvbigpIHtcblx0XHRcdHByZXZJbWFnZXMuZXEoY3VycmVudFByZXYpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuXHRcdH0pO1xuXG5cdFx0cHJldkltYWdlcy5lcShjdXJyZW50UHJldikuYW5pbWF0ZSh7XG5cdFx0XHR0b3A6ICcwJ1xuXHRcdH0sIHRpbWUpO1xuXHR9XG5cblxuXHRuZXh0U2xpZGUuY2xpY2soZnVuY3Rpb24oKSB7XG5cdFx0JC53aGVuKF9yZW5kZXJNYWluKCdpbmNyZWFzZScpLCBfc2xpZGVyTmV4dEJ1dHRvbk5leHQoKSwgX3NsaWRlclByZXZCdXR0b25OZXh0KCksYW5vdGhlclN0YXRlKS5kb25lKGZ1bmN0aW9uICgpIHtcblx0XHRcdGNvbnNvbGUubG9nKCdpbmNyZWFzZWQnKTtcblx0XHR9KTtcblx0fSk7XG5cblx0cHJldlNsaWRlLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHRcdCQud2hlbihfcmVuZGVyTWFpbignZGVjcmVhc2UnKSwgX3NsaWRlck5leHRCdXR0b25QcmV2KCksIF9zbGlkZXJQcmV2QnV0dG9uUHJldigpLGFub3RoZXJTdGF0ZSkuZG9uZShmdW5jdGlvbiAoKSB7XG5cdFx0XHRjb25zb2xlLmxvZygnZGVjcmVhc2VkJyk7XG5cdFx0fSk7XG5cdH0pO1xuXG5cblx0ZnVuY3Rpb24gaW5pdCgpIHtcblx0XHRtYWluSW1hZ2VzLmZhZGVPdXQoMzApO1xuXHRcdG1haW5JbWFnZXMuZXEoMCkuZmFkZUluKDMwKTtcblxuXHRcdHByZXZJbWFnZXMuZXEoKG1haW5JbWFnZXMubGVuZ3RoIC0gMSkpLmNzcyh7XG5cdFx0XHQndG9wJzogJzAnXG5cdFx0fSk7XG5cdFx0bmV4dEltYWdlcy5lcSgxKS5jc3Moe1xuXHRcdFx0J3RvcCc6ICcwJ1xuXHRcdH0pO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cbn0oKSk7IiwidmFyIHNsaWRlclRleHQgPSAoZnVuY3Rpb24oKSB7XG5cdHZhciB0aXRsZXNDb250YWluZXIgPSAkKCcud29ya3NfX2xlZnRfaGVhZGVyJyk7XG5cdHZhciB0aXRsZXMgPSAkKCcud29ya3NfX2xlZnRfaGVhZGVyX2lubmVyJyk7XG5cdHZhciB0aXRsZUVsZW0gPSAkKCcud29ya3NfX2xlZnRfaGVhZGVyX2lubmVyJykuZXEoMCk7XG5cblx0dmFyIGRlc2NyaXB0aW9uQ29udGFpbmVyID0gJCgnLndvcmtzX19sZWZ0X2RvbmUtd2l0aCcpO1xuXHR2YXIgZGVzY3JpcHRpb24gPSAkKCcud29ya3NfX2xlZnRfZG9uZS13aXRoX2lubmVyJyk7XG5cdHZhciBkZXNjcmlwdGlvbkVsZW0gPSAkKCcud29ya3NfX2xlZnRfZG9uZS13aXRoX2lubmVyJykuZXEoMCk7XG5cblx0Ly9jb250cm9sIGJ1dHRvbnNcblx0dmFyIG5leHRCdXR0b24gPSAkKCcuc2xpZGVyX19uZXh0Jyk7XG5cdHZhciBwcmV2QnV0dG9uID0gJCgnLnNsaWRlcl9fcHJldicpO1xuXG5cdC8vYXJyYXlzIHdpdGggdGl0bGVzIGFuZCBkZXNjcmlwdGlvblxuXHR2YXIgdGl0bGVzQXJyYXkgPSBbXTtcblx0dmFyIGRlc2NyaXB0aW9uQXJyYXkgPSBbXTtcblxuXHQvLyBTYXZlcyBhbGwgdGl0bGVzIGludG8gYXJyYXlcblx0ZnVuY3Rpb24gX3Byb2Nlc3NUaXRsZXModGl0bGVzLCBhcnJheSkge1xuXHRcdHRpdGxlcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblx0XHRcdHZhciB0ZXh0ID0gJHRoaXMudGV4dCgpO1xuXHRcdFx0JHRoaXMuaHRtbCgnJyk7XG5cdFx0XHRhcnJheS5wdXNoKF9zcGFuaWZ5KHRleHQpKTtcblx0XHR9KTtcblxuXHRcdC8vcmVtb3ZlcyBhbGwgZWxlbWVudHMgZXhjZXB0IG9uZSBmcm9tIERPTVxuXHRcdGRlc2NyaXB0aW9uQ29udGFpbmVyLmVtcHR5KCk7XG5cdFx0ZGVzY3JpcHRpb25Db250YWluZXIuYXBwZW5kKGRlc2NyaXB0aW9uRWxlbSk7XG5cdFx0dGl0bGVzQ29udGFpbmVyLmVtcHR5KCk7XG5cdFx0dGl0bGVzQ29udGFpbmVyLmFwcGVuZCh0aXRsZUVsZW0pO1xuXHR9XG5cblx0Ly8gU2F2ZXMgYWxsIGRlc2NyaXB0aW9ucyBpbnRvIGFycmF5XG5cdGZ1bmN0aW9uIF9wcm9jZXNzRGVzY3JpcHRpb24odGl0bGVzLCBhcnJheSkge1xuXHRcdHRpdGxlcy5lYWNoKGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIHRleHQgPSAkKHRoaXMpLmh0bWwoKTtcblx0XHRcdGFycmF5LnB1c2godGV4dClcblx0XHR9KVxuXHR9XG5cblx0Ly8gRnVuY3Rpb24gYWRkcyBzcGFuIHdpdGggLndvcmQgY2xhc3MgdG8gZWFjaCB3b3JkIGFuZCBzcGFuIHdpdGggLmxldHRlciBjbGFzc1xuXHQvLyB0byBlYWNoIGxldHRlclxuXHRmdW5jdGlvbiBfc3BhbmlmeSh0ZXh0KSB7XG5cdFx0dmFyIGFycmF5ID0gW107XG5cdFx0dmFyIHdvcmRzQXJyYXkgPSB0ZXh0LnNwbGl0KCcgJyk7XG5cdFx0dmFyIHNwYW5uZWRUZXh0ID0gJyc7XG5cblx0XHR3b3Jkc0FycmF5LmZvckVhY2goZnVuY3Rpb24od29yZCkge1xuXHRcdFx0dmFyIGxldHRlcnNBcnJheSA9IHdvcmQuc3BsaXQoJycpO1xuXHRcdFx0dmFyIHNwYW5uZWRXb3JkID0gJyc7XG5cblx0XHRcdGxldHRlcnNBcnJheS5mb3JFYWNoKGZ1bmN0aW9uKGxldHRlcikge1xuXHRcdFx0XHRzcGFubmVkV29yZCArPSAnPHNwYW4gY2xhc3M9XCJsZXR0ZXJcIj4nICsgbGV0dGVyICsgJzwvc3Bhbj4nO1xuXHRcdFx0fSk7XG5cblx0XHRcdHNwYW5uZWRUZXh0ICs9ICc8c3BhbiBjbGFzcz1cIndvcmRcIj4nICsgc3Bhbm5lZFdvcmQgKyAnPC9zcGFuPic7XG5cdFx0fSk7XG5cblx0XHRhcnJheS5wdXNoKHNwYW5uZWRUZXh0KTtcblx0XHRyZXR1cm4gYXJyYXlcblx0fVxuXG5cdC8vU2hvd3Mgc2VsZWN0ZWQgdGl0bGVcblx0ZnVuY3Rpb24gX3JlbmRlclRpdGxlKG51bSwgYXJyYXksIGVsZW0pIHtcblx0XHRlbGVtLmh0bWwoYXJyYXlbbnVtXSk7XG5cdFx0ZWxlbS5maW5kKCcubGV0dGVyJykuZWFjaChmdW5jdGlvbihpbmRleCkge1xuXHRcdFx0dmFyICR0aGlzID0gJCh0aGlzKTtcblxuXHRcdFx0KGZ1bmN0aW9uKGVsZW0pIHtcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpIHtcblx0XHRcdFx0XHRlbGVtLmFkZENsYXNzKCdhY3RpdmVMZXR0ZXInKVxuXHRcdFx0XHR9LCAxMCAqIGluZGV4KTtcblx0XHRcdH0pKCR0aGlzKTtcblxuXHRcdH0pXG5cdH1cblxuXHQvL1Nob3dzIHNlbGVjdGVkIGRlc2NyaXB0aW9uXG5cdGZ1bmN0aW9uIF9yZW5kZXJEZXNjcmlwdGlvbihudW0sIGFycmF5LCBlbGVtKSB7XG5cdFx0ZWxlbS5odG1sKGFycmF5W251bV0pXG5cdH1cblxuXHRmdW5jdGlvbiBfc2V0RXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0dmFyIHF0eSA9IHRpdGxlcy5sZW5ndGg7XG5cdFx0dmFyIGNvdW50ZXIgPSAwO1xuXG5cdFx0bmV4dEJ1dHRvbi5jbGljayhmdW5jdGlvbigpIHtcblx0XHRcdGNvdW50ZXIrKztcblx0XHRcdGNvdW50ZXIgPSBjb3VudGVyIDw9IChxdHkgLSAxKSA/IGNvdW50ZXIgOiAwO1xuXHRcdFx0X3JlbmRlclRpdGxlKGNvdW50ZXIsIHRpdGxlc0FycmF5LCB0aXRsZUVsZW0pO1xuXHRcdFx0X3JlbmRlckRlc2NyaXB0aW9uKGNvdW50ZXIsIGRlc2NyaXB0aW9uQXJyYXksIGRlc2NyaXB0aW9uRWxlbSk7XG5cdFx0fSk7XG5cblx0XHRwcmV2QnV0dG9uLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHRcdFx0Y291bnRlci0tO1xuXHRcdFx0Y291bnRlciA9IGNvdW50ZXIgPCAwID8gKHF0eSAtIDEpIDogY291bnRlcjtcblx0XHRcdF9yZW5kZXJUaXRsZShjb3VudGVyLCB0aXRsZXNBcnJheSwgdGl0bGVFbGVtKTtcblx0XHRcdF9yZW5kZXJEZXNjcmlwdGlvbihjb3VudGVyLCBkZXNjcmlwdGlvbkFycmF5LCBkZXNjcmlwdGlvbkVsZW0pO1xuXHRcdH0pXG5cdH1cblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdF9wcm9jZXNzVGl0bGVzKHRpdGxlcywgdGl0bGVzQXJyYXkpO1xuXHRcdF9wcm9jZXNzRGVzY3JpcHRpb24oZGVzY3JpcHRpb24sIGRlc2NyaXB0aW9uQXJyYXkpO1xuXHRcdF9yZW5kZXJUaXRsZSgwLCB0aXRsZXNBcnJheSwgdGl0bGVFbGVtKTtcblx0XHRfcmVuZGVyRGVzY3JpcHRpb24oMCwgZGVzY3JpcHRpb25BcnJheSwgZGVzY3JpcHRpb25FbGVtKTtcblx0XHRfc2V0RXZlbnRMaXN0ZW5lcnMoKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG5cbn0oKSk7XG4iLCJ2YXIgdGFiID0gKGZ1bmN0aW9uKCkge1xuXG5cdHZhciB0YWJzID0gJCgnLnRhYnNfX2xpc3QtaXRlbScpO1xuXHR2YXIgdGFic0xpbmsgPSAkKCcudGFic19fY29udHJvbC1pdGVtJyk7XG5cblx0ZnVuY3Rpb24gX3NldHVwRXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0dGFicy5lcSgwKS5hZGRDbGFzcygnYWN0aXZlVGFiJyk7XG5cdFx0dGFic0xpbmsuZXEoMCkuYWRkQ2xhc3MoJ2FjdGl2ZVRhYkxpbmsnKTtcblxuXHRcdHRhYnNMaW5rLm9uKCdjbGljaycsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGFjdGl2ZSA9ICQodGhpcykuZGF0YSgnY2xhc3MnKTtcblx0XHRcdHRhYnMucmVtb3ZlQ2xhc3MoJ2FjdGl2ZVRhYicpO1xuXHRcdFx0dGFic0xpbmsucmVtb3ZlQ2xhc3MoJ2FjdGl2ZVRhYkxpbmsnKTtcblx0XHRcdHRhYnMuZXEoYWN0aXZlKS5hZGRDbGFzcygnYWN0aXZlVGFiJyk7XG5cdFx0XHR0YWJzTGluay5lcShhY3RpdmUpLmFkZENsYXNzKCdhY3RpdmVUYWJMaW5rJyk7XG5cdFx0fSlcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0X3NldHVwRXZlbnRMaXN0ZW5lcnMoKTtcblx0fVxuXG5cdHJldHVybiB7XG5cdFx0aW5pdDogaW5pdFxuXHR9XG59KCkpO1xuIiwidmFyIGRpYWdyYW0gPSAoZnVuY3Rpb24oKSB7XG5cblx0dmFyIGVsZW0gPSAkKCcuc2tpbGxzX19lbGVtcycpLmVxKDApO1xuXHR2YXIgZGlhZ3JhbUFycmF5ID0gJCgnLnNlY3RvcicpO1xuXHR2YXIgZGlhZ3JhbVZhbHVlcztcblxuXHRmdW5jdGlvbiBfc2V0RXZlbnRMaXN0ZW5lcnMoKSB7XG5cdFx0JCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbigpIHtcblx0XHRcdHZhciB0b3BFZGdlID0gJChlbGVtKS5vZmZzZXQoKS50b3A7XG5cdFx0XHR2YXIgc2Nyb2xsID0gJCh3aW5kb3cpLnNjcm9sbFRvcCgpO1xuXHRcdFx0dmFyIGhlaWdodCA9ICQod2luZG93KS5pbm5lckhlaWdodCgpO1xuXHRcdFx0dmFyIGFuaW1hdGlvblN0YXJ0ID0gaGVpZ2h0ICsgc2Nyb2xsIC0gaGVpZ2h0IC8gNTtcblx0XHRcdGlmIChhbmltYXRpb25TdGFydCA+IHRvcEVkZ2UpIHtcblx0XHRcdFx0X2FuaW1hdGUoKTtcblx0XHRcdH1cblx0XHR9KVxuXHR9XG5cblx0ZnVuY3Rpb24gX2FuaW1hdGUoKSB7XG5cdFx0dmFyIG1heFZhbCA9IDI4MDtcblx0XHRkaWFncmFtQXJyYXkuZWFjaChmdW5jdGlvbigpIHtcblx0XHRcdHZhciAkdGhpcyA9ICQodGhpcyk7XG5cdFx0XHR2YXIgZGF0YUlkID0gJHRoaXMuZGF0YSgnZGlhZ3JhbScpO1xuXHRcdFx0dmFyIGVsZW1WYWx1ZSA9IGRpYWdyYW1WYWx1ZXNbZGF0YUlkXTtcblx0XHRcdHZhciBkYXNoID0gKGVsZW1WYWx1ZSAvIDEwMCkgKiBtYXhWYWw7XG5cdFx0XHQkdGhpcy5jc3Moe1xuXHRcdFx0XHQnc3Ryb2tlLWRhc2hhcnJheSc6IGRhc2ggKyAnICcgKyBtYXhWYWxcblx0XHRcdH0pXG5cblx0XHR9KVxuXHR9XG5cblx0ZnVuY3Rpb24gX2dldFZhbHVlcygpIHtcblx0XHQkLmdldCgnL2dldGRpYWdyYW0nLCBmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRkaWFncmFtVmFsdWVzID0gZGF0YVswXTtcblx0XHR9KTtcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0X2dldFZhbHVlcygpO1xuXHRcdF9zZXRFdmVudExpc3RlbmVycygpO1xuXHR9XG5cblx0cmV0dXJuIHtcblx0XHRpbml0OiBpbml0XG5cdH1cbn0oKSk7XG4iLCJ2YXIgc2Nyb2xsQXJyb3cgPSAoZnVuY3Rpb24oKSB7XG5cblx0ZnVuY3Rpb24gX3NldEV2ZW50TGlzdGVuZXJzKCkge1xuXG5cdFx0JCgnLmFycm93LWRvd24taWNvbicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcblx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcblx0XHRcdHZhciBoZWlnaHQgPSAkKHdpbmRvdykuaW5uZXJIZWlnaHQoKTtcblx0XHRcdCQoJ2JvZHknKS5hbmltYXRlKHtcblx0XHRcdFx0c2Nyb2xsVG9wOiBoZWlnaHRcblx0XHRcdH0sIDgwMCk7XG5cdFx0fSlcblx0fVxuXG5cdGZ1bmN0aW9uIGluaXQoKSB7XG5cdFx0X3NldEV2ZW50TGlzdGVuZXJzKCk7XG5cdH1cblxuXHRyZXR1cm4ge1xuXHRcdGluaXQ6IGluaXRcblx0fVxuXG59KCkpO1xuIiwidmFyIHZhbGlkYXRpb24gPSAoZnVuY3Rpb24oKSB7XG5cbiAgdmFyIG1vZGFsQ29udGFpbmVyUm9ib3QgPSAkKCcjaW5kZXgtbW9kYWwtY29udGFpbmVyLXJvYm90cycpO1xuICB2YXIgbW9kYWxDb250YWluZXJGaWVsZCA9ICQoJyNpbmRleC1tb2RhbC1jb250YWluZXItZmllbGQnKTtcbiAgdmFyIGFsbE1vZGFscyA9ICQoJy5pbmRleC1tb2RhbC1jb250YWluZXInKTtcbiAgdmFyIGFjdGl2ZU1vZGFsID0gJ2luZGV4LW1vZGFsLWFjdGl2ZSc7XG4gIHZhciBpc0h1bWFuID0gJCgnI2lzSHVtYW4nKTtcbiAgdmFyIG5vdFJvYm90ID0gJCgnI3JhZGlvMScpO1xuICB2YXIgbG9naW4gPSAkKCcjaW5kZXhfbG9naW4nKTtcbiAgdmFyIHBhc3MgPSAkKCcjaW5kZXhfcGFzcycpO1xuXG4gIGZ1bmN0aW9uIGluaXQoKSB7XG4gICAgX3NldFVwRXZlbnRMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIF9zZXRVcEV2ZW50TGlzdGVuZXJzKCkge1xuXG4gICAgJCgnI2F1dGhvcml6ZScpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgaWYoIWlzSHVtYW4ucHJvcCgnY2hlY2tlZCcpIHx8ICFub3RSb2JvdC5wcm9wKCdjaGVja2VkJykpIHtcbiAgICAgICAgX3Nob3dNb2RhbChtb2RhbENvbnRhaW5lclJvYm90KTtcbiAgICAgIH0gZWxzZSBpZiAobG9naW4udmFsKCkgPT09ICcnIHx8IHBhc3MudmFsKCkgPT09ICcnKSB7XG4gICAgICAgIF9zaG93TW9kYWwobW9kYWxDb250YWluZXJGaWVsZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBmb3JtID0gJCgnLmF1dGhfZm9ybScpO1xuICAgICAgICAgIHZhciBkZWZPYmogPSBfYWpheEZvcm0oZm9ybSwgJy4vbG9naW4nKTtcbiAgICAgICAgICBpZiAoZGVmT2JqKSB7XG4gICAgICAgICAgICBkZWZPYmouZG9uZShmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgdmFyIHN0YXR1cyA9IHJlcy5zdGF0dXM7XG4gICAgICAgICAgICAgIGlmIChzdGF0dXMgPT09ICdPSycpe1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9hZG1pbic7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZGVmT2JqLmZhaWwoZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihyZXMpXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJCgnLmluZGV4LW1vZGFsLWJsb2NrLWJ1dHRvbicpLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIF9oaWRlTW9kYWwoYWxsTW9kYWxzKTtcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gX3Nob3dNb2RhbChlbGVtZW50KSB7XG4gICAgZWxlbWVudC5hZGRDbGFzcyhhY3RpdmVNb2RhbCk7XG4gIH1cbiAgZnVuY3Rpb24gX2hpZGVNb2RhbChlbGVtZW50KSB7XG4gICAgZWxlbWVudC5yZW1vdmVDbGFzcyhhY3RpdmVNb2RhbClcbiAgfVxuICBmdW5jdGlvbiBfYWpheEZvcm0oZm9ybSwgdXJsKXtcbiAgICB2YXIgZGF0YSA9IGZvcm0uc2VyaWFsaXplKCk7XG4gICAgdmFyIGRlZk9iaiA9ICQuYWpheCh7XG4gICAgICB0eXBlIDogXCJQT1NUXCIsXG4gICAgICB1cmwgOiB1cmwsXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSk7XG5cbiAgICByZXR1cm4gZGVmT2JqO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0XG4gIH1cblxufSgpKTsiLCJ2YXIgYWRtaW4gPSAoZnVuY3Rpb24oKSB7XG5cbiAgdmFyIG1vZGFsID0gJCgnLm1vZGFsLWNvbnRhaW5lcicpO1xuICB2YXIgb2tCdXR0b24gPSAkKCcubW9kYWxPaycpO1xuICB2YXIgYmFja1RvTWFpbiA9ICQoJy5hZG1pbl9oZWFkZXJfcmV0dXJuJyk7XG4gIHZhciBzYXZlRGlhZ3JhbSA9ICQoJyNzYXZlRGlhZ3JhbScpO1xuXG4gIGZ1bmN0aW9uIF9zaG93TW9kYWwocmVzdWx0KSB7XG4gICAgaWYgKHJlc3VsdCA9PT0gJ3N1Y2Nlc3MnKSB7XG4gICAgICBtb2RhbC5lcSgwKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbW9kYWwuZXEoMSkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gX2xvZ091dCgpIHtcbiAgICBkZWZPYmogPSAkLmFqYXgoe1xuICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICB1cmw6ICcuL2xvZ291dCdcbiAgICB9KS5mYWlsKGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdlcnJvcicpO1xuICAgIH0pLmNvbXBsZXRlKGZ1bmN0aW9uICgpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy8nO1xuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiBfYWRkTmV3V29yaygpIHtcbiAgICB2YXIgZm9ybURhdGEgPSBuZXcgRm9ybURhdGEoJCgnI3VwbG9hZEZvcm0nKVswXSk7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICBwcm9jZXNzRGF0YTogZmFsc2UsXG4gICAgICBjb250ZW50VHlwZTogZmFsc2UsXG4gICAgICB1cmw6IFwiLi91cGxvYWRcIixcbiAgICAgIGRhdGE6ICBmb3JtRGF0YVxuICAgIH0pXG4gICAgICAuZG9uZShmdW5jdGlvbigpIHtcbiAgICAgICAgX3Nob3dNb2RhbCgnc3VjY2VzcycpXG4gICAgICB9KS5mYWlsKGZ1bmN0aW9uKCkge1xuICAgICAgX3Nob3dNb2RhbCgnZmFpbCcpXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIF9wb3N0RGlhZ3JhbVZhbHVlcygpIHtcbiAgICB2YXIgZWxlbWVudHMgPSAkKCcudGFic19fbGlzdF9ibG9jay1lbGVtJyk7XG4gICAgdmFyIHRleHQgPSAkKCcudGFic19fbGlzdC10ZXh0Jyk7XG4gICAgdmFyIHZhbHVlID0gJCgnLnRhYnNfX2xpc3QtaW5wdXQnKTtcbiAgICB2YXIgZGlhZ3JhbVZhbHVlcyA9IHt9O1xuXG4gICAgZWxlbWVudHMuZWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgbmFtZSA9ICQodGhpcykuZmluZCh0ZXh0KS50ZXh0KCkudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcuJywgJycpO1xuICAgICAgZGlhZ3JhbVZhbHVlc1tuYW1lXSA9ICQodGhpcykuZmluZCh2YWx1ZSkudmFsKCk7XG4gICAgfSk7XG5cbiAgICAkLnBvc3QoXCIvZGlhZ3JhbVwiLCBkaWFncmFtVmFsdWVzKS5kb25lKGZ1bmN0aW9uICgpIHtcbiAgICAgIF9zaG93TW9kYWwoJ3N1Y2Nlc3MnKVxuICAgIH0pLmZhaWwoZnVuY3Rpb24gKCkge1xuICAgICAgX3Nob3dNb2RhbCgnZmFpbCcpXG4gICAgfSlcbiAgfVxuXG4gIGZ1bmN0aW9uIF9zZXR1cEV2ZW50TGlzdGVuZXJzKCkge1xuICAgIG9rQnV0dG9uLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgIG1vZGFsLmNzcygnZGlzcGxheScsICdub25lJylcbiAgICB9KTtcblxuICAgIGJhY2tUb01haW4uY2xpY2soX2xvZ091dCk7XG4gICAgc2F2ZURpYWdyYW0uY2xpY2soX3Bvc3REaWFncmFtVmFsdWVzKTtcblxuICAgICQoJyN1cGxvYWRGb3JtJykub24oJ3N1Ym1pdCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIF9hZGROZXdXb3JrKCk7XG4gICAgfSk7XG5cbiAgICAkKCcjYmxvZ1Bvc3QnKS5vbignc3VibWl0JywgZnVuY3Rpb24oZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdmFyIGRhdGEgPSAkKHRoaXMpLnNlcmlhbGl6ZSgpO1xuXG4gICAgICAkLnBvc3QoXCIuL2FkZGJsb2dwb3N0XCIsIGRhdGEpLmRvbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgIF9zaG93TW9kYWwoJ3N1Y2Nlc3MnKVxuICAgICAgICAkKCcjYmxvZ1Bvc3QnKVswXS5yZXNldCgpO1xuICAgICAgfSkuZmFpbChmdW5jdGlvbigpIHtcbiAgICAgICAgX3Nob3dNb2RhbCgnZmFpbCcpXG4gICAgICB9KTtcbiAgICB9KVxuICB9XG5cbiAgZnVuY3Rpb24gaW5pdCgpIHtcbiAgICBfc2V0dXBFdmVudExpc3RlbmVycygpO1xuICB9XG5cbiAgcmV0dXJuIHtcbiAgICBpbml0OiBpbml0XG4gIH1cbn0oKSk7XG4iLCJmdW5jdGlvbiBuYXZpZ2F0aW9uKCkge1xuXHQndXNlIHN0cmljdCc7XG5cdCQoJyNuYXYtaWNvbicpLmNsaWNrKGZ1bmN0aW9uKCkge1xuXHRcdCQodGhpcykudG9nZ2xlQ2xhc3MoJ29wZW4nKTtcblx0XHQkKCcjb3ZlcmxheScpLnRvZ2dsZUNsYXNzKCdvcGVuJyk7XG5cdH0pO1xufTtcblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG5cblx0dmFyIHBhdGggPSB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWU7XG5cblx0cHJlbG9hZGVyLmluaXQoKTtcblx0bmF2aWdhdGlvbigpO1xuXG5cdGlmIChwYXRoID09PSAnLycgfHwgcGF0aCA9PT0gJy9pbmRleC5odG1sJykge1xuXHRcdHBhcmFsbGF4LmluaXQoKTtcblx0XHRmbGlwcGVyLmluaXQoKTtcblx0XHR2YWxpZGF0aW9uLmluaXQoKTtcblx0fSBlbHNlIHtcblx0XHRzY3JvbGwuaW5pdCgpO1xuXHR9XG5cblx0aWYgKHBhdGggPT09ICcvYmxvZy5odG1sJyB8fCBwYXRoID09PSAnL2Jsb2cnKSB7XG5cdFx0YmxvZ05hdi5pbml0KCk7XG5cdH1cblxuXHRpZiAocGF0aCA9PT0gJy93b3Jrcy5odG1sJyB8fCBwYXRoID09PSAnL3dvcmtzJykge1xuXHRcdHNsaWRlci5pbml0KCk7XG5cdFx0c2xpZGVyVGV4dC5pbml0KCk7XG5cdH1cblxuXHRpZiAocGF0aCA9PT0gJy9hYm91dG1lLmh0bWwnIHx8IHBhdGggPT09ICcvYWJvdXRtZScpIHtcblx0XHRnb29nbGVNYXAuaW5pdCgpO1xuXHRcdGRpYWdyYW0uaW5pdCgpO1xuXHR9XG5cblx0aWYgKHBhdGggPT09ICcvYWRtaW4uaHRtbCcgfHwgcGF0aCA9PT0gJy9hZG1pbicpIHtcblx0XHR0YWIuaW5pdCgpO1xuXHR9XG5cblx0aWYgKHBhdGggIT09ICdhZG1pbicpIHtcblx0XHRzY3JvbGxBcnJvdy5pbml0KCk7XG5cdFx0YWRtaW4uaW5pdCgpO1xuXHR9XG5cbn0pO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
