import React, { Profiler } from 'react'
import { Button } from './ui/button'
import { LogIn, LogOut, Settings, User, User2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

function Header({ user }) {
  const navigate = useNavigate();
  const { signOut, isAdmin } = useAuth();
  const userDetails=user?.user_metadata?.full_name
// console.log(userDetails);
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 md:px-4">
        {/* Mobile View: Professional and Compact */}
        <div className="flex flex-col md:hidden py-1.5">
          <div className="flex items-center justify-between w-full mb-1">
            <div className="flex items-center gap-2">
              <img
                src="/icons/emblem.png"
                alt="Emblem"
                className="h-9 w-auto"
              />
              <div className="flex flex-col">
                <h1 className="text-[11px] font-extrabold text-slate-900 leading-none">Ministry of Social Justice & Empowerment</h1>
                <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter leading-none ">Dept. of Social Justice & Empowerment</span>
                <span className="text-[8px] font-medium text-slate-600 ">Government of India</span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {user ? (
                <div className="flex items-center gap-1">
                  {isAdmin && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/admin')}
                      className="h-7 px-2 text-[9px] border-teal-600 text-teal-600 rounded-lg"
                    >
                      <Settings className="w-3 h-3 mr-1" />
                      Admin
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="h-7 px-2 text-[9px] text-slate-500 hover:text-red-600"
                  >
                    <LogOut className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate('/auth')}
                  className="h-7 px-3 text-[10px] bg-teal-600 text-white rounded-lg"
                >
                  <LogIn className="w-3 h-3 mr-1" />
                  Login
                </Button>
                
              )}{user?<User2/>:null}
              
                          </div>
          </div>

          <div className="flex items-center justify-between px-2 pt-1.5 border-t">
            <img src="/logo/nisd.png" alt="Elderline" className="h-5 w-auto object-contain" />
            <img src="/tcil.png" alt="TCIL" className="h-6 w-auto object-contain" />

            <img src="/logo/azadi.png" alt="Azadi" className="h-6 w-auto object-contain" />

            <img src="/icons/digitalindia.png" alt="Digital India" className="h-6 w-auto object-contain" />


          </div>
        </div>

        {/* Desktop View: Keep as is but with refined spacing */}
        <div className="hidden md:flex flex-row items-center justify-between py-4  ">
          {/* Government of India Section */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <img
              src="/icons/emblem.png"
              alt="Government of India Emblem"
              className="h-16 w-auto"
            />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Department of Social Justice & Empowerment</span>
              <h1 className="text-lg font-bold text-slate-900 leading-tight">Ministry of Social Justice & Empowerment</h1>
              <span className="text-xs font-medium text-slate-600">Government of India</span>
            </div>
          </div>

          {/* Logos Section */}
          <div className="flex justify-center items-center gap-8 rounded-b-lg  h-20" >
            <img src="/logo/nisd.png" alt="TCIL Logo" className="h-14 w-auto object-contain" />
            <img src="/tcil.png" alt="TCIL Logo" className="h-14 w-auto object-contain" />
            <img src="/icons/digitalindia.png" alt="Digital India" className="h-12 w-auto object-contain" />

            <img src="/logo/azadi.png" alt="Azadi Ka Amrit Mahotsav" className="h-14 w-auto object-contain" />
            {/* <img src="/logo/elderline-logo.png" alt="Elderline Logo" className="h-12 w-auto object-contain" /> */}

          </div>

          {/* Auth Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {isAdmin && (
                  <Button
                    variant="outline"
                    onClick={() => navigate('/admin')}
                    className="border-teal-600 text-teal-600 hover:bg-teal-500"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Admin Panel
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-slate-600 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="default"
                onClick={() => navigate('/auth')}
                className="bg-teal-600 hover:bg-teal-700 text-white px-6"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Button>
            )}
            <div className='flex items-center'>
              
              {/* <span className="text-sm font-medium text-slate-600">{userDetails}</span> */}
            {user?<User2 className="w-6 h-6 bg-slate-200 rounded-full" />:null}
            </div>
            
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;