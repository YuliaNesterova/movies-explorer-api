const Movie = require('../models/movie');
const BadRequestErr = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const ForbiddenErr = require("../errors/forbidden-err");

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => res.status(200).send(movies))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description,
    image, trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestErr('Введены невалидные данные');
      }
    })
    .catch(next);
};

module.exports.deleteMovieById = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Нет фильма с таким id');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenErr('Нет прав, нельзя удалять карточки других пользователей');
      }

      Movie.findByIdAndDelete(req.params.movieId)
        .then((deletedMovie) => res.status(200).send(deletedMovie));
    })
    .catch(next);
};
