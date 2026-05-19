import { Link } from 'react-router'
import type { ResolvedRelatedProject } from '../lib/related-projects'
import { getProjectPath } from '../lib/project-routes'

type RelatedProjectLinksProps = {
  relatedProjects: ResolvedRelatedProject[]
}

export function RelatedProjectLinks({ relatedProjects }: RelatedProjectLinksProps) {
  if (relatedProjects.length === 0) {
    return null
  }

  return (
    <section className="related-projects" aria-labelledby="related-projects-title">
      <p className="eyebrow">Related Projects</p>
      <h2 id="related-projects-title">语义关联和参考关系</h2>
      <p>
        这些项目保持独立工具边界；这里说明的是创作语义或参考关系，不代表运行时合并。
      </p>
      <ul>
        {relatedProjects.map((relatedProject) => (
          <li key={`${relatedProject.sourceProject.id}-${relatedProject.targetProject.id}`}>
            <Link to={getProjectPath(relatedProject.targetProject.id)}>
              {relatedProject.targetProject.name}：{relatedProject.relationship}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}
