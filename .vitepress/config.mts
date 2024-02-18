import {defineConfig} from 'vitepress';
import {DefaultTheme} from 'vitepress/types/default-theme';
import jsRouter from '../javascript/router';
import reactRouter from '../react/router';
import othersRouter from '../others/router';
// https://vitepress.dev/reference/site-config

const getNavConfigByRouter = (router: DefaultTheme.SidebarItem, prefix = '') => {
  if (!router.items) {
    return;
  }
  let item = router.items[0];
  if (Array.isArray(item.items)) {
    return getNavConfigByRouter(
      {
        ...item,
        text: router.text,
      },
      prefix + (router.base || ''),
    );
  }
  return {
    text: router.text,
    link: `${prefix}${router.base || ''}${item.link}`,
  };
};

const navRouters = [
  {text: 'Home', link: '/'},
  {text: 'LeetCode', link: '/leet-code'},
  getNavConfigByRouter(jsRouter),
  {text: 'others', link: '/others/macroTaskAndMicroTask'},
].filter((v) => v !== undefined) as DefaultTheme.NavItem[];

export default defineConfig({
  title: '笔记',
  description: '笔记',
  lastUpdated: true,
  cleanUrls: true,
  base: '/note/',
  titleTemplate: ':title - 笔记',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: navRouters,
    sidebar: [
      jsRouter,
      reactRouter,
      {
        text: 'typescript',
        collapsed: true,
        items: [
          {
            text: 'let 和 const',
            link: '/ts/index',
          },
        ],
      },
      othersRouter,
    ],
    // socialLinks: [{icon: 'github', link: 'https://github.com/vuejs/vitepress'}],
  },
  srcExclude: ['**/node_modules/**', 'browser/**', 'bundler/**'],
});
