var request = require('request');
var Promise = require("bluebird");
var debug = require('debug')('itunes');
var urlDebug = require('debug')('itunes::url');
var _ = require('underscore');

/*http://www.apple.com/itunes/affiliates/resources/documentation/itunes-store-web-service-search-api.html#searching
https://itunes.apple.com/lookup?id=968261465*/

function iTunes(options) {
  this.options = _.extend({
    apiEndPoint: 'https://itunes.apple.com/search',
    allowedParams: ['term','country','attribute','limit','lang','version','explicit'],
    defaults: {
      country: 'US',
      language: 'en_us',
      version: 2,
      explicit: 'Yes',
      limit: 50,
    }
  }, options);
  this.Promise = Promise;
}

iTunes.prototype._sanitize = function(params) {
  var returnObj = {};
  if (typeof params !== 'object') {
    return {};
  }
  return _.extend(_.pick(params, this.options.allowedParams), this.options.defaults);
}

iTunes.prototype._getUrl = function(query) {
  var apiEndPoint = this.options.apiEndPoint;
  var url = require('url').parse(apiEndPoint + '?' + require('querystring').stringify(query));
  return url.href;
}

iTunes.prototype._request = function(params) {
  var url = this._getUrl(params);
  urlDebug(url);
  return new this.Promise(function(resolve, reject) {
    request(url, function(err, response, body) {
      if (err) {
        reject(err);
      } else {
        body = JSON.parse(body);
        resolve(body['results'] || []);
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

iTunes.prototype.findSoftware = function(type, params) {
  return this._request(_.extend(this._sanitize(params), {media: 'software', entity: type || this.SOFTWARE.ALL}));
}

iTunes.prototype.findMusic = function(type, params) {
  return this._request(_.extend(this._sanitize(params), {media: 'music', entity: type || this.MUSIC.SONG}));
}

iTunes.prototype.findPodcast = function(type, params) {
  return this._request(_.extend(this._sanitize(params), {media: 'podcast'}));
}

iTunes.prototype.findMusicVideo = function(type, params) {
  return this._request(_.extend(this._sanitize(params), {media: 'musicVideo'}));
}

iTunes.prototype.findAudioBook = function(params) {
  return this._request(_.extend(this._sanitize(params), {media: 'audiobook'}));
}

iTunes.prototype.findShortFilm = function(type, params) {
  return this._request(_.extend(this._sanitize(params), {media: 'shortFilm'}));
}

iTunes.prototype.findTvShow = function(type, params) {
  return this._request(_.extend(this._sanitize(params), {media: 'tvShow'}));
}

iTunes.prototype.findEBook = function(type, params) {
  return this._request(_.extend(this._sanitize(params), {media: 'ebook', entity: ebook}));
}

iTunes.prototype.findAll = function(type, params) {
  return this._request(_.extend(this._sanitize(params), {media: 'all'}));
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
