import React, { Component } from 'react';

const BLOG_URL = 'https://itsavery.me/blog/';
const FEED_URL = 'https://itsavery.me/blog/feed.xml';

// Parse the Chirpy/jekyll-feed Atom feed into plain post objects
function parseFeed(xml) {
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    if (doc.querySelector('parsererror')) throw new Error('Invalid feed');

    return Array.from(doc.getElementsByTagName('entry')).map((entry) => {
        const text = (tag) => entry.getElementsByTagName(tag)[0]?.textContent.trim() || '';
        const link = entry.getElementsByTagName('link')[0];
        return {
            title: text('title'),
            url: link ? link.getAttribute('href') : BLOG_URL,
            published: text('published'),
            summary: text('summary'),
            tags: Array.from(entry.getElementsByTagName('category')).map((c) => c.getAttribute('term')),
        };
    });
}

function formatDate(iso) {
    const date = new Date(iso);
    if (isNaN(date)) return '';
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export class Blog extends Component {
    constructor() {
        super();
        this.state = { posts: [], status: 'loading' };
    }

    componentDidMount() {
        fetch(FEED_URL)
            .then((res) => {
                if (!res.ok) throw new Error(res.status);
                return res.text();
            })
            .then((xml) => this.setState({ posts: parseFeed(xml), status: 'ready' }))
            .catch(() => this.setState({ status: 'error' }));
    }

    renderBody() {
        const { posts, status } = this.state;

        if (status === 'loading') {
            return <p className="text-xs font-mono" style={{ color: '#555' }}>fetching feed...</p>;
        }
        if (status === 'error') {
            return (
                <p className="text-xs font-mono" style={{ color: '#999' }}>
                    Couldn't load the feed.{' '}
                    <a href={BLOG_URL} target="_blank" rel="noopener noreferrer" style={{ color: '#1793D1' }}>
                        Read the blog directly &rarr;
                    </a>
                </p>
            );
        }
        if (posts.length === 0) {
            return <p className="text-xs font-mono" style={{ color: '#555' }}>No posts yet.</p>;
        }
        return posts.map((post) => <PostCard key={post.url} post={post} />);
    }

    render() {
        return (
            <div className="w-full h-full flex flex-col" style={{ backgroundColor: '#1a1a1a' }}>
                <div className="flex items-center justify-between px-4 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-xs font-mono" style={{ color: '#7c7c7c' }}>itsavery.me/blog/feed.xml</span>
                    <div className="flex gap-2">
                        <a
                            href={FEED_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono px-3 py-1 rounded"
                            style={{ color: '#7c7c7c', border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            RSS
                        </a>
                        <a
                            href={BLOG_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-mono px-3 py-1 rounded"
                            style={{ color: '#1793D1', border: '1px solid rgba(23,147,209,0.3)' }}
                        >
                            Open Blog
                        </a>
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto px-4 py-4 flex flex-col gap-3 windowMainScreen">
                    {this.renderBody()}
                </div>
            </div>
        );
    }
}

function PostCard({ post }) {
    return (
        <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block px-4 py-3 rounded-lg font-mono transition-all duration-150 no-underline"
            style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.06)',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(23,147,209,0.08)';
                e.currentTarget.style.borderColor = 'rgba(23,147,209,0.2)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
            }}
        >
            <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-bold" style={{ color: '#e0e0e0' }}>{post.title}</span>
                <span className="flex-shrink-0" style={{ color: '#555', fontSize: '10px' }}>{formatDate(post.published)}</span>
            </div>
            {post.summary && (
                <p className="text-xs leading-relaxed mt-1" style={{ color: '#999' }}>{post.summary}</p>
            )}
            {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {post.tags.map((tag) => (
                        <span key={tag} style={{ color: '#1793D1', fontSize: '10px' }}>#{tag}</span>
                    ))}
                </div>
            )}
        </a>
    );
}

export default Blog;

export const displayBlog = () => {
    return <Blog />;
};
