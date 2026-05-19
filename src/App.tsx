import { BrowserRouter, Route, Routes } from 'react-router'
import { HomeRoute } from './routes/HomeRoute'
import { ProjectDetailRoute } from './routes/ProjectDetailRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRoute />} />
        <Route path="/projects/:projectId" element={<ProjectDetailRoute />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
