export interface ConfigFormat {
  type?: string;
  min?: number;
  max?: number;
  regex?: string;
  contains?: string[];
}