export type User = {
    id: number;
    username: string;
    email: string;
    profile_description?: string;
    profile_picture?: string;
    dark_mode?: boolean;
};

export type Post = {
    id: number;
    title: string;
    content?: string;
    community_id: number;
    user_id: number;
    username: string;
    community_name: string;
    created_at: string;
    preview_image?: string;
    upvotes?: number;
    comments?: number;
};
