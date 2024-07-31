import React, { useState, useEffect } from 'react';
import { firestore, auth, serverTimestamp } from './firebaseConfig';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

const Notes = () => {
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [category, setCategory] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [editingNote, setEditingNote] = useState(null);
    const [editText, setEditText] = useState('');
    const [showHistory, setShowHistory] = useState({});

    useEffect(() => {
        const user = auth.currentUser;
        if (!user) {
            console.error('No user is signed in');
            return;
        }

        const notesCollection = collection(firestore, 'notes');
        const q = query(notesCollection, where('userId', '==', user.uid));

        const unsubscribe = onSnapshot(q, snapshot => {
            const notesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setNotes(notesData);
        });

        return unsubscribe;
    }, []);

    const handleAddNote = async () => {
        const user = auth.currentUser;
        if (!user) {
            console.error('No user is signed in');
            return;
        }

        const notesCollection = collection(firestore, 'notes');
        const newNoteData = {
            text: newNote,
            category,
            userId: user.uid,
            createdAt: serverTimestamp()
        };

        const newNoteDoc = await addDoc(notesCollection, newNoteData);

        const noteDoc = doc(firestore, 'notes', newNoteDoc.id);
        await updateDoc(noteDoc, {
            history: [newNote]
        });

        setNewNote('');
        setCategory('');
    };

    const handleDeleteNote = async (id) => {
        const noteDoc = doc(firestore, 'notes', id);
        await deleteDoc(noteDoc);
    };

    const handleEditNote = (note) => {
        setEditingNote(note);
        setEditText(note.text);
        setCategory(note.category);
    };

    const handleUpdateNote = async () => {
        const noteDoc = doc(firestore, 'notes', editingNote.id);
        const updatedHistory = Array.isArray(editingNote.history) ? [...editingNote.history, editText] : [editText];
        await updateDoc(noteDoc, {
            text: editText,
            category,
            history: updatedHistory
        });

        setEditingNote(null);
        setEditText('');
        setCategory('');
    };

    const handleCancelEdit = () => {
        setEditingNote(null);
        setEditText('');
        setCategory('');
    };

    const handleRevertNote = async (note, historyEntry) => {
        const noteDoc = doc(firestore, 'notes', note.id);
        const updatedHistory = Array.isArray(note.history) ? [...note.history, historyEntry] : [historyEntry];
        await updateDoc(noteDoc, {
            text: historyEntry,
            history: updatedHistory
        });
    };

    const toggleHistory = (id) => {
        setShowHistory(prevState => ({
            ...prevState,
            [id]: !prevState[id]
        }));
    };

    const filteredNotes = filterCategory ? notes.filter(note => note.category === filterCategory) : notes;

    return (
        <div style={styles.container}>
            <div style={styles.formContainer}>
                <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="New Note"
                    style={styles.input}
                />
                <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.select}>
                    <option value="">Select Category</option>
                    <option value="Important and Urgent">Important and Urgent</option>
                    <option value="Important but Not Urgent">Important but Not Urgent</option>
                    <option value="Not Important but Urgent">Not Important but Urgent</option>
                    <option value="Not Important and Not Urgent">Not Important and Not Urgent</option>
                </select>
                <button onClick={handleAddNote} style={styles.button}>Add Note</button>
            </div>
            {editingNote && (
                <div style={styles.editContainer}>
                    <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        style={styles.input}
                    />
                    <select value={category} onChange={(e) => setCategory(e.target.value)} style={styles.select}>
                        <option value="">Select Category</option>
                        <option value="Important and Urgent">Important and Urgent</option>
                        <option value="Important but Not Urgent">Important but Not Urgent</option>
                        <option value="Not Important but Urgent">Not Important but Urgent</option>
                        <option value="Not Important and Not Urgent">Not Important and Not Urgent</option>
                    </select>
                    <button onClick={handleUpdateNote} style={styles.button}>Update Note</button>
                    <button onClick={handleCancelEdit} style={styles.button}>Cancel</button>
                </div>
            )}
            <div style={styles.filterContainer}>
                <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} style={styles.select}>
                    <option value="">All Categories</option>
                    <option value="Important and Urgent">Important and Urgent</option>
                    <option value="Important but Not Urgent">Important but Not Urgent</option>
                    <option value="Not Important but Urgent">Not Important but Urgent</option>
                    <option value="Not Important and Not Urgent">Not Important and Not Urgent</option>
                </select>
            </div>
            <div style={styles.notesContainer}>
                {filteredNotes.map(note => (
                    <div key={note.id} style={styles.noteCard}>
                        <div style={styles.noteContent}>
                            <p>{note.text}</p>
                            <p>Category: {note.category}</p>
                            <small>{note.createdAt ? new Date(note.createdAt.seconds * 1000).toLocaleString() : 'No Date'}</small>
                        </div>
                        <div style={styles.actionsContainer}>
                            <button onClick={() => handleEditNote(note)} style={styles.editButton}>Edit</button>
                            <button onClick={() => handleDeleteNote(note.id)} style={styles.deleteButton}>Delete</button>
                            <button onClick={() => toggleHistory(note.id)} style={styles.historyButton}>
                                {showHistory[note.id] ? 'Hide History' : 'Show History'}
                            </button>
                        </div>
                        {showHistory[note.id] && (
                            <div style={styles.historyContainer}>
                                <ul style={styles.historyList}>
                                    {Array.isArray(note.history) && note.history.map((entry, index) => (
                                        <li key={index} style={styles.historyItem}>
                                            <span>{entry}</span>
                                            <button onClick={() => handleRevertNote(note, entry)} style={styles.revertButton}>Revert</button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: '#f7f7f7',
        borderRadius: '10px',
        boxShadow: '0 0 10px rgba(0,0,0,0.1)',
        margin: '20px auto',
        width: '100%',
        maxWidth: '1200px'
    },
    formContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px',
        width: '100%'
    },
    input: {
        margin: '10px 0',
        padding: '10px',
        width: '100%',
        maxWidth: '1000px',
        borderRadius: '5px',
        border: '1px solid #ccc'
    },
    select: {
        margin: '10px 0',
        padding: '10px',
        width: '100%',
        maxWidth: '1000px',
        borderRadius: '5px',
        border: '1px solid #ccc'
    },
    button: {
        margin: '10px 0',
        padding: '10px',
        width: '100%',
        maxWidth: '1000px',
        backgroundColor: '#61dafb',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        color: '#282c34',
        fontWeight: 'bold'
    },
    filterContainer: {
        margin: '20px 0',
        width: '100%',
        maxWidth: '1000px',
        display: 'flex',
        justifyContent: 'center'
    },
    notesContainer: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        width: '100%'
    },
    noteCard: {
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        padding: '20px',
        width: '100%'
    },
    noteContent: {
        marginBottom: '20px'
    },
    actionsContainer: {
        display: 'flex',
        gap: '10px'
    },
    editButton: {
        padding: '5px 10px',
        backgroundColor: '#61dafb',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        color: '#282c34',
        fontSize: '1em'
    },
    deleteButton: {
        padding: '5px 10px',
        backgroundColor: '#ff4d4f',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        color: 'white',
        fontSize: '1em'
    },
    historyButton: {
        padding: '5px 10px',
        backgroundColor: '#ffd700',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        color: '#282c34',
        fontSize: '1em'
    },
    historyContainer: {
        marginTop: '20px',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        borderRadius: '5px',
        boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)'
    },
    historyList: {
        listStyleType: 'none',
        padding: '0',
        margin: '0'
    },
    historyItem: {
        display: 'flex',
        justifyContent: 'space-between',
        padding: '5px 0',
        fontSize: '0.9em'
    },
    revertButton: {
        padding: '5px 10px',
        backgroundColor: '#4CAF50',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        color: 'white',
        fontSize: '1em',
        marginLeft: '10px'
    }
};

export default Notes;
