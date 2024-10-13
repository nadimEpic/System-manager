import * as React from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/brands.css';
import '@fortawesome/fontawesome-free/css/solid.css';

interface ToDo {
  id: number;
  text: string;
  completed: boolean;
};

type TodoFilter = 'all' | 'active' | 'completed';

export default function App() {
  const [input, setInput] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<TodoFilter>('all');
  const [user, setUser] = useState<any>(null);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    axios.get('http://localhost:3000/auth/user')
      .then(response => {
        if (response.data.Status) {
          setUser(response.data.user);
        } else {
          console.error('Unauthorized access');
        }
      })
      .catch(error => console.error('Error fetching user:', error));


    axios.get('http://localhost:3000/todos/')
      .then(response => {
        if (response.data.Status) {
          setTodos(response.data.todos);
        }
      })
      .catch(error => console.error('Error fetching todos:', error));
  }, []);

  const checkTodo = useCallback((id: number, completed: boolean) => {
    setTodos(todos.map(t => t.id !== id ? t : { ...t, completed }));
  }, [todos]);

  const removeTodo = useCallback((id: number) => {
    setTodos(todos.filter(t => t.id !== id));
  }, [todos]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user) {
      axios.post('http://localhost:3000/todos/add', { title: input })
        .then(response => {
          const newTodo = response.data;
          setTodos([...todos, { id: newTodo.id, text: newTodo.title, completed: false }]);
          setInput('');
        })
        .catch(error => console.error('Error adding todo:', error));
    }
  }

  const renderFilterButton = (buttonFilter: TodoFilter, text: string) => {
    return (
      <button
        className={`btn btn-sm btn-outline-primary ${filter === buttonFilter ? 'active' : ''}`}
        onClick={() => setFilter(buttonFilter)}
      >{text}</button>
    );
  }

  const todosByFilter = useMemo(() => {
    return filter === 'active' ? todos.filter(t => !t.completed) 
    : filter === 'completed' ? todos.filter(t => t.completed)
    : todos;
  }, [filter, todos]);

  return (
    <div className="p-4">
      <form className="mb-3 input-group" onSubmit={onSubmit}>
        <input
          name="todo"
          className="form-control"
          placeholder="I'm going to..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button className="btn btn-primary">Add</button>
        {
          !!input && <button
            type="button"
            className="fa fa-times"
            style={{
              background: 'none',
              border: 'none',
              position: 'absolute',
              right: 40,
              top: 0,
              bottom: 0,
              marginRight: 20,
              zIndex: 10
            }}
            onClick={() => setInput('')}
          />
        }
      </form>

      <div className="btn-group mb-3">
        {renderFilterButton('all', 'All')}
        {renderFilterButton('active', 'Active')}
        {renderFilterButton('completed', 'Completed')}
      </div>

      <TodoList todos={todosByFilter} onCheck={checkTodo} onRemove={removeTodo} />
    </div>
  );
}

interface TodoListProps {
  todos: ToDo[],
  onCheck: (id: number, checked: boolean) => void;
  onRemove: (id: number) => void;
}

const TodoList = React.memo(({ todos, onCheck, onRemove }: TodoListProps) => {
  return (
    <ul className="list-group">
      {todos.map(todo => (
        <li key={todo.id} className="list-group-item" style={{ display: 'flex', alignItems: 'center' }}>
          <input
            className="form-check-input me-3"
            type="checkbox"
            checked={todo.completed}
            onChange={() => onCheck(todo.id, !todo.completed)}
          />
          <span style={{ flex: 1, textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text}</span>
          <button
            className="fa fa-times"
            style={{ background: 'none', border: 'none' }}
            onClick={() => onRemove(todo.id)}
          />
        </li>
      ))}
    </ul>
  );
});
