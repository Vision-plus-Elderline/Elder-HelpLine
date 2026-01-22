import React from 'react'
import Header from './Header'
import { useAuth } from '@/hooks/useAuth';
import EnhancedFooter from './EnhaceFooter';

function Privacy() {
    const user =useAuth();
  return (
    <div>
<Header user={user}/>
<div>
    <h1 className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight animate-slide-up">
        Privacy Policy
    </h1>
</div>
<EnhancedFooter/>
    </div>
  )
}

export default Privacy