import React, { useEffect, useState } from 'react';
import { FaCirclePlus } from 'react-icons/fa6';
import { addToDoAPI, DeleteToDoAPI, getAllToDoAPI, getEditToDoAPI, updateToDoAPI } from '../service/AllApi';
import { AiFillDelete } from 'react-icons/ai';
import { GrEdit } from 'react-icons/gr';
import { motion, AnimatePresence } from 'framer-motion';
import { SiTicktick } from 'react-icons/si';

function Home() {
    const [toDoData, setToDoData] = useState({ title: '' });
    const [isToDoChanged, setIsToDoChanged] = useState('');
    const [allToDos, setAllToDos] = useState([]);
    const [editingId, setEditingId] = useState(null); // Track which todo is being edited
    const [editToDo, setEditToDo] = useState({ title: '' });
    // Add new todo
    const handleAdd = async () => {
        if (!toDoData.title.trim()) {
            alert('Fill the todo field');
            return;
        }
        try {
            await addToDoAPI(toDoData);
            setIsToDoChanged(Date.now());
            setToDoData({ title: '' });
        } catch (err) {
            console.log(err);
        }
    };

    // Fetch all todos
    const getAllToDo = async () => {
        try {
            const result = await getAllToDoAPI();
            if (result.status >= 200 && result.status < 300) {
                setAllToDos(result.data);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getAllToDo();
    }, [isToDoChanged]);

    // Delete todo
    const handleDelete = async (id) => {
        try {
            const result = await DeleteToDoAPI(id);
            if (result.status >= 200 && result.status < 300) {
                setIsToDoChanged(Date.now());
            }
        } catch (err) {
            console.log(err);
        }
    };

    // Edit todo
    const handleEdit = async (id) => {
        setEditingId(id);
        try {
            const result = await getEditToDoAPI(id);
            if (result.status >= 200 && result.status < 300) {
                setEditToDo(result.data);
            }
        } catch (err) {
            console.log(err);
        }
    };
    // OR
    // const handleEdit = (id) => {
    //     setEditingId(id);
    //     const found = allToDos.find((t) => t.id === id);
    //     if (found) setEditToDo(found);
    // };


    const handleUpdate = async (id) => {
        setEditingId(null);
        if (!editToDo.title.trim()) {
            alert('Fill the todo field');
            return;
        }
        try {
            const result = await updateToDoAPI(id, editToDo);
            if (result.status >= 200 && result.status < 300) {
                setEditToDo({ title: '' });
                setIsToDoChanged(Date.now());
            }
        } catch (err) {
            console.log(err);
        }
    };

    // to focus on input when click edit
    const inputRef = React.useRef(null);
    useEffect(() => {
        if (editingId !== null && inputRef.current) {
            inputRef.current.focus();
        }
    }, [editingId]);

    return (
        <div className="px-10 md:px-20 mt-12 bg-black min-h-screen">
            <h1 className="text-center text-green-500 text-4xl font-extrabold">ToDo App</h1>

            {/* Input Section */}
            <div className="flex items-center mt-10 gap-2 mb-8">
                <div className="flex items-center text-white border border-gray-200 rounded-full px-3 py-3 md:py-2 flex-1 min-w-0">
                    <input
                        type="text"
                        placeholder="Write Today's Task Here...."
                        className="outline-none flex-1 text-sm sm:text-base bg-black"
                        value={toDoData?.title}
                        onChange={(e) => setToDoData({ ...toDoData, title: e.target.value })}
                    />
                </div>
                <button onClick={handleAdd}>
                    <FaCirclePlus className="text-green-500 bg-white rounded-full text-4xl font-bold" />
                </button>
            </div>

            {/* ToDo Cards */}
            <div className="flex flex-col md:pr-11 gap-4">
                <AnimatePresence>
                    {allToDos.length > 0 ? (
                        allToDos.map((todo) => (
                            <motion.div
                                key={todo.id}
                                className="flex justify-between items-center bg-amber-100 rounded-full w-full pl-3"
                                initial={{ opacity: 1, x: 0 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 200 }}
                                transition={{ duration: 0.3, ease: "easeOut", }}
                            >
                                {editingId === todo?.id ? (
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={editToDo.title}
                                        onChange={(e) => setEditToDo({ ...editToDo, title: e.target.value })}
                                        className="flex-1 outline-amber-300 px-2 mr-2 py-2 rounded-l-full"
                                    />
                                ) : (
                                    <span>{todo.title}</span>
                                )}

                                <div className="flex">
                                    {editingId === todo.id ? (
                                        <SiTicktick
                                            onClick={() => handleUpdate(todo?.id)}
                                            className="text-orange-500 p-4 text-5xl bg-orange-200 hover:bg-orange-300 cursor-pointer"
                                        />
                                    ) : (
                                        <GrEdit
                                            onClick={() => handleEdit(todo?.id)}
                                            className="text-orange-500 p-4 text-5xl bg-orange-200 hover:bg-orange-300 cursor-pointer"
                                        />
                                    )}
                                    <AiFillDelete
                                        onClick={() => handleDelete(todo?.id)}
                                        className="text-black p-3 rounded-r-full text-5xl bg-green-300 hover:bg-green-400 cursor-pointer"
                                    />
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-white mt-4">NO TODOS YET</p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default Home;
