import {defineConfig} from 'vitepress';
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '笔记',
  description: '笔记',
  lastUpdated: true,
  cleanUrls: true,
  base: '/note/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {text: 'Home', link: '/'},
      {text: 'LeetCode', link: '/leet-code'},
      {text: 'es', link: '/es/let-const'},
      {text: 'others', link: '/others/macroTaskAndMicroTask'},
    ],
    sidebar: [
      {
        text: 'ES',
        collapsed: true,
        items: [
          {
            text: 'let 和 const',
            link: '/es/let-const',
          },
        ],
      },
      {
        text: 'react',
        collapsed: true,
        items: [
          {
            text: 'let 和 const',
            link: '/react/let-const',
          },
        ],
      },
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
      {
        text: 'Others',
        collapsed: true,
        items: [
          {
            text: '微任务和宏任务',
            link: '/others/macroTaskAndMicroTask',
          },
          {
            text: 'Git',
            link: '/others/git',
          },
        ],
      },
    ],
    // socialLinks: [{icon: 'github', link: 'https://github.com/vuejs/vitepress'}],
  },
  srcExclude: ['**/node_modules/**', 'browser/**', 'bundler/**'],
});
