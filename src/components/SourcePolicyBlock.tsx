import {
  dataFreshnessLabels,
  sourceDisplaySourceLabels,
} from '../domain/project-labels'
import type { ProjectCard } from '../domain/project-schema'

type SourcePolicyBlockProps = {
  project: ProjectCard
}

function CodeList({ items }: { items: string[] }) {
  return (
    <ul className="source-policy__code-list">
      {items.map((item) => (
        <li key={item}>
          <code>{item}</code>
        </li>
      ))}
    </ul>
  )
}

export function SourcePolicyBlock({ project }: SourcePolicyBlockProps) {
  const freshness = dataFreshnessLabels[project.dataFreshness]
  const maintainerNotes = project.maintainerNotes ?? []

  return (
    <section className="source-policy" aria-labelledby="source-policy-title">
      <div className="source-policy__heading">
        <p className="eyebrow">Source Policy</p>
        <h2 id="source-policy-title">来源和边界</h2>
        <span className="freshness-badge">{freshness.label}</span>
      </div>
      <p>{freshness.description}</p>

      <div className="source-policy__grid">
        <section aria-labelledby="source-policy-reads-title">
          <h3 id="source-policy-reads-title">本页读取</h3>
          <p>
            展示来源：
            <code>{sourceDisplaySourceLabels[project.sourcePolicy.displaySource]}</code>
          </p>
          <p>初始化来源：</p>
          <CodeList items={project.sourcePolicy.initializedFrom} />
        </section>

        <section aria-labelledby="source-policy-does-not-read-title">
          <h3 id="source-policy-does-not-read-title">本页不读取</h3>
          <CodeList items={project.sourcePolicy.doesNotRead} />
        </section>
      </div>

      {maintainerNotes.length > 0 ? (
        <section className="source-policy__notes" aria-labelledby="maintainer-notes-title">
          <h3 id="maintainer-notes-title">维护备注</h3>
          <ul>
            {maintainerNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </section>
  )
}
