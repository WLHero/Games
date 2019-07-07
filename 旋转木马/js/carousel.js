;(function($) {
	var Carousel = function(poster) {
		var boss = this;
		//保存单个对象
		this.poster = poster;
		this.posterMain = this.poster.find('.poster-list');
		this.nextBtn = this.poster.find('.poster-next-btn');
		this.prevBtn = this.poster.find('.poster-prev-btn');
		this.posterItems = this.poster.find('.poster-item');
		//当时偶数是克隆第二个到最后一个
		if(this.posterItems.size()%2==0) {
			this.posterMain.append(this.posterItems.eq(1).clone());
			this.posterItems = this.poster.find('.poster-item');
		}
		this.posterFirstItem = this.posterItems.first();
		this.posterLastItem = this.posterItems.last();
		this.rotateFlag = true;

		//默认配置参数
		this.setting = {
			width:700,    //幻灯片的宽度
			height:270,	  //幻灯片的高度
			posterWidth:640,  //幻灯片第一帧的宽度
			posterHeight:270, //幻灯片第一帧的高度
			scale:0.9,
			autoPlay:false,
			delay:1500,
			speed:500, //速度
			verticalAlign:'middle' //top,bottom
		}
		$.extend(this.setting,this.getSetting());

		this.setSettingValue();
		this.setPosterPos();

		//左按钮点击
		this.prevBtn.on('click', function() {
			if(boss.rotateFlag == true) {
				boss.rotateFlag = 'false';
				boss.posterRoate('left');
			}
			
		})
		//右按钮点击
		this.nextBtn.on('click', function() {
			if(boss.rotateFlag == true) {
				boss.rotateFlag = 'false';
				boss.posterRoate('right');
			}
		})
		
		//是否自动播放
		// if(this.setting.autoPlay) {
		// 	this.autoPlay();
		// 	this.poster.hover(function() {
		// 		clearInterval(boss.timr)
		// 	},function() {
		// 		boss.autoPlay();
		// 	})
		// }
	}
	Carousel.prototype = {
		autoPlay: function() {
			var boss = this;
			boss.timr = setInterval(function() {
				boss.posterRoate('left');
			},boss.setting.delay)
		},
		//旋转
		posterRoate: function(dir) {
			var boss = this;
			if(dir === 'left') {
				boss.posterItems.each(function() {
					var self = $(this),
						prev = self.prev().get(0)?self.prev():boss.posterLastItem,
						width = prev.width(),
						height = prev.height(),
						opacity = prev.css('opacity'),
						zIndex = prev.css('zIndex'),
						left = prev.css('left'),
						top = prev.css('top');
					self.animate({
						zIndex:zIndex,
						width:width,
						height:height,
						opacity:opacity,
						top:top,
						left:left
					},boss.setting.speed,function() {
						boss.rotateFlag = true
					});
				})
			} else if(dir === 'right') {
				boss.posterItems.each(function() {
					var self = $(this),
						next = self.next().get(0)?self.next():boss.posterItems.first(),
						width = next.width(),
						height = next.height(),
						opacity = next.css('opacity'),
						zIndex = next.css('zIndex'),
						left = next.css('left'),
						top = next.css('top');
					self.stop(true).animate({
						zIndex:zIndex,
						width:width,
						height:height,
						opacity:opacity,
						top:top,
						left:left
					},boss.setting.speed,function() {
						boss.rotateFlag = true
					});
				})
				
			}
		},

		//设置剩余帧的位置关系
		setPosterPos: function() {
			var boss = this;
			var sliceItems = this.posterItems.slice(1), //分散在两边帧数
				sliceSize = sliceItems.size()/2,
				rightSlice = sliceItems.slice(0,sliceSize), //右边的帧数
				leftSlice = sliceItems.slice(sliceSize), //左边的帧数
				level = sliceSize, //层级
				level1 = sliceSize,
				gap = ((this.setting.width - this.setting.posterWidth)/2)/level; //两帧之间的间隙
				
			var rw = this.setting.posterWidth,
				rh = this.setting.posterHeight;

			var fixOffset = (this.setting.width - this.setting.posterWidth)/2 + this.setting.posterWidth;
			// 右边帧的设置
			rightSlice.each(function(i){
				level--;
				rw = rw * boss.setting.scale;
				rh = rh * boss.setting.scale;
				var j = i;
				$(this).css({
					zIndex:level,
					width :rw,
					height : rh,
					opacity:1/(++j),
					left:fixOffset+(++i)*gap-rw,
					top:boss.setverticalAlign(rh)
				})
			})

			//左边帧的位置设置
			lw = rightSlice.last().width();
			lh = rightSlice.last().height();
			oloop = sliceSize;
			leftSlice.each(function(i) {
				level1--;
				$(this).css({
					zIndex:level,
					width :lw,
					height : lh,
					left:gap*i++,
					opacity:1/oloop,
					top:boss.setverticalAlign(lh)
				})
				lw = lw / boss.setting.scale;
				lh = lh / boss.setting.scale;
				oloop--;
			})
		},
		//设置基本参数值宽度高度
		setSettingValue: function() {
			var w = (this.setting.width - this.setting.posterWidth)/2
			this.poster.css({
				width:this.setting.width,
				height:this.setting.height
			})
			this.posterMain.css({
				width:this.setting.width,
				height:this.setting.height
			})
			this.nextBtn.css({
				width:w,
				height:this.setting.height,
				zIndex:Math.ceil(this.posterItems.size()/2)
			})
			this.prevBtn.css({
				width:w,
				height:this.setting.height,
				zIndex:Math.ceil(this.posterItems.size()/2)
			})
			this.posterFirstItem.css({
				width:this.setting.posterWidth,
				height:this.setting.posterHeight,
				left:w,
				zIndex:Math.floor(this.posterItems.size()/2)
			})
		},
		//设置帧的top值
		setverticalAlign:function(height) {
			var vertical = this.setting.verticalAlign;
			var top = 0;
			if(vertical === 'top') {
				top = 0;
			} else if(vertical === 'middle') {
				top = (this.setting.height - height)/2
			} else if(vertical === 'bottom') {
				top = this.setting.height - height
			} else {
				top = (this.setting.height - height)/2
			}
			return top;
		},
		//获取人工配置参数
		getSetting: function() {
			var setting = this.poster.attr('data-setting');
			if(setting && setting != "") {
				return $.parseJSON(setting)
			} else {
				return {};
			}
		}
	}
	
	Carousel.init = function(posters) {
		var _this_ = this;
		posters.each(function(){
			new _this_($(this));
		})
	}

	window['Carousel'] = Carousel;

})(jQuery)