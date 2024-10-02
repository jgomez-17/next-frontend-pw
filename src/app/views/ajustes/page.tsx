import React from 'react'
import Link from 'next/link'
import LavadoresConfig from '@/app/views/ajustes/lavadoresconfig/page'
import ProtectedRoute from '@/app/components/protectedRoute'

const page = () => {
  return (
    <>
    <ProtectedRoute allowedRoles={['admin', 'subadmin']}>
      <LavadoresConfig />
    </ProtectedRoute>
    </>
  )
}

export default page