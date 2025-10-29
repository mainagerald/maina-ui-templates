// Forum types matching the backend data structure

// Thread interface
export interface Thread {
  public_id: string;
  title?: string;
  content: string;
  author: {
    public_id: string;
    username: string;
    email: string;
  };
  views: number;
  created_at: string;
  updated_at: string;
  is_pinned: boolean;
  comments_count: number;
  category: string;
  tags: string[];
}

// Comment interface
export interface Comment {
  public_id: string;
  thread: string;
  author: {
    public_id: string;
    username: string;
    email: string;
  };
  content: string;
  created_at: string;
  updated_at: string;
  parent?: string;
  replies: Comment[];
  is_author: boolean;
}

// Thread detail interface with comments
export interface ThreadDetail extends Thread {
  comments: {
    results: Comment[];
    next: string | null;
    has_more: boolean;
  };
}
