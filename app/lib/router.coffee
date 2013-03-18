module.exports = Backbone.Router.extend
  routes:
    '': 'index'
    'artist/:id': 'renderArtist'

  index: ->
    @subpage 'index'

  renderArtist: (id) ->
    @subpage 'artist', id

  #set current view and render in layouts $content-part
  subpage: (name) ->
    app.events.trigger "page:render", name
