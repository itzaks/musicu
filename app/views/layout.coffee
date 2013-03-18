View = require('./view')

# Application frame
module.exports = class Application extends View
  tagName: "body"
  parts: {}

  bootstrap: ->
  	@listenTo app.events, "page:render", (which) ->
  		view = new View = require "views/#{ which }"
  		@parts.content.html view.render().el


  #on dom ready
  initialize: ->
    @parts.content = @$("#content")
    super()

    console.log @parts