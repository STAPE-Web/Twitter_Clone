import { RefreshIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'
import { Tweet } from '../typings'
import TweetBox from './TweetBox'
import TweetComponent from './Tweet'
import { fetchTweets } from '../utils/fetchTweets'
import toast from 'react-hot-toast'

export interface Props {
    tweets: Tweet[]
}

const Feed = ({ tweets: tweetsProp }: Props) => {

    const [tweets, setTweets] = useState<Tweet[]>(tweetsProp)
    const handleRefresh = async () => {
        const refreshToast = toast.loading('Refreshing...')
        const tweets = await fetchTweets()
        setTweets(tweets)

        toast.success('Feed Updated!', {
            id: refreshToast
        })
    }

    return (
        <div className='col-span-7 lg:col-span-5 border-x max-h-screen overflow-scroll'>
            <div className='flex items-center justify-between p-5 pb-0'>
                <h1 className='text-xl font-bold'>Home</h1>
                <RefreshIcon onClick={handleRefresh} className='h-8 w-8 cursor-pointer text-twitter transition-all duration-500 ease-out hover:rotate-180 active:scale-125' />
            </div>

            <div>
                <TweetBox setTweets={setTweets} />
            </div>

            <div>
                {tweets.map(tweet => (
                    <TweetComponent
                        key={tweet._id}
                        tweet={tweet}
                    />
                ))}
            </div>
        </div>
    )
}

export default Feed