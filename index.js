var request = require('request');
var Promise = require("bluebird");
var urlLog = require('debug')('itunes::url');
var resultsLog = require('debug')('itunes::results');
var _ = require('underscore');

/*http://www.apple.com/itunes/affiliates/resources/documentation/itunes-store-web-service-search-api.html#searching
https://itunes.apple.com/lookup?id=968261465*/

function iTunes(options) {
  this.options = _.extend({
    searchApiEndPoint: 'https://itunes.apple.com/search',
    lookupApiEndPoint: 'https://itunes.apple.com/lookup',
    allowedParams: {
      search: ['term','country','attribute','limit','lang','version','explicit'],
      lookup: ['id','bundleId'],
    },
    defaults: {
      country: 'US',
      version: 2,
    }
  }, options);
  this.Promise = Promise;
}

iTunes.prototype._sanitize = function(type, params) {
  var returnObj = {};
  if (typeof params !== 'object') {
    return {};
  }
  return _.extend(_.pick(params, this.options.allowedParams[type]), this.options.defaults);
}

iTunes.prototype._request = function(endPoint, params) {
  var url = require('url').parse(endPoint + '?' + require('querystring').stringify(params));
  urlLog(url.href);
  return new this.Promise(function(resolve, reject) {
    request(url.href, function(err, response, body) {
      if (err) {
        reject(err);
      } else {
        body = JSON.parse(body);
        var results = body['results'] || [];
        resultsLog(results);
        resolve(results);
      }
    });
  });
}

/** ENUMS **/
iTunes.prototype.SOFTWARE = {
  ALL: 'software',
  IPAD: 'iPadSoftware',
  MAC: 'macSoftware',
}
iTunes.prototype.TV_SHOW = {
  EPISODE: 'tvEpisode',
  SEASON: 'tvSeason',
}
iTunes.prototype.MOVIE = {
  ARTIST: 'movieArtist',
  NAME: 'movie',
}
iTunes.prototype.PODCAST = {
  AUTHOR: 'podcastAuthor',
  NAME: 'podcast',
}
iTunes.prototype.MUSIC = {
  ARTIST: 'musicArtist',
  TRACK: 'musicTrack',
  ALBUM: 'album',
  VIDEO: 'musicVideo',
  MIX: 'mix',
  SONG: 'song'
}
iTunes.prototype.MUSIC_VIDEO = {
  ARTIST: 'musicArtist',
  VIDEO: 'musicVideo',
}
iTunes.prototype.AUDIO_BOOK = {
  AUTHOR: 'audiobookAuthor',
  NAME: 'audiobook',
}
iTunes.prototype.SHORT_FILM = {
  ARTIST: 'shortFilmArtist',
  NAME: 'shortFilm',
}
iTunes.prototype.SHORT_FILM = {
  ARTIST: 'shortFilmArtist',
  NAME: 'shortFilm',
}
iTunes.prototype.ALL = {
  MOVIES: 'movie',
  ALBUMS: 'album',
  ARTISTS: 'allArtist',
  PODCASTS: 'podcast',
  MUSIC_VIDEOS: 'musicVideo',
  MIXES: 'mix',
  AUDIO_BOOKS: 'audiobook',
  TV_SEASONS: 'tvSeason',
  TRACKS: 'allTrack',
}

iTunes.prototype.lookupSoftware = function(params) {
  return this._request(this.options.lookupApiEndPoint, _.extend(this._sanitize('lookup', params)));
}

iTunes.prototype.searchSoftware = function(params) {
  return this._request(this.options.searchApiEndPoint, _.extend(this._sanitize('search', params), {media: 'software'}));
}

iTunes.prototype.searchMusic = function(type, params) {
  return this._request(this.options.searchApiEndPoint, _.extend(this._sanitize('search', params), {media: 'music', entity: type || this.MUSIC.SONG}));
}

iTunes.prototype.searchPodcast = function(type, params) {
  return this._request(this.options.searchApiEndPoint, _.extend(this._sanitize('search', params), {media: 'podcast'}));
}

iTunes.prototype.searchMusicVideo = function(type, params) {
  return this._request(this.options.searchApiEndPoint, _.extend(this._sanitize('search', params), {media: 'musicVideo'}));
}

iTunes.prototype.searchAudioBook = function(params) {
  return this._request(this.options.searchApiEndPoint, _.extend(this._sanitize('search', params), {media: 'audiobook'}));
}

iTunes.prototype.searchShortFilm = function(type, params) {
  return this._request(this.options.searchApiEndPoint, _.extend(this._sanitize('search', params), {media: 'shortFilm'}));
}

iTunes.prototype.searchTvShow = function(type, params) {
  return this._request(this.options.searchApiEndPoint, _.extend(this._sanitize('search', params), {media: 'tvShow'}));
}

iTunes.prototype.searchEBook = function(type, params) {
  return this._request(this.options.searchApiEndPoint, _.extend(this._sanitize('search', params), {media: 'ebook', entity: ebook}));
}

iTunes.prototype.searchAll = function(type, params) {
  return this._request(this.options.searchApiEndPoint, _.extend(this._sanitize('search', params), {media: 'all'}));
}

// As we want to use the spread function, we set it on any third party promise that's attached
Object.defineProperty(this, 'Promise', { set: function(newPromise) {
    this.Promise = newPromise;
    if (!this.Promise.prototype.spread) {
        this.Promise.prototype.spread = function (fn) {
            return this.then(function (args) {
                return this.Promise.all(args); // wait for all
            }).then(function(args){
             //this is always undefined in A+ complaint, but just in case
                return fn.apply(this, args);
            });

        };
    }
  }
});

module.exports = iTunes;
