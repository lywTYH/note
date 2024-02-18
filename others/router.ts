import {DefaultTheme} from 'vitepress/types/default-theme';

const router: DefaultTheme.SidebarItem = {
  text: 'Others',
  collapsed: true,
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
  ],
};

export default router;
