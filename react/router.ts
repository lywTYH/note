import {DefaultTheme} from 'vitepress/types/default-theme';

const router: DefaultTheme.SidebarItem = {
  text: 'react',
  collapsed: true,
  base: '/react',
  items: [
    {
      text: '理念',
      link: '/1_idea',
    },
    {
      text: 'render',
      link: '/2_render',
    },
  ],
};

export default router;
