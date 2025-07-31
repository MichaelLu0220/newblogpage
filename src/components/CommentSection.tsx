'use client';

import { useState, useEffect } from 'react';
import { FaUser, FaReply, FaHeart, FaTrash, FaPaperPlane, FaComment, FaClock } from 'react-icons/fa';

interface Comment {
    id: string;
    author: string;
    email: string;
    content: string;
    timestamp: Date | string;
    likes: number;
    replies: Comment[];
    parentId?: string;
}

interface CommentSectionProps {
    postSlug: string;
}

export default function CommentSection({ postSlug }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState({
        author: '',
        email: '',
        content: '',
    });
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [language, setLanguage] = useState<'en' | 'zh'>('en');
    const [mounted, setMounted] = useState(false);

    // 語言文字對照
    const texts = {
        en: {
            commentsTitle: 'Comments',
            commentsCount: 'comments',
            commentsDescription: 'Welcome to share your thoughts and suggestions, let\'s discuss together!',
            nickname: 'Nickname',
            nicknameRequired: 'Nickname *',
            nicknamePlaceholder: 'Enter your nickname',
            emailOptional: 'Email (optional)',
            emailPlaceholder: 'your@email.com',
            commentContent: 'Comment Content',
            commentContentRequired: 'Comment Content *',
            commentPlaceholder: 'Share your thoughts...',
            submitComment: 'Post Comment',
            submitting: 'Posting...',
            reply: 'Reply',
            cancel: 'Cancel',
            replying: 'Replying...',
            replyPlaceholder: 'Write your reply...',
            guest: 'Guest',
            noComments: 'No comments yet, be the first to comment!',
            timeJustNow: 'Just now',
            timeMinutesAgo: 'minutes ago',
            timeHoursAgo: 'hours ago',
            timeDaysAgo: 'days ago',
            timeUnknown: 'Unknown time'
        },
        zh: {
            commentsTitle: '留言討論',
            commentsCount: '則留言',
            commentsDescription: '歡迎留下你的想法和建議，讓我們一起討論！',
            nickname: '暱稱',
            nicknameRequired: '暱稱 *',
            nicknamePlaceholder: '請輸入你的暱稱',
            emailOptional: 'Email (選填)',
            emailPlaceholder: 'your@email.com',
            commentContent: '留言內容',
            commentContentRequired: '留言內容 *',
            commentPlaceholder: '寫下你的想法...',
            submitComment: '發表留言',
            submitting: '發送中...',
            reply: '回覆',
            cancel: '取消',
            replying: '回覆',
            replyPlaceholder: '寫下你的回覆...',
            guest: '訪客',
            noComments: '還沒有人留言，成為第一個留言的人吧！',
            timeJustNow: '剛剛',
            timeMinutesAgo: '分鐘前',
            timeHoursAgo: '小時前',
            timeDaysAgo: '天前',
            timeUnknown: '時間未知'
        }
    };

    // 初始化和語言變更監聽
    useEffect(() => {
        setMounted(true);
        
        const handleLanguageChange = (event: CustomEvent<'en' | 'zh'>) => {
            setLanguage(event.detail);
        };

        window.addEventListener('languageChange', handleLanguageChange as EventListener);

        // 從localStorage讀取保存的語言設置
        const savedLanguage = localStorage.getItem('language') as 'en' | 'zh' | null;
        if (savedLanguage) {
            setLanguage(savedLanguage);
        }

        return () => {
            window.removeEventListener('languageChange', handleLanguageChange as EventListener);
        };
    }, []);

    // 模擬載入評論數據
    useEffect(() => {
        if (!mounted) return;

        const savedComments = localStorage.getItem(`comments-${postSlug}`);
        if (savedComments) {
            const parsed = JSON.parse(savedComments);
            const processComments = (comments: any[]): Comment[] => {
                return comments.map((c: any) => ({
                    ...c,
                    timestamp: new Date(c.timestamp),
                    replies: c.replies ? processComments(c.replies) : []
                }));
            };
            setComments(processComments(parsed));
        } else {
            // 添加一些示例評論
            const sampleComments: Comment[] = [
                {
                    id: '1',
                    author: 'Alice Chen',
                    email: 'alice@example.com',
                    content: language === 'en' 
                        ? 'Great article! Very clear explanation and very helpful to me. Especially the part about technical implementation, I learned a lot of new knowledge.'
                        : '這篇文章寫得很棒！解釋得很清楚，對我很有幫助。特別是關於技術實現的部分，讓我學到了很多新知識。',
                    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
                    likes: 5,
                    replies: [
                        {
                            id: '1-1',
                            author: 'Bob Wang',
                            email: 'bob@example.com',
                            content: language === 'en' 
                                ? 'Agreed! The author\'s writing style is very easy to understand.'
                                : '同意！作者的寫作風格很容易理解。',
                            timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
                            likes: 2,
                            replies: [],
                            parentId: '1'
                        }
                    ]
                },
                {
                    id: '2',
                    author: 'Charlie Liu',
                    email: 'charlie@example.com',
                    content: language === 'en' 
                        ? 'I have a small question. I encountered some difficulties in practical application. I wonder if the author has any related suggestions?'
                        : '有一個小問題想請教，在實際應用中遇到了一些困難，不知道作者有沒有相關的建議？',
                    timestamp: new Date(Date.now() - 30 * 60 * 1000),
                    likes: 1,
                    replies: []
                }
            ];
            setComments(sampleComments);
        }
    }, [postSlug, mounted, language]);

    // 防止水合錯誤
    if (!mounted) {
        return <div className="mt-16"></div>;
    }

    // 保存評論到 localStorage
    const saveComments = (updatedComments: Comment[]) => {
        // 確保所有 timestamp 都是有效的 Date 對象
        const sanitizedComments = updatedComments.map(comment => ({
            ...comment,
            timestamp: comment.timestamp instanceof Date ? comment.timestamp : new Date(comment.timestamp),
            replies: comment.replies.map(reply => ({
                ...reply,
                timestamp: reply.timestamp instanceof Date ? reply.timestamp : new Date(reply.timestamp)
            }))
        }));

        localStorage.setItem(`comments-${postSlug}`, JSON.stringify(sanitizedComments));
        setComments(sanitizedComments);
    };

    // 提交新評論
    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.author.trim() || !newComment.content.trim()) return;

        setIsSubmitting(true);

        // 模擬 API 延遲
        await new Promise(resolve => setTimeout(resolve, 1000));

        const comment: Comment = {
            id: Date.now().toString(),
            author: newComment.author.trim(),
            email: newComment.email.trim(),
            content: newComment.content.trim(),
            timestamp: new Date(),
            likes: 0,
            replies: []
        };

        const updatedComments = [comment, ...comments];
        saveComments(updatedComments);

        setNewComment({ author: '', email: '', content: '' });
        setIsSubmitting(false);
    };

    // 提交回覆
    const handleSubmitReply = async (parentId: string) => {
        if (!replyContent.trim()) return;

        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 800));

        const reply: Comment = {
            id: `${parentId}-${Date.now()}`,
            author: texts[language].guest,
            email: '',
            content: replyContent.trim(),
            timestamp: new Date(),
            likes: 0,
            replies: [],
            parentId
        };

        const updatedComments = comments.map(comment => {
            if (comment.id === parentId) {
                return {
                    ...comment,
                    replies: [...comment.replies, reply]
                };
            }
            return comment;
        });

        saveComments(updatedComments);
        setReplyContent('');
        setReplyingTo(null);
        setIsSubmitting(false);
    };

    // 點讚功能
    const handleLike = (commentId: string, isReply = false, parentId?: string) => {
        const updatedComments = comments.map(comment => {
            if (isReply && parentId && comment.id === parentId) {
                return {
                    ...comment,
                    replies: comment.replies.map(reply =>
                        reply.id === commentId
                            ? { ...reply, likes: reply.likes + 1 }
                            : reply
                    )
                };
            } else if (comment.id === commentId) {
                return { ...comment, likes: comment.likes + 1 };
            }
            return comment;
        });
        saveComments(updatedComments);
    };

    // 格式化時間
    const formatTime = (timestamp: Date | string) => {
        const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

        // 檢查日期是否有效
        if (isNaN(date.getTime())) {
            return texts[language].timeUnknown;
        }

        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (minutes < 1) return texts[language].timeJustNow;
        if (minutes < 60) return `${minutes} ${texts[language].timeMinutesAgo}`;
        if (hours < 24) return `${hours} ${texts[language].timeHoursAgo}`;
        if (days < 7) return `${days} ${texts[language].timeDaysAgo}`;
        
        if (language === 'en') {
            return date.toLocaleDateString('en-US');
        } else {
            return date.toLocaleDateString('zh-TW');
        }
    };

    // 渲染單個評論
    const renderComment = (comment: Comment, isReply = false) => (
        <div key={comment.id} className={`${isReply ? 'ml-12 mt-4' : 'mb-6'}`}>
            <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-sm border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-md">
                {/* 評論頭部 */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {comment.author.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                {comment.author}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                <FaClock size={12} />
                                <span>{formatTime(comment.timestamp)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 評論內容 */}
                <div className="mb-4">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {comment.content}
                    </p>
                </div>

                {/* 評論操作 */}
                <div className="flex items-center gap-4 text-sm">
                    <button
                        onClick={() => handleLike(comment.id, isReply, comment.parentId)}
                        className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    >
                        <FaHeart />
                        <span>{comment.likes}</span>
                    </button>

                    {!isReply && (
                        <button
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                        >
                            <FaReply />
                            <span>{texts[language].reply}</span>
                        </button>
                    )}
                </div>

                {/* 回覆表單 */}
                {replyingTo === comment.id && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex gap-3">
                            <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                                <FaUser size={12} />
                            </div>
                            <div className="flex-1">
                                <textarea
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder={texts[language].replyPlaceholder}
                                    className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                                    rows={3}
                                />
                                <div className="flex justify-end gap-2 mt-3">
                                    <button
                                        onClick={() => {
                                            setReplyingTo(null);
                                            setReplyContent('');
                                        }}
                                        className="px-4 py-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                                    >
                                        {texts[language].cancel}
                                    </button>
                                    <button
                                        onClick={() => handleSubmitReply(comment.id)}
                                        disabled={!replyContent.trim() || isSubmitting}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors flex items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <FaPaperPlane size={12} />
                                        )}
                                        {texts[language].replying}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 渲染回覆 */}
            {comment.replies.map(reply => renderComment(reply, true))}
        </div>
    );

    return (
        <div className="mt-16">
            {/* 評論區標題 */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <FaComment className="text-blue-500" size={24} />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {texts[language].commentsTitle}
                    </h2>
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium">
                        {comments.length} {texts[language].commentsCount}
                    </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                    {texts[language].commentsDescription}
                </p>
            </div>

            {/* 新增評論表單 */}
            <div className="mb-12">
                <div className="bg-white dark:bg-gray-800/50 rounded-2xl p-6 shadow-sm border border-gray-200/50 dark:border-gray-700/50">
                    <form onSubmit={handleSubmitComment}>
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {texts[language].nicknameRequired}
                                </label>
                                <input
                                    type="text"
                                    value={newComment.author}
                                    onChange={(e) => setNewComment({ ...newComment, author: e.target.value })}
                                    placeholder={texts[language].nicknamePlaceholder}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {texts[language].emailOptional}
                                </label>
                                <input
                                    type="email"
                                    value={newComment.email}
                                    onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                                    placeholder={texts[language].emailPlaceholder}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                                />
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {texts[language].commentContentRequired}
                            </label>
                            <textarea
                                value={newComment.content}
                                onChange={(e) => setNewComment({ ...newComment, content: e.target.value })}
                                placeholder={texts[language].commentPlaceholder}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-all"
                                rows={4}
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={!newComment.author.trim() || !newComment.content.trim() || isSubmitting}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-md transform hover:scale-105 disabled:transform-none"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <FaPaperPlane />
                                )}
                                {isSubmitting ? texts[language].submitting : texts[language].submitComment}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* 評論列表 */}
            <div>
                {comments.length > 0 ? (
                    <div className="space-y-6">
                        {comments.map(comment => renderComment(comment))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <FaComment className="mx-auto text-gray-300 dark:text-gray-600 mb-4" size={48} />
                        <p className="text-gray-500 dark:text-gray-400">
                            {texts[language].noComments}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}