---
title: "Addendum: Pokopia Ecosystem Landing Page"
status: draft
created: 2026-05-18
updated: 2026-05-18
---

# Addendum: Pokopia Ecosystem Landing Page

## 输入来源

本 brief 使用以下来源初始化：

- `../pokopia-color-pattern/_bmad-output/planning-artifacts/prd.md`
- `../pokopia-color-pattern/_bmad-output/project-context.md`
- `../pokopia-color-pattern/_bmad-output/planning-artifacts/epics.md`
- `../pokopia-scene-editor/_bmad-output/planning-artifacts/prd.md`
- `../pokopia-scene-editor/_bmad-output/planning-artifacts/architecture.md`
- `../pokopia-scene-editor/_bmad-output/planning-artifacts/ux-design-specification.md`
- `../pokopia-scene-editor/_bmad-output/planning-artifacts/epics.md`

## 关键提炼

### Pokopia Decor Dex

- 公开品牌名是 `Pokopia Decor Dex`。
- 核心定位是 Pokopia Pokemon 的色彩、色板、偏好词和装饰推荐目录。
- 用户价值集中在为某只 Pokemon 找合适物品，并通过 `/pokemon/{slug}/` 分享或直接访问。
- 运行时边界强调 compact data、预计算推荐、SSG 静态页和 `/assets/runtime/**` 图片分发。
- landing page 不应读取或复制 Decor Dex 的 raw Pokopia source、`dist/docs/pokopia_image_sources/**`、完整 item manifest 或 build-only diagnostics。

### Pokopia Scene Editor

- 核心定位是面向 Pokopia 布景创作者的 5×5/7×7 结构化编辑器。
- 产品用 7×7 实际画布表达 5×5 主体区和外围装饰区，支持 0 层到 n 层建筑层、素材实例、技能标记、双预览、保存和恢复。
- `selectedPokemonKey` 使用 Decor Dex 现有 Pokemon key，说明两个项目存在语义关联，但不意味着运行时合并。
- MVP 是客户端优先静态 Web App，无后端 API、账号、云同步、协作或分享链接。
- SceneDocument v1 是编辑器内部保存/恢复 payload，不应作为 landing page 的目录数据源。

## 推荐的第一版 manifest 草案

```ts
export type ProjectStatus =
  | "planned"
  | "in-development"
  | "available"
  | "experimental"
  | "maintenance"
  | "archived";

export interface ProjectEntrypoint {
  label: string;
  kind: "tool" | "detail" | "repo" | "docs" | "external";
  href: string;
  availability: "available" | "disabled" | "local-only" | "tbd";
  note?: string;
}

export interface ProjectCard {
  id: string;
  name: string;
  tagline: string;
  type: "directory" | "dex" | "editor" | "data-tool" | "prototype";
  status: ProjectStatus;
  audiences: string[];
  primaryUseCases: string[];
  capabilities: string[];
  entrypoints: ProjectEntrypoint[];
  sourcePolicy: {
    displaySource: "landing-manifest" | "project-readme" | "project-public-manifest";
    initializedFrom: string[];
    doesNotRead: string[];
  };
  dataFreshness: "manual" | "build-time" | "project-manifest" | "unknown";
  relatedProjects?: Array<{
    projectId: string;
    relation: string;
  }>;
  badges?: string[];
  notes?: string;
}
```

## 初始项目记录建议

```ts
export const projects: ProjectCard[] = [
  {
    id: "pokopia-decor-dex",
    name: "Pokopia Decor Dex",
    tagline: "Pokemon 色彩、偏好词和装饰搭配的 Pokopia 图鉴。",
    type: "dex",
    status: "available",
    audiences: ["Pokopia 创作者", "搭配参考用户", "维护者"],
    primaryUseCases: [
      "为某只 Pokemon 查看主色和色板",
      "寻找符合 Pokemon 偏好词和色彩规则的装饰物品",
      "分享或直接访问 Pokemon 详情页",
    ],
    capabilities: ["Pokemon 色彩", "装饰推荐", "静态详情页", "可分享链接", "runtime assets"],
    entrypoints: [
      {
        label: "打开 Decor Dex",
        kind: "tool",
        href: "https://pokopia-decor-dex.tinytoolshelf.com",
        availability: "available",
      },
      {
        label: "查看本地仓库",
        kind: "repo",
        href: "../pokopia-color-pattern",
        availability: "local-only",
      },
    ],
    sourcePolicy: {
      displaySource: "landing-manifest",
      initializedFrom: [
        "../pokopia-color-pattern/_bmad-output/planning-artifacts/prd.md",
        "../pokopia-color-pattern/_bmad-output/project-context.md",
        "../pokopia-color-pattern/_bmad-output/planning-artifacts/epics.md",
      ],
      doesNotRead: [
        "docs/pokopia_image_sources/**",
        "dist/docs/pokopia_image_sources/**",
        "raw image source directories",
        "build-only diagnostics",
      ],
    },
    dataFreshness: "manual",
    badges: ["Static Pokemon pages", "Precomputed recommendations", "Runtime asset boundary"],
  },
  {
    id: "pokopia-scene-editor",
    name: "Pokopia Scene Editor",
    tagline: "用 7×7 工作台制作、预览、保存和恢复 5×5 Pokopia 布景。",
    type: "editor",
    status: "in-development",
    audiences: ["Pokopia 布景创作者", "素材库维护者"],
    primaryUseCases: [
      "在 7×7 画布中规划 5×5 主体区和外围装饰区",
      "用建筑层表达 0 层到 n 层的搭建关系",
      "标记素材实例的百变怪技能、染色、朝向和备注",
      "通过俯视图和正视图检查布景并保存恢复",
    ],
    capabilities: ["7×7 画布", "建筑层", "素材摆放", "技能标记", "保存恢复", "Mobile view-only"],
    entrypoints: [
      {
        label: "查看项目详情",
        kind: "detail",
        href: "/projects/pokopia-scene-editor",
        availability: "available",
      },
      {
        label: "查看本地仓库",
        kind: "repo",
        href: "../pokopia-scene-editor",
        availability: "local-only",
      },
    ],
    sourcePolicy: {
      displaySource: "landing-manifest",
      initializedFrom: [
        "../pokopia-scene-editor/_bmad-output/planning-artifacts/prd.md",
        "../pokopia-scene-editor/_bmad-output/planning-artifacts/architecture.md",
        "../pokopia-scene-editor/_bmad-output/planning-artifacts/ux-design-specification.md",
        "../pokopia-scene-editor/_bmad-output/planning-artifacts/epics.md",
      ],
      doesNotRead: [
        "SceneDocument save payloads",
        "localStorage UI preferences",
        "future explicit export files",
        "build artifacts unless a public project manifest is provided",
      ],
    },
    dataFreshness: "manual",
    relatedProjects: [
      {
        projectId: "pokopia-decor-dex",
        relation: "SceneDocument selectedPokemonKey uses Decor Dex Pokemon key space.",
      },
    ],
    badges: ["Desktop workbench", "SceneDocument v1", "Local save", "Read-only mobile"],
  },
];
```

## 待确认项

- Scene Editor 的第一版公开入口 URL 尚未从输入文档中确认；manifest 应先标记为 `in-development` 或 `tbd`。
- landing page 的正式公开域名尚未确认。
- 是否需要项目提供 `project.manifest.json` 作为长期同步机制，需要在后续 PRD 或 architecture 中决定。
- 若未来展示截图、版本号、最近更新时间或构建状态，应确认来源是人工维护还是项目公开 manifest，避免目录页直接读取 CI 或 dist。
