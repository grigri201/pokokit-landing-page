import { validateProjectManifest } from '../domain/project-validation'

export const projectManifest = {
  version: 1,
  projects: [
    {
      id: 'pokopia-decor-dex',
      name: 'Pokopia Decor Dex',
      type: 'dex',
      status: 'available',
      tagline: 'Pokemon 色彩、偏好词和装饰搭配的 Pokopia 图鉴。',
      audiences: ['Pokopia 创作者', '回访和分享用户', 'Pokopia 工具维护者'],
      primaryUseCases: [
        '查看 Pokemon 主色和色板',
        '寻找符合偏好词和色彩规则的装饰物品',
        '分享或直接访问 Pokemon 详情页',
      ],
      capabilities: ['Pokemon 色彩', '装饰推荐', '静态详情页', '可分享链接'],
      entrypoints: [
        {
          id: 'decor-dex-public-tool',
          kind: 'tool',
          availability: 'available',
          label: '打开 Decor Dex 工具',
          href: 'https://pokopia-decor-dex.tinytoolshelf.com',
          note: '外部公开工具入口，将打开 Pokopia Decor Dex。',
          isPrimary: true,
        },
        {
          id: 'decor-dex-detail',
          kind: 'detail',
          availability: 'available',
          label: '查看项目详情',
          href: '/projects/pokopia-decor-dex',
        },
        {
          id: 'decor-dex-local-repo',
          kind: 'repo',
          availability: 'local-only',
          label: '查看本地仓库',
          href: '../pokopia-color-pattern',
          note: '开发者本地路径，不是公开工具入口。',
        },
      ],
      sourcePolicy: {
        displaySource: 'landing-manifest',
        initializedFrom: [
          '_bmad-output/planning-artifacts/prds/prd-landing-page-2026-05-18/prd.md',
          '_bmad-output/planning-artifacts/architecture.md',
        ],
        doesNotRead: [
          'raw Pokopia image source directories',
          'full item manifest',
          'dist/docs/pokopia_image_sources/**',
          'build-only diagnostics',
        ],
      },
      dataFreshness: 'manual',
      problem: '帮助创作者基于 Pokemon 色彩、色板和偏好词找到装饰搭配参考。',
      detailSummary: [
        '展示 Pokemon 主色、色板和偏好词。',
        '提供装饰推荐和可分享的静态详情页。',
      ],
      maintainerNotes: ['Decor Dex 当前公开入口按 PRD 假设配置，可在部署前复核。'],
    },
    {
      id: 'pokopia-scene-editor',
      name: 'Pokopia Scene Editor',
      type: 'editor',
      status: 'in-development',
      tagline: '用 7x7 工作台制作、预览、保存和恢复 5x5 Pokopia 布景。',
      audiences: ['Pokopia 创作者', 'Pokopia 工具维护者'],
      primaryUseCases: [
        '规划 5x5 主体区和外围装饰区',
        '表达 0 层到 n 层建筑层',
        '标记素材实例技能、染色、朝向和备注',
        '通过俯视图和正视图检查布景并保存恢复',
      ],
      capabilities: ['7x7 画布', '建筑层', '素材摆放', '技能标记', '保存恢复'],
      entrypoints: [
        {
          id: 'scene-editor-detail',
          kind: 'detail',
          availability: 'available',
          label: '查看项目详情',
          href: '/projects/pokopia-scene-editor',
          isPrimary: true,
        },
        {
          id: 'scene-editor-public-tool',
          kind: 'tool',
          availability: 'tbd',
          label: '公开工具入口待确认',
          note: 'Scene Editor 仍在开发中，尚未确认公开部署 URL。',
        },
        {
          id: 'scene-editor-local-repo',
          kind: 'repo',
          availability: 'local-only',
          label: '查看本地仓库',
          href: '../pokopia-scene-editor',
          note: '开发者本地路径，不是公开工具入口。',
        },
        {
          id: 'scene-editor-planning-docs',
          kind: 'docs',
          availability: 'local-only',
          label: '查看规划文档',
          href: '_bmad-output/planning-artifacts/ux-design-specification.md',
          note: '本仓库规划引用，供维护者审计。',
        },
      ],
      sourcePolicy: {
        displaySource: 'landing-manifest',
        initializedFrom: [
          '_bmad-output/planning-artifacts/prds/prd-landing-page-2026-05-18/prd.md',
          '_bmad-output/planning-artifacts/ux-design-specification.md',
        ],
        doesNotRead: [
          'SceneDocument save payloads',
          'localStorage UI preferences',
          'export files',
          'editor build artifacts',
          'future internal datasets',
        ],
      },
      dataFreshness: 'manual',
      problem: '帮助创作者规划 Pokopia 布景、建筑层、素材实例和预览保存路径。',
      detailSummary: [
        '围绕 7x7 工作台和 5x5 主体区组织素材。',
        '表达建筑层、素材实例、技能标记、预览和保存恢复。',
      ],
      relatedProjects: [
        {
          projectId: 'pokopia-decor-dex',
          relationship: 'Pokemon key 语义和装饰参考关系，两个项目保持独立工具边界。',
        },
      ],
      maintainerNotes: ['公开部署 URL 未确认前，不能把 Scene Editor 呈现为可启动工具。'],
    },
  ],
} as const

export const validatedProjectManifest = validateProjectManifest(projectManifest)
export const projects = validatedProjectManifest.projects
