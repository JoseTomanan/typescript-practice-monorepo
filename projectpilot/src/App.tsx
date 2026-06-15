import { useState } from 'react';
import ProjectsPage from './todos/TodoListPage';



function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="container">
      <ProjectsPage />
        <button
          type="button"
          className="mb-6 inline-flex rounded text-[16px] text-[var(--accent)] bg-[var(--accent-bg)] border-2 border-transparent px-[10px] py-[5px] font-[var(--mono)] transition-colors duration-300 hover:border-[var(--accent-border)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          onClick={() => setCount((count) => count + 1)}
        >
          Count is {count}
        </button>
    </div>
  )
}

export default App
