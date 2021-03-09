const graphql = require('graphql')

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = graphql
const Movies = require('../models/movie')
const Directors = require('../models/director')

// const movies = [
//   {name: 'Pulp Fiction', genre: 'Crime', directorId:},
//   {name: '1984', genre: 'Sci-Fi', directorId:},
//   {name: 'V for vendetta', genre: 'Sci-Fi-Triller', directorId:},
//   {name: 'Snatch', genre: 'Crime-Comedy', directorId:},
//   {name: 'Reservoir Dogs', genre: 'Crime', directorId:},
//   {name: 'The Hateful Eight', genre: 'Crime', directorId:},
//   {name: 'Inglourious Basterds', genre: 'Crime', directorId:},
//   {name: 'Lock, Stock and Two Smoking Barrels', genre: 'Crime-Comedy', directorId:}
// ]
// const moviesJson = [
//   {"name": "Pulp Fiction", "genre": "Crime", "directorId": "6047607c56758742d8ca3f29"}, //60474300a6a3ed0064918bac
//   {"name": "1984", "genre": "Sci-Fi", "directorId": "604760dc56758742d8ca3f2a"},
//   {"name": "V for vendetta", "genre": "Sci-Fi-Triller", "directorId": "6047610356758742d8ca3f2b"},
//   {"name": "Snatch", "genre": "Crime-Comedy", "directorId": "6047614e56758742d8ca3f2c"},
//   {"name": "Reservoir Dogs", "genre": "Crime", "directorId": "6047607c56758742d8ca3f29"},
//   {"name": "The Hateful Eight", "genre": "Crime", "directorId": "6047607c56758742d8ca3f29"},
//   {"name": "Inglourious Basterds", "genre": "Crime", "directorId": "6047607c56758742d8ca3f29"},
//   {"name": "Lock, Stock and Two Smoking Barrels", "genre": "Crime-Comedy", "directorId": "6047614e56758742d8ca3f2c"}
//   {"name": "Test name", "genre": "Test genre", "directorId": "6047614e56758742d8ca3f2c"}
// ]
//
// const directorsJson = [
//   {"name": "Quentin Tarantino", "age": 55},
//   {"name": "Michael Radford", "age": 72},
//   {"name": "James McTeigue", "age": 51},
//   {"name": "Guy Ritchie", "age": 55}
//   {"name": "Test", "age": 55}
// ]

const MovieType = new GraphQLObjectType({
  name: 'Movie',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: new GraphQLNonNull(GraphQLString)},
    genre: {type: new GraphQLNonNull(GraphQLString)},
    director: {
      type: DirectorType,
      resolve: (parent, args) => {
        // return directors.find(director => director.id === movie.directorId)
        return Directors.findById(parent.directorId)
      }
    }
  })
})

const DirectorType = new GraphQLObjectType({
  name: 'Director',
  fields: () => ({
    id: {type: GraphQLID},
    name: {type: new GraphQLNonNull(GraphQLString)},
    age: {type: new GraphQLNonNull(GraphQLInt)},
    movies: {
      type: new GraphQLList(MovieType),
      resolve: (parent, args) => {
        // return movies.filter(movie => movie.directorId === director.id)
        return Movies.find({directorId: parent.id})
      }
    }
  })
})

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addDirector: {
      type: DirectorType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve: (parent, args) => {
        const director = new Directors({
          name: args.name,
          age: args.age
        });
        return director.save()
      }
    },
    addMovie: {
      type: MovieType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        genre: {type: new GraphQLNonNull(GraphQLString)},
        directorId: {type: GraphQLString}
      },
      resolve: (parent, args) => {
        const movie = new Movies({
          name: args.name,
          genre: args.genre,
          directorId: args.directorId
        });
        return movie.save()
      }
    },
    deleteDirector: {
      type: DirectorType,
      args: {id: {type: GraphQLID}},
      resolve: (parent, args) => {
        return Directors.findByIdAndRemove(args.id)
      }
    },
    deleteMovie: {
      type: MovieType,
      args: {id: {type: GraphQLID}},
      resolve: (parent, args) => {
        return Movies.findByIdAndRemove(args.id)
      }
    },
    updateDirector: {
      type: DirectorType,
      args: {
        id: {type: GraphQLID},
        name: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve: (parent, args) => {
        return Directors.findByIdAndUpdate(
          args.id,
          {$set: {name: args.name, age: args.age}},
          {new: true}
        )
      }
    },
    updateMovie: {
      type: MovieType,
      args: {
        id: {type: GraphQLID},
        name: {type: new GraphQLNonNull(GraphQLString)},
        genre: {type: new GraphQLNonNull(GraphQLString)},
        directorId: {type: GraphQLString}
      },
      resolve: (parent, args) => {
        return Movies.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              genre: args.genre,
              directorId: args.directorId
            }
          },
          {new: true}
        )
      }
    }
  }
})

const Query = new GraphQLObjectType({
  name: 'Query',
  fields: {
    movie: {
      type: MovieType,
      args: {id: {type: GraphQLID}},
      resolve: (parent, args) => {
        // return movies.find(movie => movie.id === args.id)
        return Movies.findById(args.id)
      }
    },
    director: {
      type: DirectorType,
      args: {id: {type: GraphQLID}},
      resolve: (parent, args) => {
        // return directors.find(director => director.id === args.id)
        return Directors.findById(args.id)
      }
    },
    movies: {
      type: new GraphQLList(MovieType),
      resolve: (parent, args) => {
        return Movies.find({})
      }
    },
    directors: {
      type: new GraphQLList(DirectorType),
      resolve: (parent, args) => {
        return Directors.find({})
      }
    }
  }
})

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation
})