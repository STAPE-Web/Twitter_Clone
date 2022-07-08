import React, { useEffect, useState } from 'react'
import { Comment, CommentBody, Tweet } from '../typings'
import TimeAgo from 'react-timeago'
import { ChatAlt2Icon, HeartIcon, SwitchHorizontalIcon, UploadIcon } from '@heroicons/react/outline'
import { fetchComments } from '../utils/fetchComments'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

export interface Props {
    tweet: Tweet
}

const TweetComponent = ({ tweet }: Props) => {
    const [comments, setComments] = useState<Comment[]>([])
    const [commentBoxVisible, setCommentBoxVisible] = useState<boolean>(false)
    const [input, setInput] = useState<string>('')
    const { data: session } = useSession()

    const refreshComments = async () => {
        const comments: Comment[] = await fetchComments(tweet._id)
        setComments(comments)
    }

    const postComment = async () => {
        const commentInfo: CommentBody = {
            comment: input,
            username: session?.user?.name || 'Unknown User',
            profileImg: session?.user?.image || 'https://links.papareact.com/gll',
            tweetId: tweet._id
        }

        console.log(tweet._id);


        const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/addComment`, {
            body: JSON.stringify(commentInfo),
            method: 'POST'
        })

        const json = await result.json()
        const newComment = await fetchComments(tweet._id)
        setComments(newComment)

        toast('Comment Posted', {
            icon: '🚀'
        })
        return json
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        postComment()

        setInput('')
        setCommentBoxVisible(false)
    }

    useEffect(() => {
        refreshComments()
    }, [])

    return (
        <div className='flex flex-col space-x-3 border-y border-gray-100 p-5'>
            <div className='flex space-x-3'>
                <img className='h-10 w-10 rounded-full object-cover' src={tweet.profileImg} alt="" />
                <div>
                    <div className='flex items-center'>
                        <p className='mr-1 font-bold'>{tweet.username}</p>
                        <p className='hidden text-sm text-gray-500 sm:inline'>@{tweet.username.replace(/\s+/g, '').toLowerCase()} •</p>
                        <TimeAgo className='text-sm text-gray-500' date={tweet._createdAt} />
                    </div>

                    <p className='pt-1'>{tweet.text}</p>

                    {tweet.tweetImg && (<img src={tweet.tweetImg} alt='' className='m-5 ml-0 mb-1 max-h-60 rounded-lg shadow-sm' />)}
                </div>
            </div>
            <div className='flex justify-between mt-5'>
                <div onClick={() => setCommentBoxVisible(!commentBoxVisible)} className='flex cursor-pointer items-center space-x-3 text-gray-400'>
                    <ChatAlt2Icon className='h-5 w-5' />
                    <p>{comments.length}</p>
                </div>
                <div className='flex cursor-pointer items-center space-x-3 text-gray-400'>
                    <SwitchHorizontalIcon className='h-5 w-5' />
                </div>

                <div className='flex cursor-pointer items-center space-x-3 text-gray-400'>
                    <HeartIcon className='h-5 w-5' />
                </div>
                <div className='flex cursor-pointer items-center space-x-3 text-gray-400'>
                    <UploadIcon className='h-5 w-5' />
                </div>
            </div>

            {commentBoxVisible && (
                <form className='mt-3 flex space-x-3' onSubmit={handleSubmit}>
                    <input value={input} onChange={e => setInput(e.target.value)} className='flex-1 rounded-lg bg-gray-100 p-2 outline-none' type="text" placeholder='Write a comment...' />
                    <button className='text-twitter disabled:text-gray-200' disabled={!input} type='submit'>Post</button>
                </form>
            )}

            {comments?.length > 0 && (
                <div className='my-2 mt-5 max-h-44 space-y-5 overflow-y-scroll border-t border-gray-100 p-5'>
                    {comments.map((comment) => (
                        <div key={comment._id} className='relative flex space-x-2'>
                            <hr className='absolute left-5 top-10 h-8 border-x border-twitter/30' />
                            <img src={comment.profileImg} className='mt-2 w-7 h-7 object-cover rounded-full' alt="" />
                            <div>
                                <div className='flex items-center space-x-1'>
                                    <p className='mr-1 font-bold'>{comment.username}</p>
                                    <p className='hidden text-sm text-gray-500 lg:inline'>
                                        @{comment.username.replace(/\s+/g, '').toLowerCase()} •
                                    </p>
                                    <TimeAgo className='text-sm text-gray-500 ' date={comment._createdAt} />
                                </div>
                                <p>{comment.comment}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default TweetComponent