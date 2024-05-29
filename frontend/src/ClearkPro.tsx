import React, { ReactNode } from 'react'
import { ClerkProvider, ClerkProviderProps } from '@clerk/clerk-react'
import { Link, Outlet, useNavigate } from 'react-router-dom'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const ClearkPro = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} routerPush={(to) => navigate(to)}
      routerReplace={(to) => navigate(to, { replace: true })}>
      {children}

    </ClerkProvider>
  )


}

export default ClearkPro