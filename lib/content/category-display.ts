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
  siOpenjdk,
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
    description: "内容驱动站点、组件岛与 Astro 5 实践。",
    icon: siAstro,
  },
  electron: {
    description: "桌面应用、IPC、安全、打包与性能。",
    icon: siElectron,
  },
  express: {
    description: "Node.js Web 服务、路由、中间件与静态资源。",
    accent: "#22D3EE",
    icon: siExpress,
  },
  fastapi: {
    description: "Python API、类型声明、异步服务与工程化。",
    icon: siFastapi,
  },
  htmx: {
    description: "HTML 优先的交互增强与服务端渲染体验。",
    icon: siHtmx,
  },
  java: {
    description: "Java 语言基础、工程实践与生态要点。",
    accent: "#F89820",
    icon: siOpenjdk,
  },
  javascript: {
    description: "语言机制、浏览器 API 与现代工程基础。",
    icon: siJavascript,
  },
  mysql: {
    description: "SQL、索引、事务、复制与查询优化。",
    icon: siMysql,
  },
  nodejs: {
    description: "运行时、模块系统、异步 I/O 与工程实践。",
    icon: siNodedotjs,
  },
  python: {
    description: "语法、生态、服务开发与自动化实践。",
    icon: siPython,
  },
  react: {
    description: "组件、状态、路由与性能优化。",
    icon: siReact,
  },
  "react-native": {
    description: "跨端组件、布局、状态与移动端工程实践。",
    icon: siReact,
  },
  springboot: {
    description: "后端工程、配置、安全、测试与部署。",
    icon: siSpringboot,
  },
  typescript: {
    description: "类型系统、工程配置与大型项目维护。",
    icon: siTypescript,
  },
  vue: {
    description: "组合式 API、响应式系统、路由与构建优化。",
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
