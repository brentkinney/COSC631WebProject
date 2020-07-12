const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Event = require('./models/event');
const User = require('./models/user');


const app = express();


app.use(bodyParser.json());

app.use(
    '/graphql',
    graphqlHttp({
    schema: buildSchema(`
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        hours: Float!
        date: String!
    }

    type User {
        _id: ID!
        email: String!
        password: String
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
    }

    type RootMutation {
        createEvent(eventInput: EventInput): Event
        createUser(userInput: UserInput): User
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }
    `),
    rootValue: {
        events: async () => {
            try {
                const events = await Event.find();
                return events.map(event => {
                    return { ...event._doc, _id: event.id };
                });
            }
            catch (err) {
                console.log(err);
                throw err;
            }
        },
        createEvent: async args => {
           const event = new Event({
                title: args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                hours: +args.eventInput.hours,
                date: new Date(args.eventInput.date)
           });
            try {
                const result = await event.save();                
                return { ...result._doc, _id: result.id };
            }
            catch (err) {
                console.log(err);
                throw err;
            }            
        }
    },
    createUser: args => {
        return bcrypt
        .hash(args.userInput.password, 12)
        .then(hashedPassword => {
            const user =  new User({
                email: args.userInput.email,
                password: hashedPassword                
            });
            console.log(user.email, user.hashedPassword);
            return user.save();
        })
        .then(result => {
            console.log(result._doc);
            return { ...result._doc, _id: result.id }
        })
        .catch(err => {
            console.log(err);           
            throw err;            
        });        
    },
    graphiql: true
}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cosc631.oc8gy.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`,
{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    app.listen(3000);
}).catch(err => {
    console.log(err);
});

