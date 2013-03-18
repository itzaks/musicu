/*
 * seekbarVideoPlayer - jQuery plugin 1.0.0
 *
 * Copyright (c) 2010 Cristian-Ionut Colceriu
 *
 * www.seekbar.net
 * contact@seekbar.net
 *
 */

(function($) {
	// plugin definition
	$.fn.gVideo = function(options) {		
		// build main options before element iteration		
		var defaults = {
			theme: 'simpledark',
			childtheme: ''
		};
		var options = $.extend(defaults, options);
		// iterate and reformat each matched element
		return this.each(function() {
			var $gVideo = $(this);
			
			//create html structure
			//main wrapper
			var $video_wrap = $('<div></div>').addClass('seekbar-player').addClass(options.theme).addClass(options.childtheme);
			//controls wraper
			var $video_controls = $('<div class="seekbar-controls"><a class="seekbar-play" title="Play/Pause"></a><div class="seekbar-seek"></div><div class="seekbar-timer">00:00</div><div class="seekbar-volume-box"><div class="seekbar-volume-slider"></div><a class="seekbar-volume-button" title="Mute/Unmute"></a></div></div>');						
			$gVideo.wrap($video_wrap);
			$gVideo.after($video_controls);
			
			//get new elements
			var $video_container = $gVideo.parent('.seekbar-player');
			var $video_controls = $('.seekbar-controls', $video_container);
			var $seekbar_play_btn = $('.seekbar-play', $video_container);
			var $seekbar_video_seek = $('.seekbar-seek', $video_container);
			var $seekbar_video_timer = $('.seekbar-timer', $video_container);
			var $seekbar_volume = $('.seekbar-volume-slider', $video_container);
			var $seekbar_volume_btn = $('.seekbar-volume-button', $video_container);
			
			$video_controls.hide(); // keep the controls hidden
						
			var gPlay = function() {
				if($gVideo.attr('paused') == false) {
					$gVideo[0].pause();					
				} else {					
					$gVideo[0].play();				
				}
			};
			
			$seekbar_play_btn.click(gPlay);
			$gVideo.click(gPlay);
			
			$gVideo.bind('play', function() {
				$seekbar_play_btn.addClass('seekbar-paused-button');
			});
			
			$gVideo.bind('pause', function() {
				$seekbar_play_btn.removeClass('seekbar-paused-button');
			});
			
			$gVideo.bind('ended', function() {
				$seekbar_play_btn.removeClass('seekbar-paused-button');
			});
			
			var seeksliding;			
			var createSeek = function() {
				if($gVideo.attr('readyState')) {
					var video_duration = $gVideo.attr('duration');
					$seekbar_video_seek.slider({
						value: 0,
						step: 0.01,
						orientation: "horizontal",
						range: "min",
						max: video_duration,
						animate: true,					
						slide: function(){							
							seeksliding = true;
						},
						stop:function(e,ui){
							seeksliding = false;						
							$gVideo.attr("currentTime",ui.value);
						}
					});
					$video_controls.show();					
				} else {
					setTimeout(createSeek, 150);
				}
			};

			createSeek();
		
			var gTimeFormat=function(seconds){
				var m=Math.floor(seconds/60)<10?"0"+Math.floor(seconds/60):Math.floor(seconds/60);
				var s=Math.floor(seconds-(m*60))<10?"0"+Math.floor(seconds-(m*60)):Math.floor(seconds-(m*60));
				return m+":"+s;
			};
			
			var seekUpdate = function() {
				var currenttime = $gVideo.attr('currentTime');
				if(!seeksliding) $seekbar_video_seek.slider('value', currenttime);
				$seekbar_video_timer.text(gTimeFormat(currenttime));							
			};
			
			$gVideo.bind('timeupdate', seekUpdate);	
			
			var video_volume = 1;
			$seekbar_volume.slider({
				value: 1,
				orientation: "vertical",
				range: "min",
				max: 1,
				step: 0.05,
				animate: true,
				slide:function(e,ui){
						$gVideo.attr('muted',false);
						video_volume = ui.value;
						$gVideo.attr('volume',ui.value);
					}
			});
			
			var muteVolume = function() {
				if($gVideo.attr('muted')==true) {
					$gVideo.attr('muted', false);
					$seekbar_volume.slider('value', video_volume);
					
					$seekbar_volume_btn.removeClass('seekbar-volume-mute');					
				} else {
					$gVideo.attr('muted', true);
					$seekbar_volume.slider('value', '0');
					
					$seekbar_volume_btn.addClass('seekbar-volume-mute');
				};
			};
			
			$seekbar_volume_btn.click(muteVolume);
			
			$gVideo.removeAttr('controls');
			
		});
	};

	$.fn.gVideo.defaults = {		
	};

})(jQuery);