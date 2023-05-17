import io from 'socket.io-client';
import shortid from 'shortid';
import { useEffect, useState } from 'react';

const App = () => {

  const [socket, setSocket] = useState('');
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState('');

  useEffect(() => {
    const socket = io('ws://localhost:8000', { transports: ["websocket"] });
    setSocket(socket);
    socket.on('updateData', tasks => {
      updateTasks(tasks);
    });
    socket.on('addTask', task => {
      addTask(task);
    });
    socket.on('removeTask', taskId => {
      removeTask(taskId);
    });
  }, []);

  const updateTasks = tasks => {
    setTasks(tasks);
  }

  const removeTask = (taskId, localRemove) => {
    setTasks(tasks => tasks.filter(task => task.id !== taskId));
    if(localRemove) {
    socket.emit('removeTask', taskId);
    }
  };

  const submitForm = (e) => {
    e.preventDefault();
    console.log('click!', submitForm);
    const data = {name: taskName, id: shortid.generate()};
    addTask(data);
    socket.emit('addTask', data);
    setTaskName('');
  };

  const addTask = (task) => {
    setTasks(tasks => [...tasks, task]);
  };

  return (
    <div className="App">

      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>

        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map(task =>
          <li key={task.id} className="task">{task.name}<button onClick={() => removeTask(task.id, true)} className="btn btn--red">Remove</button></li>)}
        </ul>

        <form id="add-task-form" onSubmit={submitForm}>
          <input         
          className="text-input" 
          autoComplete="off" 
          type="text" 
          placeholder="Type your description"
          value={taskName}
          onChange={(e) => setTaskName(e.target.value)}>
          </input>
          <button className="btn" type="submit">Add</button>
        </form>

      </section>
    </div>
  );
}

export default App;
