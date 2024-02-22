import {defineConfig} from 'vitepress';
import {DefaultTheme} from 'vitepress/types/default-theme';
import jsRouterConfig from '../javascript/router';
import othersRouterConfig from '../others/router';

export default defineConfig({
  title: '笔记',
  description: '笔记',
  lastUpdated: true,
  cleanUrls: true,
  base: '/note/',
  titleTemplate: ':title - 笔记',
  head: [
    ['link', {rel: 'icon', href: '/note/favicon.ico'}],
    ['link', {rel: 'manifest', href: '/note/manifest.json'}],
    ['meta', {name: 'author', content: 'lyw'}],
    ['meta', {name: 'keywords', content: 'lyw, note, 笔记'}],
    ['meta', {name: 'description', content: '笔记'}],
    ['meta', {name: 'viewport', content: 'width=device-width, initial-scale=1.0'}],
  ],
  themeConfig: {
    nav: [jsRouterConfig.nav, othersRouterConfig.nav],
    sidebar: {
      [jsRouterConfig.router.base || '']: routerWithBasicSetting(jsRouterConfig.router),
      [othersRouterConfig.router.base || '']: routerWithBasicSetting(othersRouterConfig.router),
    },
    outline: {
      level: [2, 6],
      label: '目录',
    },
  },
  srcExclude: ['**/node_modules/**', 'browser/**', 'bundler/**'],
});

function routerWithBasicSetting(router: DefaultTheme.SidebarItem) {
  if (router.items && Array.isArray(router.items)) {
    if (router.collapsed === undefined) {
      router.collapsed = true;
    }
    router.items = router.items.map((item) => (item ? routerWithBasicSetting(item) : item));
  }
  return router as {items: DefaultTheme.SidebarItem[]; base: string};
}
