export interface Album {
    id: number;
    name: string;
    cover?: string;
    upvotes: number;
    downvotes: number;
    total_votes: number;
    votes: number;
    userVote?: 'upvote' | 'downvote' | null;
  }