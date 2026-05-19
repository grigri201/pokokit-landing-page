---
title: "Addendum: Pokopia Ecosystem Landing Page PRD"
status: final
created: 2026-05-18
updated: 2026-05-18
---

# Addendum: Pokopia Ecosystem Landing Page PRD

## Source Inputs Preserved

This PRD was drafted from:

- `_bmad-output/planning-artifacts/briefs/brief-landing-page-2026-05-18/brief.md`
- `_bmad-output/planning-artifacts/briefs/brief-landing-page-2026-05-18/addendum.md`

The original brief addendum referenced upstream project planning artifacts:

- `../pokopia-color-pattern/_bmad-output/planning-artifacts/prd.md`
- `../pokopia-color-pattern/_bmad-output/project-context.md`
- `../pokopia-color-pattern/_bmad-output/planning-artifacts/epics.md`
- `../pokopia-scene-editor/_bmad-output/planning-artifacts/prd.md`
- `../pokopia-scene-editor/_bmad-output/planning-artifacts/architecture.md`
- `../pokopia-scene-editor/_bmad-output/planning-artifacts/ux-design-specification.md`
- `../pokopia-scene-editor/_bmad-output/planning-artifacts/epics.md`

## Candidate Manifest Types

Architecture should decide the final implementation shape. This is the brief-derived candidate schema to preserve for downstream architecture and story creation:

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

## Initial Records Draft

The PRD summarizes these in section 10. This addendum preserves a more implementation-shaped starting point for architecture:

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
    tagline: "用 7x7 工作台制作、预览、保存和恢复 5x5 Pokopia 布景。",
    type: "editor",
    status: "in-development",
    audiences: ["Pokopia 布景创作者", "素材库维护者"],
    primaryUseCases: [
      "在 7x7 画布中规划 5x5 主体区和外围装饰区",
      "用建筑层表达 0 层到 n 层的搭建关系",
      "标记素材实例的百变怪技能、染色、朝向和备注",
      "通过俯视图和正视图检查布景并保存恢复",
    ],
    capabilities: ["7x7 画布", "建筑层", "素材摆放", "技能标记", "保存恢复", "Mobile view-only"],
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

## Fast Path Notes

- User selected Fast path on 2026-05-18.
- PRD assumptions are intentionally kept inline as `[ASSUMPTION: ...]` tags and indexed in section 14.
- Reviewer pass ran on 2026-05-18 and wrote `review-rubric.md`.
- Finalization is handled in the PRD frontmatter and decision log.
