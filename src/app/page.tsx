'use client'

import OrdenesDashboard from '@/app/views/dashboard/lista-ordenes/page'
import ProtectedRoute from "./components/protectedRoute";


export default function Home() {
  return (
   <>
   <ProtectedRoute>
      <main>
          <OrdenesDashboard />
      </main>
   </ProtectedRoute>
   </>
  );
}
