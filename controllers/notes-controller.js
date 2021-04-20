const Note = require("../models/Note");

const getNotes = async (req, res) => {

    
    try {
        const notes = await Note.find({user: req.uid});
        
        res.status(201).json({
            ok: true,
            notes
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        })
    }
}

const createNote = async (req, res) => {


    const note = new Note(req.body);

    try {

        note.user = req.uid;

        const savedNote = await note.save();

        res.status(201).json({
            ok: true,
            note: savedNote
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }


    
}

const updateNote = async (req, res) => {

    const noteId = req.params.id;

    try {

        const note = await Note.findById(noteId);


        if(!note) {
            return res.status(404).json({
                ok: false,
                msg: 'La nota no existe por ese id'
            });
        }

        if (note.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para editar esta nota'
            });
        }

        const newNote = {...req.body}

        const noteUpdated = await Note.findByIdAndUpdate( noteId, newNote, {new: true});

        res.json({
            ok: true,
            note: noteUpdated
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}

const deleteNote = async (req, res) => {

    const noteId = req.params.id;

    try {

        const note = await Note.findById(noteId);


        if(!note) {
            return res.status(404).json({
                ok: false,
                msg: 'La nota no existe por ese id'
            });
        }

        if (note.user.toString() !== req.uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegios para eliminar esta nota'
            });
        }

        await Note.findByIdAndDelete(noteId);

        res.json({
            ok: true
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }

}

module.exports = {
    getNotes,
    createNote,
    updateNote,
    deleteNote
}