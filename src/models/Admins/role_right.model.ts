export interface Role {
  id?: number;
  role_name?: string;
  display_name?: string;
  describe?: string;
  rights: {
    [key: string]: RightDetail;
  };
  priority?: boolean;
  status?: string;
}

export interface Right {
  id?: number;
  right_name?: string;
  display_name?: string;
  describe?: string;
  status?: string;
}

export interface RightDetail {
  read?: boolean;
  write?: boolean;
}