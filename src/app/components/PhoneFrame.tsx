import { ReactNode } from "react";

interface PhoneFrameProps {
  children: ReactNode;
}

export function PhoneFrame({ children }: PhoneFrameProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-8">
      <div className="relative">
        {/* iPhone Frame */}
        <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-7 bg-black rounded-b-3xl z-10"></div>
          
          {/* Screen */}
          <div className="relative bg-white rounded-[2.5rem] overflow-hidden w-[375px] h-[812px]">
            {/* Status Bar */}
            <div className="absolute top-0 left-0 right-0 h-11 bg-transparent z-20 px-8 flex items-center justify-between text-xs font-semibold">
              <span className="text-black">9:41</span>
              <div className="flex items-center gap-1">
                <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M15.5 2.75C15.5 1.23122 14.2688 0 12.75 0C11.2312 0 10 1.23122 10 2.75V9.25C10 10.7688 11.2312 12 12.75 12C14.2688 12 15.5 10.7688 15.5 9.25V2.75ZM7 3.75C7 2.23122 5.76878 1 4.25 1C2.73122 1 1.5 2.23122 1.5 3.75V9.25C1.5 10.7688 2.73122 12 4.25 12C5.76878 12 7 10.7688 7 9.25V3.75Z" fill="black"/>
                </svg>
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                  <path fillRule="evenodd" clipRule="evenodd" d="M0 3C0 1.34315 1.34315 0 3 0H11C12.6569 0 14 1.34315 14 3V9C14 10.6569 12.6569 12 11 12H3C1.34315 12 0 10.6569 0 9V3ZM15 4V8C15.5523 8 16 7.55228 16 7V5C16 4.44772 15.5523 4 15 4Z" fill="black"/>
                </svg>
              </div>
            </div>
            
            {/* App Content */}
            <div className="w-full h-full">
              {children}
            </div>
          </div>
          
          {/* Volume Buttons */}
          <div className="absolute left-0 top-32 w-1 h-12 bg-black rounded-l-lg -translate-x-1"></div>
          <div className="absolute left-0 top-48 w-1 h-12 bg-black rounded-l-lg -translate-x-1"></div>
          
          {/* Power Button */}
          <div className="absolute right-0 top-40 w-1 h-16 bg-black rounded-r-lg translate-x-1"></div>
        </div>
      </div>
    </div>
  );
}
