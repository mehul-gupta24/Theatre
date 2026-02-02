import React, { useState } from 'react'
import BlurCircle from './BlurCircle'
import { ChevronLastIcon, ChevronLeft, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const DateSelect = ({dateTime, id, selected, updateSelectedDate}) => {
    const navigate = useNavigate();
    const onBookHandler = () => {
        if(!selected){
            return toast('Please Select a date')
        }
        navigate(`/movies/${id}/${selected}`)
        scrollTo(0,0)
    }
    

  return (
    <div id='dateSelect' className='pt-30'>
        <div className='flex flex-col md:flex-row items-center justify-between gap-10 relative p-8 bg-primary/10 border border-primary/20  rounded-lg'>
            <BlurCircle top='-100px' left='-100px' />
            <BlurCircle top='100px' right='0px' />
            <div>
                <p className='text-lg font-semibold'>
                    Choose Date
                </p>
                <div className="flex items-center gap-5 text-sm mt-5">
                    <ChevronLeftIcon width={28} />
                    <span className='grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4'>
                        {Object.keys(dateTime).map((date)=>(
                            <button onClick={()=> updateSelectedDate(date)} className={`flex border border-primary flex-col items-center justify-center h-14 w-14 aspect-square rounded cursor-pointer ${selected === date ? "bg-primary text-white": "border border-primary/70" }`} key={date}>
                                <span>{new Date(date).getDate()}</span>
                                <span>{new Date(date).toLocaleDateString("en-US",{month:"short"})}</span>
                            </button>
                        ))}
                    </span>
                    <ChevronRightIcon width={28} />
                </div>
            </div>
            <div>
                <button onClick={onBookHandler} className='bg-primary rounded text-lg px-8 mt-6 text-white hover:bg-primary/90 transition-all cursor-pointer py-2'>Book Now</button>
            </div>

        </div>
        {/* cedce */}
    </div>
  )
}

export default DateSelect
