import { projectManifest } from '../data/projects'
import type { ProjectCard } from '../domain/project-schema'
import { validateProjectManifest } from '../domain/project-validation'

export const thirdProject = {
  id: 'pokopia-map-planner',
  name: 'Pokopia Map Planner',
  type: 'utility',
  status: 'experimental',
  tagline: '面向未来地图路线和采集规划的 Pokopia 辅助工具。',
  audiences: ['Pokopia 创作者', 'Pokopia 工具维护者'],
  primaryUseCases: [
    '规划采集路线',
    '记录地图兴趣点',
    '比较不同区域的任务优先级',
  ],
  capabilities: ['路线规划', '地图标记', '实验性工具'],
  entrypoints: [
    {
      id: 'map-planner-detail',
      kind: 'detail',
      availability: 'available',
      label: '查看项目详情',
      href: '/projects/pokopia-map-planner',
      isPrimary: true,
    },
    {
      id: 'map-planner-public-tool',
      kind: 'tool',
      availability: 'tbd',
      label: '公开工具入口待确认',
      note: 'Map Planner 仅用于扩展路径验证，尚未确认公开部署 URL。',
    },
  ],
  sourcePolicy: {
    displaySource: 'landing-manifest',
    initializedFrom: ['test fixture'],
    doesNotRead: ['adjacent project internals', 'runtime map payloads'],
  },
  dataFreshness: 'manual',
  problem: '验证新增第三个 Pokopia 项目后目录、筛选、详情和关系链接自然扩展。',
  detailSummary: [
    '提供实验性的地图路线规划说明。',
    '作为测试 fixture 验证 manifest-driven UI 扩展。',
  ],
  maintainerNotes: ['测试 fixture，只用于扩展路径验证。'],
} satisfies ProjectCard

const sceneEditorWithThirdRelation = {
  ...projectManifest.projects[1],
  relatedProjects: [
    ...(projectManifest.projects[1].relatedProjects ?? []),
    {
      projectId: thirdProject.id,
      relationship: '语义关联和参考关系，保持独立工具边界。',
    },
  ],
}

export const extendedProjectManifest = validateProjectManifest({
  ...projectManifest,
  projects: [
    projectManifest.projects[0],
    sceneEditorWithThirdRelation,
    thirdProject,
  ],
})

export const extendedProjects = extendedProjectManifest.projects
