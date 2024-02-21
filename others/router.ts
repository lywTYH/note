import {DefaultTheme} from 'vitepress/types/default-theme';

const router: DefaultTheme.SidebarItem = {
  text: 'Others',
  base: '/others',
  items: [
    {
      text: '微任务和宏任务',
      link: '/macroTaskAndMicroTask',
    },
    {
      text: 'Git',
      base: '/git',
      items: [
        {
          text: 'Git commit message规范',
          link: '/commit',
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

export default router;
