module.exports = class Player
  #on dom ready
  constructor: ->
    console.log "player init"
    @swf = $('#ytapiplayer')
    @swf.flash swf: 'http://www.youtube.com/apiplayer?enablejsapi=1&version=3'
    @loadUrl "http://www.youtube.com/v/vjMTgQYZPgI"
    

  loadUrl: (url) ->
    id = url.replace("http://www.youtube.com/v/", "")
    id.replace("?f=videos&app=youtube_gdata", "")

    @swf.flash ->
      console.log "lol load"
      @loadVideoById(id, 0, "large")
      @playVideo()
