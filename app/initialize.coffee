class Application 
  views: {}
  routers: {}
  events: {}
  constructor: ->
    @api = new API = require('lib/api')
    @events = _.extend @events, Backbone.Events

    #root
    @root = if window.location.href.indexOf('localhost') != -1 then '' else '/musicu'

    @router = new Router = require 'lib/router'

  init: ->

    @chrome()

  chrome: ->
    Layout = require 'views/layout'
    @layout = new Layout(el: $("#application"))

$ ->
  app.init()
  Backbone.history.start(pushState: yes)

@app = new Application