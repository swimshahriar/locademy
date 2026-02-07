export interface Video {
  id: string;
  title: string;
  path: string;
  completed: boolean;
  order: number;
}

export interface Module {
  id: string;
  title: string;
  videos: Video[];
  order: number;
}

export interface Course {
  id: string;
  title: string;
  path: string;
  modules: Module[];
  added_at: number;
}
