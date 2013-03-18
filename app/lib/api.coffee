module.exports = class API
	queries:
		search: ->
			"http://query.yahooapis.com/v1/public/yql?format=json&diagnostics=false&callback=?&q="

	constructor: ->
		console.log "hey from API	"

	generateQuery: (term) ->
		limit = 10
		"search?f=json&callback=?&q=#{ term }"
		
		"select * from music.artist.search where keyword='#{ term }'"

	search: (term, callback = $.noop) ->
		console.log "api:search", term

		getURL = @queries["search"]() + @generateQuery term

		$.getJSON getURL, (data) ->
			result = data.query.results
			artists = result.Artist
			artists = [artists] if artists.length is undefined

			callback(artists)
