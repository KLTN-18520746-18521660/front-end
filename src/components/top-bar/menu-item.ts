import { MenuItem } from "primeng/api";

export const TopBarMenuItem: MenuItem[] = [
  {
    id: '1',
    label: 'Technology',
    routerLink: ['/category', 'technology'],
  },
  {
    id: '2',
    label: 'Development',
    routerLink: ['/category', 'development']
  },
  {
    id: '3',
    label: 'Blogs',
    routerLink: ['/category', 'blogs']
  },
  {
    id: '4',
    label: 'Disscussion',
    routerLink: ['/category', 'disscussion']
  },
  {
    id: '5',
    label: 'More',
  }
];