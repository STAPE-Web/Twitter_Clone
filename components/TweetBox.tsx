import React, { MouseEvent, useRef, useState, Dispatch, SetStateAction } from 'react'
import { CalendarIcon, EmojiHappyIcon, LocationMarkerIcon, PhotographIcon, SearchCircleIcon } from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import { TweetBody, Tweet } from '../typings'
import { fetchTweets } from '../utils/fetchTweets'
import toast from 'react-hot-toast'

export interface Props {
    setTweets: Dispatch<SetStateAction<Tweet[]>>
}

const TweetBox = ({ setTweets }: Props) => {

    const [input, setInput] = useState<string>('')
    const [image, setImage] = useState<string>('')

    const imageInputRef = useRef<HTMLInputElement>(null)

    const addImageToTweet = (e: React.MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault()

        if (!imageInputRef.current?.value) return

        setImage(imageInputRef.current?.value)
        imageInputRef.current.value = ''
        setImageUrlBoxIsOpen(false)
    }

    const postTweet = async () => {
        const tweetInfo: TweetBody = {
            text: input,
            username: session?.user?.name || 'Unknown User',
            profileImg: session?.user?.image || 'https://links.papareact.com/gll',
            tweetImg: image,
        }
        const result = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/addTweet`, {
            body: JSON.stringify(tweetInfo),
            method: 'POST'
        })

        const json = await result.json()
        const newTweets = await fetchTweets()
        setTweets(newTweets)

        toast('Tweet Posted', {
            icon: '🚀'
        })
        return json
    }

    const handleSubmit = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault()

        postTweet()

        setInput('')
        setImage('')
        setImageUrlBoxIsOpen(false)
    }

    const { data: session } = useSession()
    const [imageUrlBoxIsOpen, setImageUrlBoxIsOpen] = useState<boolean>(false)

    return (
        <div className='flex space-x-2 p-5'>
            <img src={session?.user?.image || "https://links.papareact.com/gll"} alt="" className='h-14 w-14 rounded-full object-cover mt-4' />

            <div className='flex flex-1 items-center pl-2'>
                <form className='flex flex-1 flex-col'>
                    <input type="text" placeholder="What's Happening?" className='h-24 w-full text-xl outline-none placeholder:text-xl' value={input} onChange={e => setInput(e.target.value)} />
                    <div className='flex items-center'>
                        <div className='flex space-x-2 text-twitter flex-1'>
                            <PhotographIcon onClick={() => setImageUrlBoxIsOpen(!imageUrlBoxIsOpen)} className='h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150' />
                            <SearchCircleIcon className='h-5 w-5' />
                            <EmojiHappyIcon className='h-5 w-5' />
                            <CalendarIcon className='h-5 w-5' />
                            <LocationMarkerIcon className='h-5 w-5' />
                        </div>

                        <button onClick={handleSubmit} disabled={!input || !session} className='bg-twitter px-5 py-2 font-bold text-white rounded-full disabled:opacity-40'>Tweet</button>
                    </div>
                    {imageUrlBoxIsOpen && (
                        <form className='mt-5 flex rounded-lg bg-twitter/80 py-2 px-4 '>
                            <input ref={imageInputRef} type="text" placeholder='Enter Image URL...' className='flex-1 bg-transparent p-2 text-white outline-none placeholder:text-white' />
                            <button type='submit' onClick={addImageToTweet} className='font-bold text-white'>Add Image</button>
                        </form>
                    )}
                    {image && <img className='mt-10 h-40 w-full rounded-xl object-contain shadow-lg' src={image} alt="" />}
                </form>
            </div>
        </div >
    )
}

export default TweetBox