import axios from "axios";
import { useEffect, useState } from "react";

function App() {
  const BASE_URL = "https://jsonplaceholder.typicode.com/todos";

  const [newTask, setNewTask] = useState("");
  const [tasks, setTasks] = useState([]);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterOption, setFilterOption] = useState("all");

  const fetchTodos = () => {
    setLoading(true);
    axios
      .get(BASE_URL)
      .then((response) => {
        setTodos(response.data);
        setError(null);
      })
      .catch((error) => {
        console.error("error while fetching data", error);
        setError("error while fetching data");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const filteredTasks = () => {
    if (filterOption === "completed") {
      return tasks.filter((task) => task.completed);
    } else if (filterOption === "notCompleted") {
      return tasks.filter((task) => !task.completed);
    } else {
      return tasks;
    }
  };
  useEffect(() => {
    filteredTasks()
  },[])

  const handleAdd = (e) => {
    e.preventDefault();
    const newTaskObject = {id:crypto.randomUUID(), title: newTask, completed: false}
    axios.post(BASE_URL, newTaskObject)
    .then((response) => {
      setTasks((currentTasks) => [...currentTasks, response.data])
      setNewTask("")
      setError(null)
    })
    .catch((error) => {
      console.error("error posting Data", error)
      setError("Error posting Data!")
    })

    // setTasks((currentTasks) => {
    //   return [
    //     ...currentTasks,
    //     { id: crypto.randomUUID(), title: newTask, completed: false },
    //   ];
    // });
    setNewTask("");
  };

  const toggleChecked = (id, completed) => {
    setTasks((currentTasks) => {
      return currentTasks.map((currentTask) => {
        if (currentTask.id === id) {
          return { ...currentTask, completed };
        }
        return currentTask;
      });
    });
  };

  const handleDelete = (id) => {
    setTasks((currentTasks) => {
      return currentTasks.filter((currentTask) => currentTask.id !== id);
    });
    setTodos((currentTodos) => {
      return currentTodos.filter((currentTodo) => currentTodo.id !== id);
    });
  };

  return (
    <>
      <form onSubmit={handleAdd}>
        <label htmlFor="newTask">
          <h3>title</h3>
          <input
            type="text"
            placeholder="enter a new title here"
            id="newTask"
            onChange={(e) => setNewTask(e.target.value)}
            value={newTask}
          />
        </label>
        <button type="submit">Add</button>
      </form>
      <div>
        <label>
          Filter:
          <select
            value={filterOption}
            onChange={(e) => setFilterOption(e.target.value)}
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="notCompleted">Not Completed</option>
          </select>
        </label>
      </div>
      <ul>
        {tasks.length === 0 && todos.length === 0 && "No Tasks to show!"}
        {filteredTasks().map((task) => {
          return (
            <li key={task.id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={(e) => toggleChecked(task.id, e.target.checked)}
                />
                {task.title}
                <h3>{task.id}</h3>
              </label>
              <button onClick={() => handleDelete(task.id)}>Delete</button>
            </li>
          );
        })}
      </ul>
      <ul>
        {loading && "Loading..."}
        {error && console.log(error)}
        {todos.map((todo) => {
          return (
            <li key={todo.id}>
              <label>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={(e) => toggleChecked(todo.id, e.target.checked)}
                />
                {todo.title}
              </label>
              <button onClick={() => handleDelete(todo.id)}>Delete</button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default App;
