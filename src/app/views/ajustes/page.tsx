import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col gap-5 mt-20 mx-3 w-max'>
      Ajustes page
      <a href="/views/ajustes/lavadoresconfig"
         className='text-white p-1 flex items-center justify-center bg-slate-500 rounded-md' 
      >
        Lavadores
      </a>
    </div>
  )
}

export default page