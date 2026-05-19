import { projects } from './data/projects'

function App() {
  return (
    <main className="app-shell">
      <section aria-labelledby="page-title">
        <p className="eyebrow">Pokopia Ecosystem</p>
        <h1 id="page-title">Pokopia 工具目录</h1>
        <p className="lede">
          Landing Page 使用仓库内 Project Manifest 展示项目级公开元数据，不读取相邻项目内部数据。
        </p>
      </section>

      <section aria-labelledby="manifest-title">
        <h2 id="manifest-title">Manifest baseline</h2>
        <ul className="project-baseline-list">
          {projects.map((project) => (
            <li key={project.id}>
              <strong>{project.name}</strong>
              <span>{project.status}</span>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App
