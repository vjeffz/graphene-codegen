import generatePythonStr from "../generatePythonStr"

// taken from an apollo tutorial
const sdlStr = `
type Query {
  launches(
    """
    The number of results to show. Must be >= 1. Default = 20
    """
    pageSize: Int
    """
    If you add a cursor here, it will only return results _after_ this cursor
    """
    after: String
  ): LaunchConnection!
  launch(id: ID!): Launch
  me: User
}
type Mutation {
  # if false, signup failed -- check errors
  bookTrips(launchIds: [ID]!): TripUpdateResponse!
  bookTrip(tripInfo: LongTripInput): TripUpdateResponse!
  # if false, cancellation failed -- check errors
  cancelTrip(launchId: ID!): TripUpdateResponse!
  """
  login token
  """
  login(email: String): String
}
input LongTripInput {
  launchId: ID!
  time_in_space: Lightyear
}
type TripUpdateResponse {
  success: Boolean!
  message: String
  launches: [Launch]
}
"""
Simple wrapper around our list of launches that contains a cursor to the
last item in the list. Pass this cursor to the launches query to fetch results
after these.
"""
type LaunchConnection {
  cursor: String!
  hasMore: Boolean!
  launches: [Launch]!
}
type Launch {
  id: ID!
  site: String
  mission: Mission
  rocket: Rocket
  isBooked: Boolean!
}
"""
A better way to measure how far rockets go.
"""
scalar Lightyear
type Rocket {
  id: ID!
  name: String
  type: String
}
type User {
  id: ID!
  email: String!
  trips: [Launch]!
}
type Mission {
  name: String
  destination: Destination
  missionPatch(size: PatchSize): String
}
enum PatchSize {
  SMALL
  LARGE
}
interface Planet {
  name: String!
  moonNames: [String!]
}
type RockyPlanet implements Planet {
  name: String!
  moonNames: [String!]
  density: Float
}
type GasPlanet implements Planet {
  name: String!
  moonNames: [String!]
  coreWidth: Int
}
type AsteroidBelt {
  numAsteroids: Int
}
union Destination = RockyPlanet | GasPlanet | AsteroidBelt
schema {
  query: Query
  mutation: Mutation
}
`

it("generates stable python code", () => {
  expect(generatePythonStr(sdlStr)).toMatchSnapshot()
})
