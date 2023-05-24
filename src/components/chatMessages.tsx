'use client';

import { MessagesContext } from '@/context/messages'
import { cn } from '@/lib/utils'
import { FC, HtmlHTMLAttributes, useContext } from 'react'
import  Image  from 'next/image';
import botLogo from '../../public/openai-logo.png'
import userPic from '../../public/man.png'

interface ChatMessagesProps extends HtmlHTMLAttributes<HTMLDivElement> {
  
}

const chatMessages: FC<ChatMessagesProps> = ({className, ...props}) => {
    const {messages} = useContext(MessagesContext)
    const inverseMessages = [ ...messages].reverse()

    return <div {...props} className={cn(
        'flex flex-col-reverse gap-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'
        , className)}>
            <div className='flex-1 flex-grow'/>
            {inverseMessages.map((message) => (
                <div key={message.id} className='chat-message'>
                    <div className={cn('flex flex-col justify-end',{
                        'items-end': message.isUserMessage
                    })}>
                        <div className='bg-white rounded-full w-max mb-2'>
                        <Image alt='Picture of the author' src={
                            message.isUserMessage ? userPic : botLogo
                        } 
                        width={35}
                        height={35}/> 
    
                        </div>
                        <div className={cn('flex flex-col space-y-2 text-sm max-w-xs mx-2 overflow-x-hidden rounded-lg', {
                            'bg-blue-600 text-white': message.isUserMessage,
                            'bg-gray-200 text-gray-900': !message.isUserMessage,
                        })}>
                            
                            <p className={cn('px-4 py-2 ')}>
                                {message.text}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
            </div>
}

export default chatMessages