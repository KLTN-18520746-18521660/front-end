export interface LinkItem {
  id?: string;
  name?: string;
  icon?: string;
  color?: string;
  iconColor?: string;
  style?: string;
  value?: string;
  url?: string;
  routerLink?: string;
  command?: (event?: any) => void;
};