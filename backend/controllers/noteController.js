import Note from "../models/Note.js";

export const addNote = async(req,res) => {
    try {
        const note = await Note.create({
            candidateId: req.body.candidateId,
            status: req.body.status,
            note: req.body.note,
            createdBy: req.user.name
        });
        res.json(note);

    } catch(err) {
        res.status(500).json(err.message);
    }
};

export const getNoteByCandidate = async(req,res) => {
    try {
        const notes = await Note.find({candidateId: req.params.id});

        res.json(notes);

    } catch(err) {
        res.status(500).json(err.message);
    }
};