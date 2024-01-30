import {defineConfig} from 'vitepress';
// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: '笔记',
  description: '笔记',
  lastUpdated: true,
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {text: 'Home', link: '/'},
      {text: 'LeetCode', link: '/leet-code'},
      {text: 'es', link: '/es/let-const'},
      {text: 'others', link: '/others'},
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
    ],
    // socialLinks: [{icon: 'github', link: 'https://github.com/vuejs/vitepress'}],
  },
});
