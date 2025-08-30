import React, { useEffect, useState } from 'react';
import { FaCirclePlus } from 'react-icons/fa6';
import { addToDoAPI, DeleteToDoAPI, getAllToDoAPI, getEditToDoAPI, patchToDoAPI, updateToDoAPI } from '../service/AllApi';
import { AiFillDelete } from 'react-icons/ai';
import { GrEdit } from 'react-icons/gr';
import { motion, AnimatePresence } from 'framer-motion';
import { SiTicktick } from 'react-icons/si';
import { toast } from 'react-toastify';
import { GiPadlock } from 'react-icons/gi';
import { FiChevronDown } from 'react-icons/fi';
import { FaChevronCircleDown } from 'react-icons/fa';

function Home() {
    const [toDo, setToDo] = useState({ title: '', completed: false });
    const [isToDoChanged, setIsToDoChanged] = useState('');
    const [allToDos, setAllToDos] = useState([]);
    const [editingId, setEditingId] = useState(null); // Track which todo is being edited
    const [editToDo, setEditToDo] = useState({ title: '' });
    const [sortBy, setSortBy] = useState("All"); // state for sorting
    const [showSortOptions, setShowSortOptions] = useState(false); // dropdown toggle

    // Add new todo
    const handleAdd = async () => {
        if (!toDo.title.trim()) {
            toast.error('Please, Fill the Task Field');
            return;
        }
        try {
            await addToDoAPI(toDo);
            setIsToDoChanged(Date.now());
            setToDo({ title: '', completed: false });
            toast.success("Task Added Successfully!!")
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
                toast.success("Task Removed Successfully!!")
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
    //     const found = allToDos.find((todo) => todo.id === id);
    //     if (found) setEditToDo(found);
    // };


    const handleUpdate = async (id) => {
        setEditingId(null);
        if (!editToDo.title.trim()) {
            toast.error('Please, Fill the Task Field');
            return;
        }
        try {
            const result = await updateToDoAPI(id, editToDo);
            if (result.status >= 200 && result.status < 300) {
                setEditToDo({ title: '' });
                setIsToDoChanged(Date.now());
                // toast.success("Task edited successfully!!")
            }
        } catch (err) {
            console.log(err);
        }
    };

    // --------------------------------------------------------------------------
    const handleComplete = async (id) => {
        try {
            const todo = allToDos.find((todo) => todo.id === id); //used instead of getEditToDoAPI
            if (!todo) return;

            const result = await patchToDoAPI(id, { completed: !todo.completed }); //!todo.completed is now true - if using PUT instead of PATCH also use updateToDoAPI(id, { completed: !todo.completed })
            if (result.status >= 200 && result.status < 300) {
                setIsToDoChanged(Date.now());
                toast.success(
                    !todo.completed && "Task marked as Completed!! "
                );
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

    // Sort based on completion
    const filteredToDos = allToDos.filter((todo) => {
        if (sortBy === "Pending") return !todo?.completed;
        if (sortBy === "Completed") return todo?.completed;
        return true; // "All"
    });

    return (
        <div className="px-5  md:px-20 lg:px-70 mt-12 bg-black min-h-screen">
            <h1 className="text-center text-green-500 text-4xl md:mr-15 font-extrabold">ToDo App</h1>

            {/* Input Section */}
            <div className="flex items-center mt-10 gap-2 mb-8">
                <div className="flex items-center text-white border border-gray-200 rounded-full px-3 py-3 md:py-2 flex-1 min-w-0">
                    <input
                        type="text"
                        placeholder="Write Today's Task Here...."
                        className="outline-none flex-1 text-sm sm:text-base bg-black"
                        value={toDo?.title}
                        onChange={(e) => setToDo({ ...toDo, title: e.target.value })}
                    />
                </div>
                {/* plus icon */}
                <button onClick={handleAdd}>
                    <FaCirclePlus className="text-green-500 bg-white rounded-full text-4xl font-bold " />
                </button>
                {/* sort icon */}
                <div className="relative">
                    <button
                        className="text-orange-300 bg-white rounded-full text-4xl mt-1  border border-white"
                        onClick={() => setShowSortOptions(!showSortOptions)}
                    >
                        <FaChevronCircleDown />
                    </button>

                    {showSortOptions && (
                        <div className="absolute right-0 md:right-5 mt-2 bg-white border rounded-lg shadow-lg w-40 z-10">
                            {["All", "Completed", "Pending"].map(
                                (option) => (
                                    <div
                                        key={option}
                                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            setSortBy(option);
                                            setShowSortOptions(false);
                                        }}
                                    >
                                        {option}
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>

            </div>

            {/* ToDo Cards */}
            <div className="flex flex-col md:pr-25 gap-4">
                <AnimatePresence>
                    {filteredToDos.length > 0 ? (
                        filteredToDos.map((todo) => (
                            <motion.div
                                key={todo?.id}
                                className={`flex justify-between items-center  rounded-full w-full pl-3 ${todo?.completed ? "bg-amber-50 brightness-70" : "bg-amber-100 brightness-100"}`}
                                initial={{ opacity: 1, x: 0 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 200 }}
                                transition={{ duration: 0.3, ease: "easeOut", }}
                            >
                                <div className='flex items-center w-full '>
                                    {editingId === todo.id ? (
                                        <GiPadlock
                                            onClick={() => handleUpdate(todo?.id)}
                                            className="text-green-500 p-2 text-4xl cursor-pointer hidden"
                                        />
                                    ) : (
                                        <GrEdit
                                            onClick={() => handleEdit(todo?.id)}
                                            className="text-orange-500 p-2 text-4xl cursor-pointer "
                                        />
                                    )}

                                    {editingId === todo?.id ? (
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={editToDo.title}
                                            onChange={(e) => setEditToDo({ ...editToDo, title: e.target.value })}
                                            className="flex-1 outline-amber-300 px-2  py-2 rounded-l-full"
                                        />
                                    ) : (
                                        <span className={`flex-1 ${todo?.completed ? "line-through text-gray-500" : ""}`}>
                                            {todo?.title}
                                        </span>
                                    )}
                                    {editingId === todo.id ? (
                                        <GiPadlock
                                            onClick={() => handleUpdate(todo?.id)}
                                            className="text-green-500 p-2 text-4xl cursor-pointer"
                                        />
                                    ) : (
                                        <GrEdit
                                            onClick={() => handleEdit(todo?.id)}
                                            className="text-orange-500 p-2 text-4xl cursor-pointer hidden"
                                        />
                                    )}
                                </div>

                                <div className="flex">
                                    <SiTicktick
                                        onClick={() => handleComplete(todo?.id)}
                                        className={` p-4 text-5xl  cursor-pointer bg-orange-200 hover:bg-orange-300 
                                            ${todo?.completed ? "text-green-600" : "text-orange-500 "}`}
                                    />

                                    <AiFillDelete
                                        onClick={() => handleDelete(todo?.id)}
                                        className="text-black p-3 rounded-r-full text-5xl bg-green-300 hover:bg-green-400 cursor-pointer"
                                    />
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <p className="text-white ml-3">NO TASKS ADDED YET</p>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default Home;
