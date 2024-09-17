/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { X, Edit, Eye } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTasks,
  addTask,
  updateTask,
  removeTask,
} from "../redux/features/task/taskSlice";
import { logout } from "../redux/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

axios.defaults.withCredentials = true;

const API_URL =
  import.meta.env.VITE_BACKEND_BASE_URL || "http://localhost:3000";

const TaskDetailModal = ({ task, onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Task Details</h2>
      <p>
        <strong>Title:</strong> {task.title}
      </p>
      <p>
        <strong>Description:</strong> {task.description}
      </p>
      <p>
        <strong>Status:</strong> {task.status}
      </p>
      <p>
        <strong>Priority:</strong> {task.priority}
      </p>
      <p>
        <strong>Due Date:</strong>{" "}
        {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Not set"}
      </p>
      <button
        onClick={onClose}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Close
      </button>
    </div>
  </div>
);

const EditTaskModal = ({ task, onSave, onClose }) => {
  const [editedTask, setEditedTask] = useState(task);

  const handleSave = () => {
    onSave(editedTask);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Edit Task</h2>
        <input
          type="text"
          value={editedTask.title}
          onChange={(e) =>
            setEditedTask({ ...editedTask, title: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded"
        />
        <textarea
          value={editedTask.description}
          onChange={(e) =>
            setEditedTask({ ...editedTask, description: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded"
          rows="3"
        />
        <select
          value={editedTask.status}
          onChange={(e) =>
            setEditedTask({ ...editedTask, status: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
        <select
          value={editedTask.priority}
          onChange={(e) =>
            setEditedTask({ ...editedTask, priority: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input
          type="date"
          value={editedTask.dueDate ? editedTask.dueDate.split("T")[0] : ""}
          onChange={(e) =>
            setEditedTask({ ...editedTask, dueDate: e.target.value })
          }
          className="w-full p-2 mb-4 border rounded"
        />
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          >
            Save
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

const TrelloBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewTask, setViewTask] = useState(null);
  const [editTask, setEditTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const tasks = useSelector((state) => state.tasks.tasks);
  let color = "#ffffff";

  const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "#3498db",
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/tasks`);
        dispatch(setTasks(response.data));
        setLoading(false);
      } catch (err) {
        if (err.response && err.response.status === 401) {
          dispatch(logout());
          navigate("/login");
        } else {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchTasks();
  }, [dispatch, navigate]);

  const columns = {
    todo: {
      id: "todo",
      title: "TODO",
      tasks: tasks.filter((task) => task.status === "To Do"),
    },
    inProgress: {
      id: "inProgress",
      title: "IN PROGRESS",
      tasks: tasks.filter((task) => task.status === "In Progress"),
    },
    done: {
      id: "done",
      title: "DONE",
      tasks: tasks.filter((task) => task.status === "Done"),
    },
  };

  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const task = columns[source.droppableId].tasks[source.index];
    const updatedTask = {
      ...task,
      status:
        destination.droppableId === "inProgress"
          ? "In Progress"
          : destination.droppableId === "done"
          ? "Done"
          : "To Do",
    };

    try {
      const response = await axios.put(
        `${API_URL}/api/v1/tasks/${task._id}`,
        updatedTask
      );
      dispatch(updateTask(response.data));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        dispatch(logout());
        navigate("/login");
      } else {
        setError(err.message);
      }
    }
  };

  const addNewTask = async () => {
    const newTask = {
      title: "New Task",
      description: "New Description",
      status: "To Do",
      priority: "Medium",
      dueDate: new Date().toISOString().split("T")[0],
    };

    try {
      const response = await axios.post(`${API_URL}/api/v1/tasks`, newTask);
      dispatch(addTask(response.data));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        dispatch(logout());
        navigate("/login");
      } else {
        setError(err.message);
      }
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/api/v1/tasks/${taskId}`);
      dispatch(removeTask(taskId));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        dispatch(logout());
        navigate("/login");
      } else {
        setError(err.message);
      }
    }
  };

  const handleEditTask = async (updatedTask) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/v1/tasks/${updatedTask._id}`,
        updatedTask
      );
      dispatch(updateTask(response.data));
    } catch (err) {
      if (err.response && err.response.status === 401) {
        dispatch(logout());
        navigate("/login");
      } else {
        setError(err.message);
      }
    }
  };

  if (loading)
    return (
      <div className="flex justify-center text-2xl">
        <h1>
          Using Free Service for Hosting, So it will take upto 40-50 secs for
          Initial Loading...
          <ClipLoader
            color={color}
            loading={loading}
            cssOverride={override}
            size={150}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </h1>
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredColumns = {
    todo: {
      ...columns.todo,
      tasks: filteredTasks.filter((task) => task.status === "To Do"),
    },
    inProgress: {
      ...columns.inProgress,
      tasks: filteredTasks.filter((task) => task.status === "In Progress"),
    },
    done: {
      ...columns.done,
      tasks: filteredTasks.filter((task) => task.status === "Done"),
    },
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addNewTask}
        >
          Add Task
        </button>
        <input
          type="text"
          placeholder="Search..."
          className="border p-2 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="recent">Recent</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-col md:flex-row gap-4">
          {Object.values(filteredColumns).map((column) => (
            <div key={column.id} className="flex-1 min-w-[250px]">
              <h2 className="font-bold mb-2 bg-blue-500 text-white p-2 rounded">
                {column.title}
              </h2>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-gray-100 p-2 rounded min-h-[100px]"
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-2 mb-2 rounded shadow"
                          >
                            <h3 className="font-semibold">{task.title}</h3>
                            <p className="text-sm text-gray-600">
                              {task.description}
                            </p>
                            <p className="text-xs text-gray-400">
                              Due:{" "}
                              {task.dueDate
                                ? new Date(task.dueDate).toLocaleDateString()
                                : "Not set"}
                            </p>
                            <div className="flex justify-end mt-2">
                              <button
                                onClick={() => deleteTask(task._id)}
                                className="text-red-500 mr-2"
                              >
                                <X size={16} />
                              </button>
                              <button
                                onClick={() => setEditTask(task)}
                                className="text-blue-500 mr-2"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => setViewTask(task)}
                                className="text-green-500"
                              >
                                <Eye size={16} />
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
      {viewTask && (
        <TaskDetailModal task={viewTask} onClose={() => setViewTask(null)} />
      )}
      {editTask && (
        <EditTaskModal
          task={editTask}
          onSave={handleEditTask}
          onClose={() => setEditTask(null)}
        />
      )}
    </div>
  );
};

export default TrelloBoard;
