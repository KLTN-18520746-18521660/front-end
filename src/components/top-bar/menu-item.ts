import { MenuItem } from "primeng/api";

export const TopBarMenuItem: MenuItem[] = [
  {
    id: '1',
    label: 'Technology',

    routerLink: ['/post']
  },
  {
    id: '2',
    label: 'Development',
    icon: 'pi pi-fw pi-pencil',
    url: 'development',
  },
  {
    id: '3',
    label: 'Blogs',
    icon: 'pi pi-fw pi-user',
  },
  {
    id: '4',
    label: 'Disscussion',
    icon: 'pi pi-fw pi-user',
  },
  {
    id: '5',
    label: 'More',
    icon: 'pi pi-fw pi-calendar',
    items: [
      {
        label: 'Edit',
        icon: 'pi pi-fw pi-pencil',
      },
      {
        label: 'Archieve',
        icon: 'pi pi-fw pi-calendar-times',
      }
    ]
  }
];