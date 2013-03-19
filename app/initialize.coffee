class Application 
  views: {}
  routers: {}
  events: {}
  constructor: ->
    @api = new API = require('lib/api')
    @router = new Router = require 'lib/router'

    @events = _.extend @events, Backbone.Events

  init: ->
    @chrome()
    @player = new Player = require 'views/player'

    console.log "hey from app"

  chrome: ->
    @layout = new Layout = require 'views/layout'
    @layout.setElement $("#application")

$ ->
  root = if location.href.indexOf('localhost') isnt -1 then '' else '/musicu'
  app.init()
  Backbone.history.start
    pushState: yes
    root: root

@app = new Application