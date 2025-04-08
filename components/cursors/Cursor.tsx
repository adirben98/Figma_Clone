import CursorSVG from '@/public/assets/CursorSVG'
import React from 'react'

type Props={
    color:string
    x:number
    y:number
    message:string
}
export default function Cursor({color,x,y,message}:Props) {
  return (
    <div className='pointer-events-none absolute top-0 left-0' style={{transform:`translateX(${x}px) translateY(${y}px)`}}>
        <CursorSVG color={color} />
        {message && (
            <div className={`px-4 py-2 text-sm leading-relaxed text-white rounded-[20px]`} style={{backgroundColor:color}}>
                <p className='text-white text-sm'>{message}</p>
            </div>
        )}
    </div>
  )
}
