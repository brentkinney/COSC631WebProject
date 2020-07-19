const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return {
                ...event._doc,
                _id: event.id,
                date: new Date(event._doc.date).toISOString(),
                createdBy: user.bind(this, event.createdBy)
            };
        });
    }
    catch (err) {
        throw err;
    }
};

const user = async userId => {
    try {
        const user = await User.findById(userId);
        return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
        };
    }
    catch (err) {
        throw err;
    }
};

module.exports = {
    events: async () => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return { 
                    ...event._doc, 
                    _id: event.id,
                    date: new Date(event._doc.date).toISOString(),
                    createdBy: user.bind(this, event._doc.createdBy)
                };
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
          date: new Date(args.eventInput.date),
          createdBy: '5f1390f8c363182d08102885'
        });
        let createdEvent;
        try {
            const result = await event
                .save();
            createdEvent = {
                ...result._doc,
                _id: result.id,
                date: new Date(event._doc.date).toISOString(),
                createdBy: user.bind(this, result._doc.createdBy)
            };
            const createdBy = await User.findById('5f0b95973188533ae0870a45');
            if (!createdBy) {
                throw new Error('User not found.');
            }
            createdBy.createdEvents.push(event);
            const result_1 = await createdBy.save();
            return createdEvent;
        }
        catch (err) {
            console.log(err);
            throw err;
        }
      },

    createUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email });
            if (existingUser) {
                throw new Error('There is already an account with this email address');
            }
            const hashedPassword = await bcrypt
                .hash(args.userInput.password, 12);
            const user = new User({
                email: args.userInput.email,
                password: hashedPassword
            });
            const result = await user.save();
            return { ...result._doc, password: null, _id: result.id };
        }
        catch (err) {
            console.log(err);
            throw err;
        }        
    }
}