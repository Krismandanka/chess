import React, { ReactNode } from 'react'
import { ClerkProvider, ClerkProviderProps } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const ClearkPro = ({children}:{children:ReactNode}) => {
  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        {children}

    </ClerkProvider>
  )

  
}

export default ClearkPro