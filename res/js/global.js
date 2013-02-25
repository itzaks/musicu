var m = {
	q_yahoo_api	: "http://query.yahooapis.com/v1/public/yql?format=json&diagnostics=false&callback=?&q=",
	q_fl_api	: "http://ws.audioscrobbler.com/2.0/?format=json&api_key=9f0f524c0a1a2188217e84345efe36c9&callback=?&method=",
	q_d_api		: "http://api.discogs.com/",
	q_get_track	: "https://gdata.youtube.com/feeds/api/videos?alt=json&callback=?&max-results=10&v=2&q=",
	ytplayer	: false,
	fixedheader : false,
	init : function() {
		m.store();
		m.binds();
		m.player.init();
		m.add_fixed();
		
		$('#searchbar input.searchval:eq(0)').focus();
		$('#horiz_load div.bg').css('opacity', 0.5);
		$('footer div.seekbar').slider({
			range	: "min",
			value	: 0,
			min		: 0,
			max		: 100,
			start 	: function(event, ui) {
				m.player.seeking = true;
			}, 
			stop 	: function(event, ui) {
				m.player.seeking = false;
			},
			change	: function(event, ui) {
				var time = (ui.value/100) * m.player.track_length;
				$("span.current_time").val(time);
				
				if(undefined != event.originalEvent) {
					m.player.yt.seekTo(time, false);
				}
			}
		});
	},
	add_fixed : function() {
		var msie6 = ($.browser == 'msie' && $.browser.version < 7);
		if (!msie6) {
			$(window).scroll(function (event) {
				var y = ($(this).scrollTop() >= 67);
				if (y && m.fixedheader == false) {
					m.fixedheader = true;
					$('header').addClass('fixed').find('input').show();
				} else if(!y && m.fixedheader == true){
					m.fixedheader = false;
					$('header').removeClass('fixed').find('input').hide();
				}
			});
		} 
	},
	store : function() {
		m.$play_button 	= $('footer div.now_playing .play_pause');
		m.$a_albums		= $("#win_play div.albums div.list");
		m.$results 		= $("#win_search div.search_results");
	},
	binds : function() {
		$('.music_search').submit(function(ev) {
			ev.preventDefault();
			
			var artist = $(".searchval", this).val()
			$(".searchval").val(artist);
			$.scrollTo({top:0, left: 0},200);
			m.search(artist);
		});
		$(".music_search input").mouseup(function() {
			$(this).select();
		});
		$("li.result span", m.$results).live("click", function(ev) {
			ev.preventDefault();
			var artist 	= $("span.name", $(this).parent()).text();
			m.view_artist(artist);
		});
		$("li.artist_album div.album_info", m.$a_albums).live("click", function(ev) {
			ev.preventDefault();
			var wrap = $(this).parent();
			var id = $("var.id", wrap).text();
			
			if($(wrap).hasClass("open") == false) {
				$(wrap).addClass("open");
				m.view_tracks(id, $("var.artist", wrap).text(), $("div.tracks", wrap), $("var.type", wrap).text());	
			} else {
				$(wrap).removeClass("open").find("div.tracks").slideUp(200);
				$('div.imgwrap, img', wrap).animate({width: '-=80px', height: '-=80px'}, 200);
			}
		});
		$("div.tracks li.track span", m.$a_albums).live("click", function(ev) {
			ev.preventDefault();
			m.player.current_track = 0;
			var $tracks = $(this).parent().parent().find("li.track");
			var startat = $tracks.index($(this).parent());
			
			m.player.current_track 	= startat;
			m.player.queue 			= $tracks;
			
			m.player.start_queue();
		});
		m.$play_button.click(function() {
			if(m.player.state == "playing") {
				m.player.change_state("pause");
			} else {
				m.player.change_state("play");
			}
		});
	},
	
	player : {
		yt 				: false,
		state 			: "paused",
		seeking			: false,
		track_length	: 1,
		current_track	: 0,
		queue 			: [],
	    init : function() {
	        var params = { allowScriptAccess: "always" };
	        var atts = { id: "ytPlayer" };
	        swfobject.embedSWF("http://www.youtube.com/apiplayer?" +
	                           "&enablejsapi=1&playerapiid=player1", 
	                           "player", "266", "150", "8", null, null, params, atts);
	    },
		load : function(url) {
			var id = url.replace("http://www.youtube.com/v/", "");
				id = id.replace("?f=videos&app=youtube_gdata","");
			m.player.track_length = 0.1;
			m.player.yt.loadVideoById(id, 0, "hd");
			m.player.change_state("play");
		},
		update_player_info : function() {
			if(m.player.state == "playing") {
				if(m.player.track_length < 5) {
					var lngth = m.player.yt.getDuration();
					m.player.track_length = lngth;
					$("footer div.now_playing span.total_time").text(m.format_time(lngth));
				}
				var cur = m.player.yt.getCurrentTime();
				var time = (cur/m.player.track_length)*100;
				
				$("footer div.now_playing span.current_time").text(m.format_time(cur));
				
				if(m.player.seeking == false) {
					$("footer div.seekbar").slider("value", time);
				}
			}
			
		},
		start_queue : function() {
			m.play_track(m.player.queue[m.player.current_track]);
			m.player.change_state("play");
		},
		change_state : function(state, hidden) {
			var hidden = (undefined == hidden ? false : hidden);
			switch(state) {
				case "play" : 
					m.player.state = "playing";
					m.player.yt.setPlaybackQuality("large");
					m.player.yt.playVideo();
					if(!hidden) {
						m.$play_button.css("background-position", "0 -48px");
					}
					break;
				case "pause" : 
					m.player.state = "paused";
					m.player.yt.pauseVideo();
					if(!hidden) {
						m.$play_button.css("background-position", "0 0");
					}
					break;
			}
		}
	},
	search : function(term) {
		var query = m.q_d_api + m.query_search(term);
		$('#horiz_load').fadeIn(100);
		$.getJSON(query, function(json) {
			var results 	= json.resp;
			if(results.status == true) {
				var exactresults = [];
				if(undefined != results.search.exactresults) {
					exactresults = results.search.exactresults;
				}
				
				var searchresults = m.unique_array(exactresults.concat(results.search.searchresults.results));
				$('ul', m.$results).empty();
				
				
				for(var i = 0, il = searchresults.length; i<il; i ++) {
					var uri = searchresults[i].uri.replace("/http:\/\/www\.discogs\.com/.*?\//", "");
					var artist = "";
					
					if(searchresults[i].type == "release" || searchresults[i].type == "master") {
						artist = searchresults[i].title.match(/.* - /)[0].replace(" - ", "");
					}
					
					var title = searchresults[i].title.replace(/.* - /, "");
					var element = 	'<li class="result">' + 
									'<span class="name ' + searchresults[i].type + '">' + title + '</span>' + 
									'<var class="type">' + searchresults[i].type + '</var>' +
									'<var class="uri">' + uri + '</var>' +
									'<var class="artist">' + artist + '</var>' +
									'</li>';
									
					$('ul.' + searchresults[i].type, m.$results).append(element);
				};              
			}
			$('#horiz_load').fadeOut(100);
			m.$results.slideDown(500);
			$.scrollTo({top:0, left: 0},500);
		});
	},
	query_search : function(term) {
		var limit = 10;
		return "search?f=json&callback=?&q=" + term;
	},
	query_artist : function(artist) {		
		return "artist/" + artist + "?f=json&callback=?&releases=1";
	},
	query_tracks : function(id, type) {
		if(type == "master") {
			return "master/" + id + "?f=json&callback=?";
		} else {
			return "release/" + id + "?f=json&callback=?";
		}
	},
	view_artist : function(artist) {
		$('#horiz_load').fadeIn(100);
		var query = m.q_d_api + m.query_artist(artist);
		$.getJSON(query, function(json) {
			$('#horiz_load').fadeOut(100);
			m.$results.slideUp();
			m.render_artist(json.resp);
		});
	},
	view_tracks : function(id, artist, el, type) {
		var query = m.q_d_api + m.query_tracks(id, type);
		$.getJSON(query, function(json) {
			var tracks;
			if(undefined != json.resp.release) {
				tracks = json.resp.release.tracklist;
			} else {
				tracks = json.resp.master.tracklist;
			}
			var result	= "<ul>";
			for(var i = 0, il = tracks.length; i<il; i ++) {
				result += 	'<li class="track">' + 
								'<span class="name">' + tracks[i].title + '</span>' + 
								'<var class="track_artist">' + artist + '</var>' + 
							'</li>';
			};
			result += '</ul>';
			el.html(result).slideDown(200);
			$('div.imgwrap, img', el.parent()).animate({width: '+=80px', height: '+=80px'}, 200);
		});
	},
	render_artist : function(result) {
		var artist = result.artist;
		var releases = artist.releases.reverse();
		var result = "<ul>";
		var last = "";
		var imgs = "";
		
		if(undefined != artist.images) {
			for(var j = 0, jl = artist.images.length; j<jl; j++) {
				if(j>2) break;
				imgs += "<div class='img' style='background-image: url(res/php/img.php?img=" + artist.images[j].uri + ");'></div>";
			}
		}
	
		var artistname = artist.name;
		var number = artistname.match(/\([0-9]*\)/);
		if(undefined != number) {
			artistname = artistname.replace(/\([0-9]*\)/, "") + "<span class='no'>" + number[0] + "</span>";
		}
		
		$('#win_play .artist_name').html(artistname);
 		$('#win_play .artist_images').html(imgs);

		for(var i = 0, il = releases.length; i<il; i ++) {
			if(releases[i].role == "Main") {
				var img = (undefined == releases[i].thumb ? 'res/img/no_cover.jpg' : "res/php/img.php?img=" + releases[i].thumb); 
				var year = (undefined == releases[i].year ? '----' : releases[i].year);
				var name = releases[i].title;
				var extra = "";
				if(name.length > 49) {
					name = name.slice(name.length-49, name.length-49) + "...";
				}
				var html = 	'<li class="artist_album">' + 
								'<div class="album_info">' + 
									'<div class="imgwrap"><img src="' + img + '" alt /></div>' + 
									'<h3><span class="name">' + name + '</span>' + 
									' <span class="year">(' + year + ')</span></h3>' + 
									'<div class="about">' + extra + '</div>' +
									'<div class="clear"></div>' +
								'</div>' +
								'<var class="id">' + releases[i].id + '</var>' +
								'<var class="type">' + releases[i].type + '</var>' +
								'<var class="artist">' + artist.name + '</var>' +
								'<div class="tracks">&nbsp;</div>' + 
							'</li>';
				if(year == '----') {
					last += html;
				} else {
					result += html;
				}						
			}
		};
		result += "</ul>";
		m.$a_albums.html(result);
		$('#win_play').fadeIn(100);
		$(window).scrollTo({top:216, left:0}, 500);
	},
	play_track : function(el) {
		var name	 = $("span.name", el).text();
		var artist	 = $("var.track_artist", el).text();
		artist = artist.replace(/\([0-9]*\)/g, "");

		var query	 = m.q_get_track + artist + " " + name;
		$.getJSON(query, function(json) {
			if(undefined != json.feed.entry) {
				var url = json.feed.entry[0].content.src;
				$(".now_playing h3.artist_name").text(artist);
				$(".now_playing h3.track_name").text(name);
				m.player.load(url);
			} else {
				m.show_message("Sorry, couldn't find the track.")
			}
		});
	},
	format_time : function(s) {
		var min = Math.floor(s/60);
		var sec = Math.floor(s % 60);
		return (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
	},
	unique_array : function(a) {
		temp = new Array();
		for(i=0;i<a.length;i++){
			if(!m.array_contains(temp, a[i])){
				temp.length+=1;
				temp[temp.length-1]=a[i];
			}
		}
		return temp;
	},
	array_contains : function(a, e) {
		for(j=0;j<a.length;j++)if(a[j].title==e.title&&a[j].type==e.type)return true;
		return false;	
	},
	show_message : function(text) {
		$("#message").slideDown(200).find("h4").text(text);
		setTimeout(m.hide_message, 1500);
	},
	hide_message : function() {
		$("#message").slideUp(200);
	}
}

$(document).ready(function() {
	m.init();
});
function onYouTubePlayerReady(playerId) {
    m.player.yt = document.getElementById("ytPlayer");
    setInterval(m.player.update_player_info, 500);
	m.player.yt.setPlaybackQuality("large");
    m.player.yt.addEventListener("onStateChange", "onPlayerStateChange");
    m.player.yt.addEventListener("onError", "onPlayerError");
}

function onPlayerStateChange(event) {
	if(m.player.state == "playing" && m.player.current_track < m.player.queue.length) {
		switch(event) {
			case 0:
				m.player.current_track += 1;
				m.player.start_queue();
				break;
			case 3:
					m.player.yt.setPlaybackQuality("large");
				break;
		}
	}
}