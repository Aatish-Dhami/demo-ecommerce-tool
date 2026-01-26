import { EventList } from './components/EventList';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Flowtel Analytics Dashboard</h1>
      </header>
      <main className="app__main">
        <EventList />
      </main>
    </div>
  );
}

export default App;
