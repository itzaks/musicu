(function(/*! Brunch !*/) {
  'use strict';

  var globals = typeof window !== 'undefined' ? window : global;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};

  var has = function(object, name) {
    return ({}).hasOwnProperty.call(object, name);
  };

  var expand = function(root, name) {
    var results = [], parts, part;
    if (/^\.\.?(\/|$)/.test(name)) {
      parts = [root, name].join('/').split('/');
    } else {
      parts = name.split('/');
    }
    for (var i = 0, length = parts.length; i < length; i++) {
      part = parts[i];
      if (part === '..') {
        results.pop();
      } else if (part !== '.' && part !== '') {
        results.push(part);
      }
    }
    return results.join('/');
  };

  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var dir = dirname(path);
      var absolute = expand(dir, name);
      return globals.require(absolute);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    definition(module.exports, localRequire(name), module);
    var exports = cache[name] = module.exports;
    return exports;
  };

  var require = function(name) {
    var path = expand(name, '.');

    if (has(cache, path)) return cache[path];
    if (has(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has(cache, dirIndex)) return cache[dirIndex];
    if (has(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '"');
  };

  var define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  globals.require = require;
  globals.require.define = define;
  globals.require.register = define;
  globals.require.brunch = true;
})();

window.require.register("index.static", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<!DOCTYPE html><html><head><meta charset="utf-8"><meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1"><title>Pipe</title><link rel="stylesheet" href="stylesheets/app.css"><link rel="stylesheet" href="stylesheets/vendor.css"><script>window.brunch = window.brunch || {};\nwindow.brunch[\'auto-reload\'] = {enabled: true};\n</script><script src="javascripts/vendor.js"></script><script src="javascripts/app.js"></script><script>require(\'initialize\')\n</script></head><body id="application"><div class="container"><div class="row"><div class="navbar navbar-inverse"><div class="navbar-inner"><div class="container"><button type="button" data-toggle="collapse" data-target=".nav-collapse" class="btn btn-navbar"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></button><div class="nav-collapse collapse"><ul class="nav"><li class="active"><a href="#">PIPE</a></li><li><a href="#">About</a></li></ul></div></div></div></div></div><div class="row"><div class="span3"><div id="player"><div id="ytapiplayer">You need Flash player 8+ and JavaScript enabled to view this video.</div></div></div><div class="span9"><div id="content"></div><!--layout partials goes here--></div></div></div></body></html>');
  }
  return buf.join("");
  };
});
window.require.register("initialize", function(exports, require, module) {
  var Application;

  Application = (function() {
    Application.prototype.views = {};

    Application.prototype.routers = {};

    Application.prototype.events = {};

    function Application() {
      var API, Router;

      this.api = new (API = require('lib/api'));
      this.router = new (Router = require('lib/router'));
      this.events = _.extend(this.events, Backbone.Events);
    }

    Application.prototype.init = function() {
      var Player;

      this.chrome();
      this.player = new (Player = require('views/player'));
      return console.log("hey from app");
    };

    Application.prototype.chrome = function() {
      var Layout;

      this.layout = new (Layout = require('views/layout'));
      return this.layout.setElement($("#application"));
    };

    return Application;

  })();

  $(function() {
    var root;

    root = location.href.indexOf('localhost') !== -1 ? '' : '/musicu';
    app.init();
    return Backbone.history.start({
      pushState: true,
      root: root
    });
  });

  this.app = new Application;
  
});
window.require.register("lib/api", function(exports, require, module) {
  var API;

  module.exports = API = (function() {
    API.prototype.queries = {
      search: function() {
        return "http://query.yahooapis.com/v1/public/yql?format=json&diagnostics=false&callback=?&q=";
      }
    };

    function API() {
      console.log("hey from API	");
    }

    API.prototype.generateQuery = function(term) {
      var limit;

      limit = 10;
      "search?f=json&callback=?&q=" + term;
      return "select * from music.artist.search where keyword='" + term + "'";
    };

    API.prototype.search = function(term, callback) {
      var getURL;

      if (callback == null) {
        callback = $.noop;
      }
      console.log("api:search", term);
      getURL = this.queries["search"]() + this.generateQuery(term);
      return $.getJSON(getURL, function(data) {
        var artists, result;

        result = data.query.results;
        artists = result.Artist;
        if (artists.length === void 0) {
          artists = [artists];
        }
        return callback(artists);
      });
    };

    return API;

  })();
  
});
window.require.register("lib/router", function(exports, require, module) {
  module.exports = Backbone.Router.extend({
    routes: {
      '': 'index',
      'artist/:id': 'renderArtist'
    },
    index: function() {
      return this.subpage('index');
    },
    renderArtist: function(id) {
      return this.subpage('artist', id);
    },
    subpage: function(name) {
      return app.events.trigger("page:render", name);
    }
  });
  
});
window.require.register("models/collection", function(exports, require, module) {
  module.exports = Backbone.Collection.extend({});
  
});
window.require.register("models/model", function(exports, require, module) {
  module.exports = Backbone.Model.extend({});
  
});
window.require.register("views/index", function(exports, require, module) {
  var Index, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('./view');

  module.exports = Index = (function(_super) {
    __extends(Index, _super);

    function Index() {
      _ref = Index.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Index.prototype.template = require('./templates/index');

    Index.prototype.parts = {};

    Index.prototype.events = {
      "submit #search": "search"
    };

    Index.prototype.bootstrap = function() {
      return console.log("index!");
    };

    Index.prototype.search = function(event) {
      var _this = this;

      event.preventDefault();
      return app.api.search(this.$("#search").find("input").val(), function(result) {
        var data, resultTemplate;

        resultTemplate = require('./templates/result');
        data = {
          result: result
        };
        return _this.$("#results").html(resultTemplate(data));
      });
    };

    return Index;

  })(View);
  
});
window.require.register("views/layout", function(exports, require, module) {
  var Application, Player, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('./view');

  Player = require('./player');

  module.exports = Application = (function(_super) {
    __extends(Application, _super);

    function Application() {
      _ref = Application.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Application.prototype.tagName = "body";

    Application.prototype.parts = {};

    Application.prototype.bootstrap = function() {
      return this.listenTo(app.events, "page:render", function(which) {
        var view;

        view = new (View = require("views/" + which));
        return this.parts.content.html(view.render().el);
      });
    };

    Application.prototype.initialize = function() {
      Application.__super__.initialize.call(this);
      this.parts.content = this.$("#content");
      return console.log(this.parts);
    };

    return Application;

  })(View);
  
});
window.require.register("views/player", function(exports, require, module) {
  var Player;

  module.exports = Player = (function() {
    function Player() {
      console.log("player init");
      this.swf = $('#ytapiplayer');
      this.swf.flash({
        swf: 'http://www.youtube.com/v/rFY1AF4r3Ts',
        width: 320,
        height: 240
      });
      this.loadUrl("http://www.youtube.com/v/vjMTgQYZPgI");
    }

    Player.prototype.loadUrl = function(url) {
      var id;

      id = url.replace("http://www.youtube.com/v/", "");
      id.replace("?f=videos&app=youtube_gdata", "");
      return this.swf.flash(function() {
        console.log("lol load");
        this.loadVideoById(id, 0, "large");
        return this.playVideo();
      });
    };

    return Player;

  })();
  
});
window.require.register("views/templates/index", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="row"><h3>Search artist:</h3><form id="search"><input type="text" placeholder="Artist, album" class="input-xxlarge search"/></form></div><div class="row"><ul id="results"></ul></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/templates/result", function(exports, require, module) {
  module.exports = function anonymous(locals, attrs, escape, rethrow, merge) {
  attrs = attrs || jade.attrs; escape = escape || jade.escape; rethrow = rethrow || jade.rethrow; merge = merge || jade.merge;
  var buf = [];
  with (locals || {}) {
  var interp;
  buf.push('<div class="row"><h4>Search results</h4><ul class="results">');
  // iterate result
  ;(function(){
    if ('number' == typeof result.length) {

      for (var $index = 0, $$l = result.length; $index < $$l; $index++) {
        var item = result[$index];

  buf.push('<li><a');
  buf.push(attrs({ 'href':('/artist/' + (item.id) + '') }, {"href":true}));
  buf.push('>');
  var __val__ = item.name
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</a></li>');
      }

    } else {
      var $$l = 0;
      for (var $index in result) {
        $$l++;      var item = result[$index];

  buf.push('<li><a');
  buf.push(attrs({ 'href':('/artist/' + (item.id) + '') }, {"href":true}));
  buf.push('>');
  var __val__ = item.name
  buf.push(escape(null == __val__ ? "" : __val__));
  buf.push('</a></li>');
      }

    }
  }).call(this);

  buf.push('</ul></div>');
  }
  return buf.join("");
  };
});
window.require.register("views/view", function(exports, require, module) {
  var View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  module.exports = View = (function(_super) {
    __extends(View, _super);

    function View() {
      _ref = View.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    View.prototype.debug = false;

    View.prototype.startDebugging = function() {
      this.on("" + this.cid + ":initialize", function() {
        return console.debug("Initialized " + this.name, this);
      });
      this.on("" + this.cid + ":render", function() {
        return console.debug("Rendered " + this.name, this);
      });
      this.on("" + this.cid + ":update", function() {
        return console.debug("Updated " + this.name, this);
      });
      return this.on("" + this.cid + ":destroy", function() {
        return console.debug("Destroyed " + this.name, this);
      });
    };

    View.prototype.type = 'view';

    View.prototype.name = null;

    View.prototype.autoRender = false;

    View.prototype.rendered = false;

    View.prototype.template = function() {
      return '';
    };

    View.prototype.html = function(dom) {
      this.$el.html(dom);
      this.trigger("" + this.cid + ":" + (this.rendered ? 'update' : 'render'), this);
      return this.$el;
    };

    View.prototype.append = function(dom) {
      this.$el.append(dom);
      this.trigger("" + this.cid + ":" + (this.rendered ? 'update' : 'render'), this);
      return this.$el;
    };

    View.prototype.prepend = function(dom) {
      this.$el.prepend(dom);
      this.trigger("" + this.cid + ":" + (this.rendered ? 'update' : 'render'), this);
      return this.$el;
    };

    View.prototype.after = function(dom) {
      this.$el.after(dom);
      this.trigger("" + this.cid + ":update", this);
      return this.$el;
    };

    View.prototype.before = function(dom) {
      this.$el.after(dom);
      this.trigger("" + this.cid + ":update", this);
      return this.$el;
    };

    View.prototype.css = function(css) {
      this.$el.css(css);
      this.trigger("" + this.cid + ":update", this);
      return this.$el;
    };

    View.prototype.find = function(selector) {
      return this.$el.find(selector);
    };

    View.prototype.delegate = function(event, selector, handler) {
      if (arguments.length === 2) {
        handler = selector;
      }
      handler = handler.bind(this);
      if (arguments.length === 2) {
        return this.$el.on(event, handler);
      } else {
        return this.$el.on(event, selector, handler);
      }
    };

    View.prototype.bootstrap = function() {};

    View.prototype.initialize = function() {
      this.bootstrap();
      this.name = this.name || this.constructor.name;
      if (this.debug === true) {
        this.startDebugging();
      }
      if (this.autoRender === true) {
        this.render();
      }
      return this.trigger("" + this.cid + ":initialize", this);
    };

    View.prototype.getRenderData = function() {
      var _ref1;

      return (_ref1 = this.model) != null ? _ref1.toJSON() : void 0;
    };

    View.prototype.render = function() {
      this.trigger("" + this.cid + ":render:before", this);
      this.$el.attr('data-cid', this.cid);
      this.html(this.template(this.getRenderData()));
      this.rendered = true;
      this.trigger("" + this.cid + ":render:after", this);
      return this;
    };

    View.prototype.destroy = function(keepDOM) {
      var _ref1;

      if (keepDOM == null) {
        keepDOM = false;
      }
      this.trigger("" + this.cid + ":destroy:before", this);
      if (keepDOM) {
        this.dispose();
      } else {
        this.remove();
      }
      if ((_ref1 = this.model) != null) {
        _ref1.destroy();
      }
      return this.trigger("" + this.cid + ":destroy:after", this);
    };

    return View;

  })(Backbone.View);
  
});
