const mongoose = require('mongoose');

const testprogramSchema = new mongoose.Schema({
    program: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Program',
        required: [true, 'Please select a program to enter your analysis']
    },
    text: {
        type: String,
        required: true,
    },
    sentiment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const TestProgram = mongoose.model('TestProgram', testprogramSchema);

module.exports = TestProgram;
