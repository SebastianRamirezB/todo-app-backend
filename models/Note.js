const {Schema, model} = require('mongoose');



const NoteSchema = Schema({
    text: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    
});

NoteSchema.method('toJSON', function() {
    const { __v, _id, ...object} = this.toObject();
    object.id = _id;
    return object;
});


module.exports = model('Note', NoteSchema);