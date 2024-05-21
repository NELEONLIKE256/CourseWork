const { model, Schema } = require('mongoose');

const categorySchema = new Schema({
    category: {
        type: String,
        required: true,
    }
}, { timestamps: true, versionKey: false });

const findSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    photo: {
        type: String,
        required: true,
    },
    whereWasFound: {
        type: String,
        required: true,
    },
    id_category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    dateOfFinding: {
        type: Date,
        required: true
    },
    id_location: {
        type: Schema.Types.ObjectId,
        ref: 'Location',
        required: true,
    }
}, { timestamps: true, versionKey: false });

const locationSchema = new Schema({
    country: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    }
}, { timestamps: true, versionKey: false });

const Category = model('Category', categorySchema);
const Find = model('Find', findSchema);
const Location = model('Location', locationSchema);

module.exports = { Category, Find, Location };
