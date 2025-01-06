export interface Database {
  public: {
    Tables: {
      todos: {
        Row: {
          id: string;
          title: string;
          completed: boolean;
          created_at: string;
          user_id: string;
        };
        Insert: {
          title: string;
          completed?: boolean;
          user_id: string;
        };
        Update: {
          title?: string;
          completed?: boolean;
        };
      };
    };
  };
}