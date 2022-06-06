export interface ConfigFormat {
  /**
   * type: string, boolean, integer
   */
  type?: string;
  min?: number;
  max?: number;
  regex?: string;
  contains?: string[];
}

export interface ConfigWithFormat {
  key?: string;
  value?: any;
  format?: ConfigFormat;
};