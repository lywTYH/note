import {DefaultTheme} from 'vitepress/types/default-theme';

const router: DefaultTheme.SidebarItem = {
  text: 'JavaScript',
  collapsed: true,
  base: '/javascript',
  items: [
    {
      text: 'ES6',
      collapsed: false,
      items: [
        {
          text: 'let 和 const',
          link: '/es6/letAndConst',
        },
        {
          text: 'destructuring',
          link: '/es6/destructuring',
        },
        {
          text: 'math',
          link: '/es6/math',
        },
        {
          text: 'proxy',
          link: '/es6/proxy',
        },
        {
          text: 'generator',
          link: '/es6/generator',
        },
        {
          text: 'module',
          link: '/es6/module',
        },
      ],
    },
  ],
};

export default router;
