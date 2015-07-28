var expect = require('chai').expect;
var iTunes = require('../index');

describe('iTunes Modules', function() {
  var itunes = new iTunes();
  it('#findSoftware()', function(done) {
    itunes.findSoftware(itunes.SOFTWARE.ALL, {term: 'R.E.V. Robotic'})
      .then(function(results) {
        done();
      }).catch(done);
  });
  describe('#findMusic()', function(done) {
    it('using artist name', function(done) {
      itunes.findMusic(itunes.MUSIC.ARTIST, {term: 'Jack Johnson'})
        .then(function(results) {
          done();
        }).catch(done);
      });
      it('using artist itunes id', function(done) {
        itunes.findMusic(itunes.MUSIC.ARTIST, {id: '909253'})
          .then(function(results) {
            done();
          }).catch(done);
        });
  });
  /*it('#findPodcast()', function(done) {
    itunes.findPodcast({term: 'R.E.V. Robotic'})
      .then(function(results) {
        done();
      }).catch(done);
  });
  it('#findMusicVideo()', function(done) {
    itunes.findMusicVideo({term: 'R.E.V. Robotic'})
      .then(function(results) {
        done();
      }).catch(done);
  });
  it('#findAudioBook()', function(done) {
    itunes.findAudioBook({term: 'R.E.V. Robotic'})
      .then(function(results) {
        done();
      }).catch(done);
  });
  it('#findShortFilm()', function(done) {
    itunes.findShortFilm({term: 'R.E.V. Robotic'})
      .then(function(results) {
        done();
      }).catch(done);
  });
  it('#findTvShow()', function(done) {
    itunes.findTvShow({term: 'R.E.V. Robotic'})
      .then(function(results) {
        done();
      }).catch(done);
  });
  it('#findEBook()', function(done) {
    itunes.findEBook({term: 'R.E.V. Robotic'})
      .then(function(results) {
        done();
      }).catch(done);
  });
  it('#findAll()', function(done) {
    itunes.findAll({term: 'R.E.V. Robotic'})
      .then(function(results) {
        expect(results).to.be.instanceof(Array);
        expect(results).length.to.be.greater(0);
        done();
      }).catch(done);
  });*/
});
