import { FC } from 'react'
import Image from 'next/image'
import botLogo from '../../public/openai-logo.png'

interface chatHeaderProps {
  
}

const chatHeader: FC<chatHeaderProps> = ({}) => {
  return <div className='w-full flex bg-white px-6 h-[70px] justify-start items-center text-zinc-800'>
    <div className='flex justify-start items-center'>
            <Image src={botLogo} alt="Open AI logo"
            width={40}
            height={40}/>
        <h3 className='text-gray-700 font-bold mx-4'> AI Chat Bot</h3>
      
    </div>
  </div>
}

export default chatHeader