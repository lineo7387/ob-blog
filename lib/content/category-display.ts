import type { Route } from "next";
import type { SimpleIcon } from "simple-icons";
import {
  siAstro,
  siElectron,
  siExpress,
  siFastapi,
  siHtmx,
  siJavascript,
  siMysql,
  siNodedotjs,
  siPython,
  siReact,
  siSpringboot,
  siTypescript,
  siVuedotjs,
} from "simple-icons";
import type { CategorySummary } from "@/lib/content/types";

export type CategoryIcon = Pick<SimpleIcon, "title" | "hex" | "path">;

export type CategoryGridItem = CategorySummary & {
  href: Route;
  description: string;
  accent: string;
  icon: CategoryIcon;
};

type CategoryDisplayMeta = {
  description: string;
  accent?: string;
  icon: CategoryIcon;
};

const fallbackIcon: CategoryIcon = {
  title: "Code",
  hex: "22D3EE",
  path: "M4 4h16v16H4V4zm4.7 11.3L6.4 13l2.3-2.3-1.4-1.4L3.6 13l3.7 3.7 1.4-1.4zm6.6 0 2.3-2.3-2.3-2.3 1.4-1.4 3.7 3.7-3.7 3.7-1.4-1.4zm-2.2 2.1 2.8-8.8-1.9-.6-2.8 8.8 1.9.6z",
};

const fallbackMeta: CategoryDisplayMeta = {
  description: "汇总该技术方向的系列笔记与实践文章。",
  accent: "#22D3EE",
  icon: fallbackIcon,
};

const categoryDisplayMeta: Record<string, CategoryDisplayMeta> = {
  astro: {
    description: "内容驱动、岛屿架构与静态站点工程。",
    icon: siAstro,
  },
  electron: {
    description: "桌面应用、跨端集成与打包发布。",
    icon: siElectron,
  },
  express: {
    description: "Node.js 服务、路由、中间件与接口设计。",
    icon: siExpress,
  },
  fastapi: {
    description: "类型驱动的 Python API、异步服务与工程实践。",
    icon: siFastapi,
  },
  htmx: {
    description: "HTML 优先的交互增强与轻量前端架构。",
    icon: siHtmx,
  },
  java: {
    description: "JVM、并发、集合、IO 与后端工程实践。",
    accent: "#F89820",
    icon: siSpringboot,
  },
  javascript: {
    description: "语言机制、异步模型、DOM 与工程化实践。",
    icon: siJavascript,
  },
  mysql: {
    description: "SQL、索引、事务、复制与查询优化。",
    icon: siMysql,
  },
  nodejs: {
    description: "运行时、包管理、服务端框架与性能调优。",
    icon: siNodedotjs,
  },
  python: {
    description: "语言基础、自动化、数据处理与服务开发。",
    icon: siPython,
  },
  react: {
    description: "组件、状态、路由与性能优化。",
    icon: siReact,
  },
  "react-native": {
    description: "跨端组件、原生能力、导航与性能优化。",
    icon: siReact,
  },
  springboot: {
    description: "Spring Boot 应用、配置、数据访问与服务治理。",
    icon: siSpringboot,
  },
  typescript: {
    description: "类型系统、泛型、工程约束与大型项目实践。",
    icon: siTypescript,
  },
  vue: {
    description: "组合式 API、响应式系统、路由与生态实践。",
    icon: siVuedotjs,
  },
};

export function getCategoryDisplayMeta(slug: string): Required<CategoryDisplayMeta> {
  const meta = categoryDisplayMeta[slug] ?? fallbackMeta;

  return {
    description: meta.description,
    accent: meta.accent ?? `#${meta.icon.hex}`,
    icon: meta.icon,
  };
}

export function toCategoryGridItems(categories: CategorySummary[]): CategoryGridItem[] {
  return categories.map((category) => {
    const meta = getCategoryDisplayMeta(category.slug);

    return {
      ...category,
      href: `/blog/${category.slug}` as Route,
      ...meta,
    };
  });
}
