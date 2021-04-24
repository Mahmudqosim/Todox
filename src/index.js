import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";
import moment from "moment";

import "./index.css";
import TodoSvg from "./icons/todo.svg";
import EditSvg from "./icons/edit.svg";
import HeartSvg from "./icons/heart.svg";
import CloseSvg from "./icons/close.svg"
import PlusSvg from "./icons/plus-square.svg";
import SearchSvg from "./icons/search.svg";
import DeleteSvg from "./icons/trash-alt.svg";

const Todo = () => {
  const [todos, setTodos] = useState([]);
  const [query, setQuery] = useState("");
  const [current, setCurrent] = useState({});

  const input = useRef();
  const modal = useRef();
  const editedRef = useRef();

  useEffect(() => {
    if (localStorage.getItem("tasks")) {
      setTodos(JSON.parse(localStorage.getItem("tasks")));
    } else {
      localStorage.setItem("tasks", JSON.stringify([]));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e) => {
    e.preventDefault();
    if (input.current.value) {
      setTodos([
        ...todos,
        {
          id: todos.length * Math.floor(Math.random() * 1000),
          value: input.current.value,
          time: Date.now(),
        },
      ]);
      input.current.value = "";
    }
  };

  function replace(todo, value) {
    let a = todos;
    let u = a.find((tod) => tod.id === todo.id);
    u.value = value;
    u.time = Date.now();
    return a;
  }

  let showingTodos;
  if (query) {
    let pattern = new RegExp(query);
    showingTodos = todos.filter((todo) =>
      pattern.test(todo.value.toLowerCase())
    );
  } else {
    showingTodos = todos;
  }

  const handleDelete = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleEdit = (todo) => {
    modal.current.style.display = "block";
    editedRef.current.value = todo.value;
    setCurrent(todo);
  };

  const closeModal = () => {
    modal.current.style.display = "none";
  };

  const edit = (e) => {
    e.preventDefault();
    modal.current.style.display = "none";
    if (editedRef.current.value) {
      setTodos([...[].concat(replace(current, editedRef.current.value))]);
      editedRef.current.value = "";
    } else {
      modal.current.style.display = "block";
    }
  };

  return (
    <div className="todo-container">
      <div ref={modal} className="modal">
        <div className="modal-content">
          <span onClick={closeModal}>
            <img src={CloseSvg} alt="close" />
          </span>
          <form onSubmit={(e) => edit(e)}>
            Enter new todo content
            <div>
              <input type="text" ref={editedRef} placeholder="Enter...." />
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </div>
      <div className="search">
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value.trim().toLowerCase())}
        />
        <img src={SearchSvg} alt="search" />
      </div>
      <div className="add-button">
        <form onSubmit={addTodo}>
          <input type="text" ref={input} placeholder="Add todo..." />
          <button type="submit">
            <img src={PlusSvg} alt="add-todo" /> Add
          </button>
        </form>
      </div>
      {todos.length !== 0 ? (
        <div className="todos">
          {query !== "" && (
            <div className="showing">
              Showing {showingTodos.length} of {todos.length}:
              <button onClick={() => setQuery("")}>Show All</button>
            </div>
          )}
          <ol>
            {showingTodos.map((todo, index) => (
              <li key={todo.id}>
                <div>
                  {index + 1}. {todo.value}
                </div>
                <div className="buttons">
                  <div>{moment(todo.time).fromNow()}</div>
                  <button onClick={() => handleEdit(todo)}>
                    <img src={EditSvg} alt="edit" />
                  </button>
                  <button onClick={() => handleDelete(todo.id)}>
                    <img src={DeleteSvg} alt="delete" />
                  </button>
                </div>
              </li>
            ))}
          </ol>
        </div>
      ) : (
        <div className="nothing">
          <img src={TodoSvg} alt="todo-icon" />
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<Todo />, document.querySelector("#root"));
