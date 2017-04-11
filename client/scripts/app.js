var Movie = Backbone.Model.extend({
 
  defaults: {
    like: true
  },

  toggleLike: function() {
    this.set('like', this.get('like') ? false : true );
  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function(title, year, rating) {

    this.set({'title': title, 'year': year, 'rating': rating});

    this.on('change', function(e) {
      this.sortByField();
    });

  },

  comparator: 'title',

  sortByField: function(field = this.comparator) {
    this.comparator = field;
    this.sort(field);
  },

  events: {
    'change:comparator': 'sortByField'
  }

});

var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);
  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function(e) {
    this.model.on('change', function(e) {
      this.render();
    }, this);
  },

  events: {
    'click button': 'handleClick'
  },

  handleClick: function() {
    this.model.toggleLike();
  },

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {
    this.collection.on('sort', function(e) {
      this.render();
    }, this);
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }

});
