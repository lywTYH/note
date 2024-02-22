import {DefaultTheme} from 'vitepress/types/default-theme';

const router: DefaultTheme.SidebarItem = {
  text: 'Others',
  base: '/others',
  items: [
    {
      text: '杂类',
      items: [
        {
          text: 'css',
          link: '/css',
        },
        {
          text: '浏览器',
          link: '/browser',
        },
        {
          text: 'webpack',
          link: '/webpack',
        },
        {
          text: '微任务和宏任务',
          link: '/macroTaskAndMicroTask',
        },
      ],
    },
    {
      text: 'Git',
      items: [
        {
          text: 'Git commit message规范',
          link: '/git/commit',
        },
      ],
    },
    {
      text: '微前端',
      items: [
        {
          text: '引言',
          link: '/micro-frontend/instruction',
        },
        {
          text: 'qiankun',
          link: '/micro-frontend/qiankun',
        },
      ],
    },
  ],
};
const nav = {text: 'Others', link: '/others/macroTaskAndMicroTask', activeMatch: '^/others/'};

export default {router, nav};
