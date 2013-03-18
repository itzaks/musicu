<!DOCTYPE HTML>
<html>
    <head>
		<meta charset=utf-8>
		<title>The free music player</title>
		
		<script src="http://code.jquery.com/jquery-latest.min.js"></script>
		<script src="res/swfobject/swfobject.js"></script>
		<script src="res/js/global.js"></script>
		<script src="res/js/jquery-ui.min.js"></script>
		<script src="res/js/jquery.seekbar.js"></script>
		<script src="res/js/jquery.scrollTo.js"></script>
		<script src="res/js/modernizr-1.7.min.js"></script>
		
		<link rel="stylesheet" type="text/css" href="res/css/reset.css" media="screen" title="Reset Stylesheet" />
		<link rel="stylesheet" type="text/css" href="res/css/font.css" media="screen" />
		<link rel="stylesheet" type="text/css" href="res/css/css3.css" media="screen" />
		<link rel="stylesheet" type="text/css" href="res/css/general.css" media="screen" />
		<link rel="stylesheet" type="text/css" href="res/css/grid.css" media="screen" />
		<link rel="stylesheet" type="text/css" href="res/css/style.css" media="screen" />
    </head>

<body>
<div id="horiz_load">
	<div class="bg">&nbsp;</div>
	<div class="loader">&nbsp;</div>
</div>
<header>
	<div id="navbar">
		<div class="logo">
			<img src="res/img/logo.png" alt="NAME" />
			<form class="music_search">
				<input type="text" class="searchval" name="query" value="" /> 
			</form>
		</div>
	</div>
</header>

<section id="main">
		<div id="win_search">
			<div id="searchbar">
				<h1>Search for your favorite artist</h1>
				<form class="music_search">
					<input type="text" class="searchval" name="query" value="" /> 
				</form>
			</div>
			<div class="search_results">
				<h4>Artists:</h4>
				<ul class="artist">
					<li></li>
				</ul>
				<?php 
				/*<h4>Albums:</h4>
				<ul class="release master">
					<li></li>
				</ul>				
				<h4>Labels:</h4>
				<ul class="label">
					<li></li>
				</ul> */
				?>
			</div>
		</div>
		<div id="win_play">
			<div class="row artist_info">
				<h2 class="artist_name"></h2>
				<div class="text">
				</div>
			</div>
			<div class="albums">
				<ul></ul>
			</div>
			<div class="clear"></div>
		</div>
	</section>
</section>

<footer class="player">
	<div class="col col_5 col_nomargin">
		<div id="player"></div>
	</div>
	<div class="now_playing col">
		<h3 class="artist_name"></h3>
		<h3 class="track_name"></h3>
		<div class="play_pause"></div>
		<div class="time"><span class="current_time">00:00</span>/<span class="total_time">00:00</span></div>
		<div class="seekbar"></div>
		</div>
	</div>
</footer>
</body>
</html>
