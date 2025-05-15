import PostCard from './PostCard'

{/* Dummyposts för exempel */ }
const dummyPosts = [
    {
        title: 'Vad tycker ni om att gå i skolan?',
        body: 'Jag har alltid älskat det, men vad tycker ni?',
        community: 'skola',
        username: 'Erikblabla',
        upvotes: 12,
        comments: 5,
    },
    {
        title: 'Bästa pastareceptet?',
        body: 'Har någon ett riktigt gott pastarecept att dela med sig av? 😋🫤',
        community: 'mat',
        username: 'kockproffset1337',
        upvotes: 34,
        comments: 9,
    },
]

const PostList = () => {
    return (
        <>
            {dummyPosts.map((post, index) => (
                <PostCard
                    key={index}
                    title={post.title}
                    body={post.body}
                    community={post.community}
                    username={post.username}
                    upvotes={post.upvotes}
                    comments={post.comments}
                />
            ))}
        </>
    )
}

export default PostList
