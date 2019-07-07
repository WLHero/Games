// if (typeof Object.create !== "function") {
//     Object.create = function (obj) {
//         function F() {}
//         F.prototype = obj;
//         return new F();
//     };
// }

;(function($) {
	var Swiper = function(el, options) {
		this.init(el, options);
	}

	Swiper.prototype = {
		init: function (el, options) {
			var base = this;

			base.$elem = $(el);
			base.options = $.extend({}, $.fn.options, options);
			base.loadContent();
		},
		loadContent: function () {
			var base = this;

			if (typeof base.options.onInit === "function") {
                base.options.onInit.apply(this, [base]);
            }
            base.setVars();
            base.play();
            base.mouseWheelEvent();
            base.buildPagination();
            base.buildScrollbar();
            base.response();
		},
		setVars: function() {
			var base = this;
			if (base.$elem.children().length === 0) {return false;}
			base.currentItem = 0;
			base.playDirection = "next";
			base.isMoveEnd = true;
            base.$siwperWrapper = base.$elem.children(".C_swiper-wrapper");
            base.updateSlide();
		},
		updateSlide: function () {
			var base = this;
			base.elemWidth = base.$elem.outerWidth(true);
			base.$siwperSlider = base.$siwperWrapper.children(".C_swiper-slider");
			base.siwperSliderLength = base.$siwperSlider.length;
			base.currentItem = Math.min(base.currentItem, base.siwperSliderLength - 1)
			base.$siwperSlider.css({'width': base.elemWidth, 'margin-right': base.options.spaceBetween});
			base.$siwperWrapper.width(base.siwperSliderLength * (base.elemWidth + base.options.spaceBetween));
			base.$siwperWrapper.css({
				left: -base.currentItem * ( base.elemWidth + base.options.spaceBetween )
			})
		},
		updateVars: function() {
			var base = this;
			base.updateSlide();
			base.paginationClass();
            base.swiperScrollbarDragStyle();
			base.swiperScrollbarDragPosition();
			base.buildPagination();
		},
		slideNext: function () {
			var base = this;
			if (base.currentItem == base.siwperSliderLength - 1) return;
			base.currentItem ++;
			base.slideTo(base.currentItem)
		},
		slidePrev: function () {
			var base = this;

			if (base.currentItem == 0) return;
			base.currentItem --;
			base.slideTo(base.currentItem);
		},
		slideTo: function (index, speed) {
			var base = this;

			if (index == base.siwperSliderLength) return;
			if (typeof base.options.onSlideChangeStart === "function") {
                base.options.onSlideChangeStart.apply(this, [base]);
            }
            base.paginationClass();

            if (base.options.scrollbar) {
            	base.$swiperScrollbar.stop().fadeIn();
            	base.swiperScrollbarDragPosition();
            }
			base.slideMove(index, speed);
		},
		addSlide: function (node) {
			var base = this;
			base.slideNode(node);
			base.reload();
		},
		removeSlide: function (index) {
			var base = this;
			if (index >= base.siwperSliderLength) return false;
			base.$siwperWrapper.children(".C_swiper-slider").eq(index).remove();
			base.reload();
		},
		slideMove: function (index, speed) {
			var base = this;

			base.isMoveEnd = false;
			base.$siwperWrapper.stop(true, true).animate({
				left: -index * (base.elemWidth + base.options.spaceBetween)
			}, {
				duration: speed || base.options.slideSpeed,
				complete : function () {
	                base.isMoveEnd = true;
	                if (typeof base.options.onSlideChangeEnd === "function") {
		                base.options.onSlideChangeEnd.apply(this, [base]);
		            }
		            if (base.options.scrollbar) {
		            	base.$swiperScrollbar.stop().fadeOut(800);
		            }
	            }
			})
		},
		slideNode: function (node) {
			var base = this;
			base.$siwperWrapper.append("<div class=\"C_swiper-slider\">"+node+"</div>")
		},
		buildPagination: function () {
			var base = this;
			if (base.$swiperPagination) {
				base.$swiperPagination.remove();
			}
			if(base.options.pagination !== true) return false;
			var html = '';
			base.$elem.append('<div class="C_swiper-pagination"></div>');
			for (var i = 0; i < base.siwperSliderLength; i++) {
				html += "<span class='C_swiper-pagination-bullet'></span>"
			}
			base.$swiperPagination = base.$elem.children('.C_swiper-pagination');
			base.$swiperPagination.append(html);
			base.paginationClass();
		},
		paginationClass: function() {
			var base = this;

			if(base.options.pagination !== true) return false;
			base.$swiperPagination.find('span').eq(base.currentItem).addClass('C_swiper-pagination-bullet-active').siblings('span').removeClass('C_swiper-pagination-bullet-active');
		},
		buildScrollbar: function() {
			var base = this;

			if(base.options.scrollbar !== true) return false;
			base.$elem.append('<div class="C_swiper-scrollbar"><div class="C_swiper-scrollbar-drag"></div></div>');
			base.$swiperScrollbar = base.$elem.children('.C_swiper-scrollbar');
			base.$swiperScrollbarDrag = base.$swiperScrollbar.children('.C_swiper-scrollbar-drag');
			base.swiperScrollbarDragStyle();
			base.swiperScrollbarDragPosition();
		},
		swiperScrollbarDragStyle: function() {
			var base = this;

			if(base.options.scrollbar !== true) return false;
			base.$swiperScrollbar.stop().fadeOut();
			base.$swiperScrollbarDrag.css({
				width: base.elemWidth / base.siwperSliderLength
			})
		},
		swiperScrollbarDragPosition: function () {
			var base = this;

			if(base.options.scrollbar !== true) return false;
			base.$swiperScrollbarDrag.stop(true).animate({
				left: base.elemWidth / base.siwperSliderLength * base.currentItem
			})
		},
		reload: function () {
			var base = this;

			setTimeout(function() {
				base.updateVars();
			},0)
		},
		play : function () {
            var base = this;

            if (typeof base.options.autoPlay !== 'number') {
                return false;
            }
            window.clearInterval(base.autoPlayInterval);
            base.autoPlayInterval = window.setInterval(function () {
                base.slideNext(); 
            }, base.options.autoPlay);
        },
        mouseWheelEvent: function () {
        	var base = this;
        	
        	if (base.options.mousewheelControl !== true) return false;
			if (document.addEventListener) { 
			   document.addEventListener('DOMMouseScroll',function(e) {
			   		base.mouseWheel(e, base)
			   },false); 
			}//W3C 
			window.onmousewheel=document.onmousewheel = function(e) {
				base.mouseWheel(e, base)
			}; //IE/Opera/Chrome
        },
        mouseWheel: function (e, base) {
		     e = e || window.event;
		     var direct = e.wheelDelta || e.detail;
		     base.wheelStatus = true;

		     if (base.isMoveEnd) {
		     	if (direct > 0) {
			     	// 左
			     	base.slidePrev();
			     }  else {
			     	// 右
			     	base.slideNext();
			     }
		     }
        },
        response: function () {
        	var base = this,
        		smallDelay,
                lastWindowWidth;

        	if (base.options.responsive !== true) {
        		return false;
        	}
        	lastWindowWidth = $(window).width();
        	base.resizer = function () {

                if ($(window).width() !== lastWindowWidth) {
                    if (base.options.autoPlay !== false) {
                        window.clearInterval(base.autoPlayInterval);
                    }
                    window.clearTimeout(smallDelay);
                    smallDelay = window.setTimeout(function () {
                        lastWindowWidth = $(window).width();
                        base.updateVars();
                    }, base.options.responsiveRefreshRate);
                }
            };

        	$(window).resize(base.resizer)
        }
	}

 	window['C_Swiper'] = Swiper;
    $.fn.options = {
    	autoPlay: false,
    	scrollbar: false,
    	slideSpeed: 400,
    	pagination: true,
    	spaceBetween: 10,
    	responsive: true,
    	responsiveRefreshRate: 200,
    	mousewheelControl: false,

    	onInit: false,
    	onSlideChangeStart: false,
    	onSlideChangeEnd: false
    }

})(jQuery)