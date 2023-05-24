import { FC } from 'react'
import ChatInput from './chatInput'
import ChatHeader from './chatHeader'
import ChatMessages from './chatMessages'

const chat: FC = ({}) => {
return <div className='w-screen flex flex-col items-center justify-center background'>
         <ChatHeader />

         <div className='w-full md:w-1/2 flex flex-col height-full'>
            <ChatMessages className='px-2 py-4 flex-1'/>
            <ChatInput className='mx-4'/>
         </div>

       </div>
}

export default chat