View = require('./view')

module.exports = class Index extends View
  template: require('./templates/index')
  parts: {}
  events: 
  	"submit #search": "search"

  #on dom ready
  bootstrap: ->
  	console.log "index!"

  search: (event) ->
  	event.preventDefault()

  	app.api.search @$("#search").find("input").val(), (result) =>
  		resultTemplate = require('./templates/result')

  		data = 
  			result: result

  		@$("#results").html resultTemplate(data)