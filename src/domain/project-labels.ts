import type {
  DataFreshness,
  EntrypointAvailability,
  EntrypointKind,
  ProjectStatus,
  ProjectType,
  SourceDisplaySource,
} from './project-schema'

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

export const entrypointKindLabels: Record<EntrypointKind, string> = {
  tool: '工具入口',
  detail: '项目详情',
  repo: '仓库',
  docs: '规划文档',
  external: '外部链接',
}

export const entrypointExternalTargetLabels: Record<EntrypointKind, string> = {
  tool: '外部工具',
  detail: '外部详情',
  repo: '外部仓库',
  docs: '外部文档',
  external: '外部链接',
}

export const entrypointAvailabilityLabels: Record<EntrypointAvailability, string> = {
  available: '可用',
  disabled: '不可用',
  'local-only': '本地开发',
  tbd: '待确认',
}

export const dataFreshnessLabels: Record<DataFreshness, LabelDefinition> = {
  manual: {
    label: '人工维护',
    description: '由 Landing Page manifest 手动维护，不是实时或自动同步数据。',
  },
  'build-time': {
    label: '构建期生成',
    description: '由构建流程生成，需重新构建后更新。',
  },
  'project-manifest': {
    label: '项目 Manifest',
    description: '来自项目显式提供的公开 manifest。',
  },
  unknown: {
    label: '未知',
    description: '尚未记录明确的数据新鲜度。',
  },
}

export const sourceDisplaySourceLabels: Record<SourceDisplaySource, string> = {
  'landing-manifest': 'Landing Page Project Manifest',
  'planning-artifacts': '规划产物',
  'public-project-manifest': '公开 Project Manifest',
  'manual-summary': '人工摘要',
}
