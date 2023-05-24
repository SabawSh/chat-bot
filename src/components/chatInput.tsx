"use client"

import { cn } from '@/lib/utils'
import { useMutation } from '@tanstack/react-query'
import { nanoid } from 'nanoid'
import { ChangeEvent, FC, HTMLAttributes, useContext, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { Message, MessageSchema } from '../lib/validators/message';
import { MessagesContext } from '@/context/messages'
import toast, { Toaster } from 'react-hot-toast';
interface ChatInputProps extends HTMLAttributes<HTMLDivElement>{
  
}

const chatInput: FC<ChatInputProps> = ({className, ...props}) => {
    const [input, setinput] = useState<string>('')
    const {messages, addMessage, removeMessage, updateMessage, setIsMessageUpdating} = useContext(MessagesContext)
    const textareaRef = useRef<null | HTMLTextAreaElement>(null)

  // send message to API /api/message endpoint
    const {mutate: sendMessage, isLoading} = useMutation({
        mutationFn:async (message: Message) => {
            const response = await fetch('/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({messages: [message]})
            })

            if(!response.ok) {
               throw new Error() 
            }

            return response.body
        },
        onMutate(message) {
            addMessage(message)
        },

        onSuccess:async (stream) => {
            if(!stream) throw new Error('No stream found')  
            
            const id = nanoid()
            const responseMessage: Message = {
                id, 
                isUserMessage: false,
                text: ''
            }

            addMessage(responseMessage)

            setIsMessageUpdating(true)
            
            const reader = stream.getReader()
            const decoder = new TextDecoder()
            let done = false

            while(!done) {
                const {value, done: doneReading} = await reader.read()
                done = doneReading
                const chunkValue = decoder.decode(value)
                updateMessage(id, (prev) => prev + chunkValue)
            }
            
            setIsMessageUpdating(false)
            setinput('')

            setTimeout(() => {
                textareaRef.current?.focus()
            }, 10)

        },
        onError(_, message) {
            toast.error('Something went wrong! Please try again.')
            removeMessage(message.id)
            textareaRef.current?.focus()
        },
    })


    const keyDownHandler = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault()


          const message: Message = {
            id: nanoid(),
            isUserMessage: true,
            text:input
          }
          

          sendMessage(message);
        }
      };
    const onClickHandler = () => {

          const message: Message = {
            id: nanoid(),
            isUserMessage: true,
            text:input
          }
          

          sendMessage(message);
        
      };

  return <div {...props} className={cn('border-t', className)}>
    <div className='relative mt-4 mb-10 flex items-center overflow-hidden rounded-lg border-none outline-none'>
    <TextareaAutosize
      ref= {textareaRef}
      onKeyDown={(e) => keyDownHandler(e)}
      rows={2}
      maxRows={4}
      autoFocus
      value={input}
      onChange={(e) => setinput(e.target.value)}
      placeholder='Write a message'
      className='peer disabled-opacity-50 py-3 rounded-2xl pr-14 resize-none block w-full border-0 bg-white py-1.5 text-gray-500 focus:ring-0 text-sm sm:leading-0'
      />
    <button onClick={onClickHandler} className='rounded-full bg-white p-2 ml-3' disabled={input.length === 0}>
    <svg className={cn(
    {
        'opacity-50': input.length === 0
    })}
     width={30} xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 32 32" viewBox="0 0 32 32" id="send"><path fill='#1c75c9' d="M30.5,14.58997l-28-10c-0.54999-0.19995-1.16998-0.04999-1.58002,0.37C0.51001,5.38,0.39001,6.01001,0.60999,6.56l2.91882,7.31079C3.68054,14.25073,4.0484,14.5,4.45752,14.5h7.70245c0.83002,0,1.5,0.66998,1.5,1.5c0,0.82996-0.66998,1.5-1.5,1.5H4.45752c-0.40912,0-0.77698,0.24921-0.92871,0.62921L0.60999,25.44c-0.21997,0.54999-0.09998,1.17999,0.31,1.59998C1.21002,27.33997,1.59998,27.5,2,27.5c0.16998,0,0.34003-0.03003,0.5-0.09003l28-10c0.59998-0.20996,1-0.77997,1-1.40997S31.09998,14.79999,30.5,14.58997z"></path></svg>
    </button>
    </div>
    <Toaster />
  </div>
}

export default chatInput