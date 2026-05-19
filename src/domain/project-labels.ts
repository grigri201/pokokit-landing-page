import type { ProjectStatus, ProjectType } from './project-schema'

type LabelDefinition = {
  label: string
  description: string
}

export const projectStatusLabels: Record<ProjectStatus, LabelDefinition> = {
  planned: {
    label: 'Planned',
    description: '已规划，尚未进入可用阶段',
  },
  'in-development': {
    label: 'In development',
    description: '开发中，公开工具入口未必可用',
  },
  available: {
    label: 'Available',
    description: '已有可信入口，可直接使用',
  },
  experimental: {
    label: 'Experimental',
    description: '实验性能力，使用前需确认边界',
  },
  maintenance: {
    label: 'Maintenance',
    description: '维护模式，能力可能收缩',
  },
  archived: {
    label: 'Archived',
    description: '已归档，不建议作为新任务入口',
  },
}

export const projectTypeLabels: Record<ProjectType, string> = {
  dex: 'Dex',
  editor: 'Editor',
  tool: 'Tool',
  data: 'Data',
  utility: 'Utility',
  showcase: 'Showcase',
}
