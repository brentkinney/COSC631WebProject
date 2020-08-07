const { buildSchema} = require('graphql');

module.exports = buildSchema(`
type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    hours: Float!
    date: String!
    createdBy: User!
}

type User {
    _id: ID!
    email: String!
    password: String
    createdEvents: [Event!]
}

type LoginData {
    userId: ID!
    token: String!
    tokenExpiration: Int!
}

input EventInput {
    title: String!
    description: String!
    price: Float!
    hours: Float!
    date: String! 
}

input UserInput {
    email: String!
    password: String!
}

type RootQuery {
    events: [Event!]!
    login(email: String!, password: String!): LoginData!
}

type RootMutation {       
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    deleteEvent(eventId: ID!): Event!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)