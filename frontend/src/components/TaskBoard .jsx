/* eslint-disable react/prop-types */
import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { X, Edit, Eye } from "lucide-react";

const initialColumns = {
  todo: {
    id: "todo",
    title: "TODO",
    tasks: [
      {
        id: "task-1",
        content: "Task 1",
        description: "Description 1",
        createdAt: "01/09/2024, 09:30:00",
      },
      {
        id: "task-2",
        content: "Task 2",
        description: "Description 2",
        createdAt: "01/09/2024, 09:30:00",
      },
      {
        id: "task-3",
        content: "Task 3",
        description: "Description 3",
        createdAt: "01/09/2024, 09:30:00",
      },
    ],
  },
  inProgress: {
    id: "inProgress",
    title: "IN PROGRESS",
    tasks: [
      {
        id: "task-4",
        content: "Task 4",
        description: "Description 4",
        createdAt: "01/09/2024, 09:30:00",
      },
      {
        id: "task-5",
        content: "Task 5",
        description: "Description 5",
        createdAt: "01/09/2024, 09:30:00",
      },
    ],
  },
  done: {
    id: "done",
    title: "DONE",
    tasks: [
      {
        id: "task-6",
        content: "Task 6",
        description: "Description 6",
        createdAt: "01/09/2024, 09:30:00",
      },
    ],
  },
};

const TaskDetailModal = ({ task, onClose }) => (
  <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-xl font-bold mb-4">Task Details</h2>
      <p>
        <strong>Title:</strong> {task.content}
      </p>
      <p>
        <strong>Description:</strong> {task.description}
      </p>
      <p>
        <strong>Created at:</strong> {task.createdAt}
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
          value={editedTask.content}
          onChange={(e) =>
            setEditedTask({ ...editedTask, content: e.target.value })
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
  const [columns, setColumns] = useState(initialColumns);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewTask, setViewTask] = useState(null);
  const [editTask, setEditTask] = useState(null);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.tasks];
      const destItems = [...destColumn.tasks];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          tasks: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          tasks: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.tasks];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          tasks: copiedItems,
        },
      });
    }
  };

  const addTask = () => {
    const newTask = {
      id: `task-${Date.now()}`,
      content: "New Task",
      description: "New Description",
      createdAt: new Date().toLocaleString(),
    };
    setColumns({
      ...columns,
      todo: {
        ...columns.todo,
        tasks: [newTask, ...columns.todo.tasks],
      },
    });
  };

  const deleteTask = (columnId, taskId) => {
    const column = columns[columnId];
    const updatedTasks = column.tasks.filter((task) => task.id !== taskId);
    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        tasks: updatedTasks,
      },
    });
  };

  const filteredAndSortedColumns = Object.keys(columns).reduce(
    (acc, columnId) => {
      const column = columns[columnId];
      const filteredTasks = column.tasks.filter(
        (task) =>
          task.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === "recent") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return a.content.localeCompare(b.content);
      });
      acc[columnId] = { ...column, tasks: sortedTasks };
      return acc;
    },
    {}
  );

  const handleEditTask = (columnId, taskId, updatedTask) => {
    const column = columns[columnId];
    const updatedTasks = column.tasks.map((task) =>
      task.id === taskId ? { ...task, ...updatedTask } : task
    );
    setColumns({
      ...columns,
      [columnId]: {
        ...column,
        tasks: updatedTasks,
      },
    });
  };

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addTask}
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
          {Object.values(filteredAndSortedColumns).map((column) => (
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
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-2 mb-2 rounded shadow"
                          >
                            <h3 className="font-semibold">{task.content}</h3>
                            <p className="text-sm text-gray-600">
                              {task.description}
                            </p>
                            <p className="text-xs text-gray-400">
                              {task.createdAt}
                            </p>
                            <div className="flex justify-end mt-2">
                              <button
                                onClick={() => deleteTask(column.id, task.id)}
                                className="text-red-500 mr-2"
                              >
                                <X size={16} />
                              </button>
                              <button
                                onClick={() =>
                                  setEditTask({ ...task, columnId: column.id })
                                }
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
          onSave={(updatedTask) =>
            handleEditTask(editTask.columnId, editTask.id, updatedTask)
          }
          onClose={() => setEditTask(null)}
        />
      )}
    </div>
  );
};

export default TrelloBoard;
