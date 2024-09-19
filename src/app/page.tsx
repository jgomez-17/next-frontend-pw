'use client'

import ProtectedRoute from "./components/protectedRoute";
import PrincipalPage from "./(auth)/principalPage/page";
import LoginPage from "./(auth)/login/page";


export default function Home () {

  return (
   <>
   <ProtectedRoute>
      {/* <PrincipalPage /> */}
      <LoginPage />
   </ProtectedRoute>
   </>
  );
}
