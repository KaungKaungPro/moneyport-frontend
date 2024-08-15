import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPostOne } from "../api/post";
import RouteNav from "../components/RouteNav";
import { getReplyPage, saveReply, sendReplyNotification } from "../api/reply";
import { saveUserPostLike } from "../api/userPostLike";
import { useAuth } from '../UserAccount/AuthContext';
import "./post.css";
import '../assets/icons/iconfont.css';
import './tailwind.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const PostDetail = () => {
    const { postId } = useParams();
    const [post, setPost] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [replyCount, setReplyCount] = useState(0);

    useEffect(() => {
        fetchPost();
    }, [postId]);

    const fetchPost = () => {
        setIsLoading(true);
        getPostOne({ postId: postId })
            .then((res) => {
                setPost(res.data);
                setReplyCount(res.data.replyCount);
            })
            .catch(() => {
                setError("Error: Failed to fetch post.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleLike = () => {
        saveUserPostLike({ postId })
            .then((res) => {
                if (res.code !== 200) {
                    alert(res.msg);
                    return;
                }
                fetchPost();
            })
            .catch(() => {
                alert("Error: Failed to like post.");
            });
    };

    const handleReplyAdded = () => {
        setReplyCount(prevCount => prevCount + 1);
    };

    if (isLoading) {
        return <div className="text-center">Loading post...</div>;
    }

    if (error) {
        return <div className="text-red-500 mb-4">{error}</div>;
    }

    if (!post) {
        return <div className="text-center">Post not found.</div>;
    }

    return (
        <div>
            <RouteNav />
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
                <p>{post.postContent}</p>

                <div className="d-flex flex-row justify-content-between">
                    <div className="group">
                        <span className="icon-item-text">
                            <i className="iconfont icon-pinglun"></i>
                            {replyCount}
                        </span>
                        <span className="icon-item-text">
                            <i className="iconfont icon-zan" onClick={handleLike}></i>
                            {post.likeCount}
                        </span>
                    </div>
                    <div className="group">
                        <span className="icon-item-text">Author: {post.username}</span>
                        <span>{post.postTime}</span>
                    </div>
                </div>
                <hr />
                <ReplyList postId={postId} onReplyAdded={handleReplyAdded} />
            </div>
        </div>
    );
};

const ReplyList = ({ postId, onReplyAdded }) => {
    const [replies, setReplies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchReplies(currentPage);
    }, [postId, currentPage]);

    const fetchReplies = (page) => {
        setIsLoading(true);
        getReplyPage({ postId: postId, pageNo: page, pageSize: 10 })
            .then((res) => {
                console.log("API response:", res);
                if (res.data.content && res.data.totalPages) {
                    setReplies(res.data.content);
                    setTotalPages(res.data.totalPages);
                } else if (res.content && res.totalPages) {
                    setReplies(res.content);
                    setTotalPages(res.totalPages);
                }
            })
            .catch(() => {
                setError("Error: Failed to fetch replies.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    const handleReplyAdded = (newReply, tempId = null) => {
        setReplies(prevReplies => {
            const updateRepliesRecursively = (replies) => {
                return replies.map(reply => {
                    if (reply.id === newReply.replyId) {
                        return {
                            ...reply,
                            children: [...(reply.children || []), newReply]
                        };
                    } else if (reply.children && reply.children.length > 0) {
                        return {
                            ...reply,
                            children: updateRepliesRecursively(reply.children)
                        };
                    }
                    return reply;
                });
            };

            if (!newReply) {
                return prevReplies.filter(reply => reply.id !== tempId);
            }

            if (tempId) {
                return updateRepliesRecursively(prevReplies);
            }

            onReplyAdded(); // Call the parent function to update the reply count for all new replies

            if (!newReply.replyId) {
                return [...prevReplies, newReply];
            }

            return updateRepliesRecursively(prevReplies);
        });
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Replies</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {isLoading ? (
                <div className="text-center">Loading replies...</div>
            ) : (
                replies.map((reply) => (
                    <ReplyItem
                        key={reply.id}
                        reply={reply}
                        postId={postId}
                        fetchReplies={fetchReplies}
                        currentPage={currentPage}
                        onReplyAdded={handleReplyAdded}
                    />
                ))
            )}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />
            <ReplyInput
                postId={postId}
                fetchReplies={fetchReplies}
                currentPage={currentPage}
                onReplyAdded={handleReplyAdded}
            />
        </div>
    );
};

const ReplyItem = ({ reply, postId, fetchReplies, currentPage, onReplyAdded }) => {
    const [replyingTo, setReplyingTo] = useState(null);

    const handleReplyTo = (reply) => {
        setReplyingTo(reply);
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
    };

    return (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg shadow-sm">
            <p className="text-gray-800 font-bold">
                {reply.user.username}
                {reply.ancestor && (
                    <span>
                        {" "}
                        reply to{" "}
                        <span className="text-blue-600">
                            {reply.ancestor.user.username}
                        </span>
                    </span>
                )}
            </p>
            <p className="text-gray-700 mt-2">{reply.content}</p>
            <p className="text-gray-500 text-sm mt-2">
                {reply.createTime} -{" "}
                <button
                    onClick={() => handleReplyTo(reply)}
                    className="text-blue-500 hover:text-blue-700"
                >
                    Reply
                </button>
            </p>
            {replyingTo && (
                <div className="mb-4 mt-2 p-2 bg-yellow-100 rounded">
                    <span className="text-gray-700">Replying to {replyingTo.user.username}</span>
                    <button
                        onClick={handleCancelReply}
                        className="float-right text-red-500 hover:text-red-700"
                    >
                        Cancel
                    </button>
                </div>
            )}
            {replyingTo && (
                <ReplyInput
                    postId={postId}
                    parentReplyId={reply.id}
                    fetchReplies={fetchReplies}
                    currentPage={currentPage}
                    onReplyAdded={onReplyAdded}
                />
            )}
            {reply.children && reply.children.length > 0 && (
                <div className="ml-4 mt-2 border-l-2 border-blue-200 pl-2">
                    {reply.children.map((childReply) => (
                        <ReplyItem
                            key={childReply.id}
                            reply={childReply}
                            postId={postId}
                            fetchReplies={fetchReplies}
                            currentPage={currentPage}
                            onReplyAdded={onReplyAdded}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const ReplyInput = ({ postId, parentReplyId, fetchReplies, currentPage, onReplyAdded }) => {
    const [replyContent, setReplyContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { user } = useAuth();

    const formatDate = (date) => {
        return new Intl.DateTimeFormat('default', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }).format(date);
    };

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting || !replyContent.trim()) return;

        setIsSubmitting(true);

        const now = new Date();
        const newReply = {
            postId: postId,
            content: replyContent,
            replyId: parentReplyId || null,
            id: 'temp_' + Date.now(),
            createTime: formatDate(now),
            user: {
                id: user.id,
                username: user.username,
            }
        };

        onReplyAdded(newReply);
        setReplyContent("");

        try {
            const saveResponse = await saveReply({
                postId: postId,
                content: replyContent,
                replyId: parentReplyId || null,
            });

            if (saveResponse.code !== 200) {
                throw new Error(saveResponse.msg);
            }

            const savedReply = saveResponse.data;

            sendReplyNotification(savedReply)
                .then(() => console.log("Notification request sent successfully"))
                .catch(error => {
                    console.error("Failed to send notification:", error);
                });

            onReplyAdded(savedReply, newReply.id);

            fetchReplies(currentPage);
        } catch (error) {
            console.error("Failed to post reply:", error);
            alert("Error: Failed to post reply. Please try again.");
            onReplyAdded(null, newReply.id);
            setReplyContent(newReply.content);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleReplySubmit} className="form mt-4">
            <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                rows="5"
                className="w-100 p-2 mb-4 border rounded"
                required
            />
            <button
                type="submit"
                className="btn px-4 py-2 bg-primary text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Posting...' : 'Reply'}
            </button>
        </form>
    );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];

    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="mt-4">
            <ul className="pagination justify-content-center">
                {pageNumbers.map((number) => (
                    <li
                        key={number}
                        className={`page-item ${currentPage === number ? "active" : ""}`}
                    >
                        <button onClick={() => onPageChange(number)} className="page-link">
                            {number}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default PostDetail;