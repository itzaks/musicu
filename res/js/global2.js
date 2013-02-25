var m = {
	q_music_api		 	: "http://query.yahooapis.com/v1/public/yql?format=json&diagnostics=false&callback=?&q=",
	q_get_track			: "https://gdata.youtube.com/feeds/api/videos?alt=json&callback=?&max-results=10&v=2&q=",

	init : function() {
		m.store();
		m.binds();
		m.player.init();
	},
	store : function() {
		m.$a_albums		= $("#win_play div.albums");
		m.$results 		= $("#win_search div.search_results");
		m.$btn_search	= $("#btn_search");
	},
	binds : function() {
		m.$btn_search.click(function(ev) {
			ev.preventDefault();
			var artist = $("#searchbar .searchval").val()
			m.search(artist);
		});
		$("li.result_artist", m.$results).live("click", function(ev) {
			ev.preventDefault();
			var id = $("var.id", this).text();
			m.view_artist(id);
		});
		$("li.artist_album", m.$a_albums).live("click", function(ev) {
			ev.preventDefault();
			var id = $("var.id", this).text();
			m.view_tracks(id, $("span.name", this).text(), $("div.tracks", this));
		});
		$("div.tracks li.track", m.$a_albums).live("click", function(ev) {
			ev.preventDefault();
			var name	 = $("span.name", this).text();
			var artist	 = $("var.artist", this).text();
			var query	 = m.q_get_track + artist + " " + name;
			$.getJSON(query, function(json) {
				var url = json.feed.entry[0].content.src;
				if(url != "" && undefined != url) {
					m.player.load(url);
				}
			});
		});
	},
	
	player : {
		swf : false,
		init : function() {
			m.player.swf = $('#win_play .player');
			m.player.swf.flash({
				swf: 'http://www.youtube.com/apiplayer?enablejsapi=1&version=3'
			});
		},
		load : function(url) {
			var id = url.replace("http://www.youtube.com/v/", "");
				id = id.replace("?f=videos&app=youtube_gdata","");
			m.player.swf.flash(function() {
				this.loadVideoById(id, 0, "large");
				this.playVideo();
			});
		}
	},

	search : function(term) {
		var query = m.q_music_api + m.query_search(term);
		$.getJSON(query, function(json) {
			var results 	= json.query.results.results,
				artists 	= results[0].Artist,
				tracks	 	= results[1].Track,
				releases 	= results[2].Release,
				html 		= "<ul>";
				
				if(undefined == artists.length) artists = [artists];
				if(undefined == tracks.length) tracks = [artists];
				if(undefined == releases.length) releases = [artists];
				
			html 			+= '<li class="result_header">Artists</li>';
			for(var i = 0, il = artists.length; i<il; i ++) {
				html += 	'<li class="result_artist">' + 
							'<span class="name artist">' + artists[i].name + '</span>' + 
							'<var class="id">' + artists[i].id + '</var>' +
							'</li>';
			};
			
			html 			+= '<li class="result_header">Tracks</li>';
			for(var i = 0, il = tracks.length; i<il; i ++) {
				html += 	'<li class="result_artist">' + 
							'<span class="name track">' + tracks[i].title + '</span>' + 
							'<var class="id">' + tracks[i].id + '</var>' +
							'</li>';
			};
			
			html 			+= '<li class="result_header">Releases</li>';
			for(var i = 0, il = releases.length; i<il; i ++) {
				html += 	'<li class="result_artist">' + 
							'<span class="name release">' + releases[i].title + '</span>' + 
							'<var class="id">' + releases[i].id + '</var>' +
							'</li>';
			};
			html += '</ul>';
			m.$results.html(html);
		});
	},
	query_search : function(term) {
		var limit = 10;
		return "select * from yql.query.multi where queries=\"select name, id from music.artist.search where keyword='" + term + "' LIMIT " + limit + "; select title, id, Album, Artist from music.track.search where keyword='" + term + "' LIMIT " + limit + "; select title, id, Artist from music.release.search where keyword='" + term + "' LIMIT " + limit + ";\"";
	},
	query_artist : function(id) {
		var limit = 10;
		return "select * from music.release.artist where id='" + id + "'";
	},
	query_tracks : function(id) {
		var limit = 10;
		return "select * from music.release.tracks where id='" + id + "'";
	},
	view_artist : function(id) {
		var query = m.q_music_api + m.query_artist(id);
		$.getJSON(query, function(json) {
			var albums 		= json.query.results.Release;
			var result		= "<ul>";
			for(var i = 0, il = albums.length; i<il; i ++) {
				if(albums[i].typeID == "0") {
					var thumb = "http://d.yimg.com/ec/image/v1/release/" + albums[i].id + ";encoding=jpg;size=150;fallback=defaultImage";
					result += 	'<li class="artist_album">' + 
									'<div class="album_info">' + 
										'<img src="' + thumb + '" alt />' + 
										'<span class="name">' + albums[i].title + '</span>' + 
										'<span class="year">(' + albums[i].releaseYear + ')</span>' + 
									'</div>' +
									'<var class="id">' + albums[i].id + '</var>' +
									'<div class="tracks">&nbsp;</div>' + 
								'</li>';
				}
			};
			result += '</ul>';
			m.$a_albums.html(result);
		});
	},
	view_tracks : function(id, artist, el) {
		var query = m.q_music_api + m.query_tracks(id);
		$.getJSON(query, function(json) {
			var tracks	= json.resp.release.tracklist;
			var result	= "<ul>";
			for(var i = 0, il = tracks.length; i<il; i ++) {
				result += 	'<li class="track">' + 
								'<span class="name">' + tracks[i].title + '</span>' + 
								'<var class="artist">' + artist + '</span>' + 
							'</li>';
			};
			result += '</ul>';
			el.html(result);
		});
	},
	play_queue : function() {
		
	}
}
$(document).ready(function() {
	m.init();
});