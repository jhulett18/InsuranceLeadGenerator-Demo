"use client";
import Image from "next/image";
// import supabase from '@/app/api/supabase';
import { fetchLeads } from '@/app/api/supabase';
import  SimpleTable from '@/app/table-animation/table';
import '../app/page.css';

const handleButtonClick = () => {
  fetchLeads()
    .then(data => {
      console.log(data);  // Handle the resolved data
    })
    .catch(error => {
      console.error('Error fetching leads:', error);
    });
};


export default function Home() {
  return (
    



    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
  
  {/* Navbar */}
  <nav className="w-full flex justify-between items-center px-4 sm:px-8">
    {/* Left: Logo */}
    <div className="flex items-center gap-2">
      <Image
        className="dark:invert"
        src="/paper-stack.png"
        alt="Company Logo"
        width={40}
        height={40}
        priority
      />
      <span className="text-lg font-semibold">Insurance Leads</span>
    </div>

    {/* Center: Title */}
    {/* <h1 className="text-xl sm:text-2xl font-semibold">Saving Insurers Time</h1> */}

    {/* Right: Download Button */}
    <button className="download-btn flex items-center gap-2 p-2 border border-gray-300 rounded text-sm sm:text-base disabled:opacity-50"
      id="downloadBtn" disabled>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
      </svg>
      Download Excel
    </button>
  </nav>

  {/* Main Content */}
  <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
    
    <h1 className="text-xl sm:text-2xl font-semibold">Getting through the Forest</h1>

    {/* Description */}
    <p className="description text-center sm:text-left">
      This tool will scan various websites and collect expiring insurance leads for insurers to call. 
      When I built this in 2022, most people were manually copy-pasting each row into a spreadsheet, wasting 
      5+ hours of manual entry. I automated this process, delivering clean spreadsheets directly to their inbox every week.
    </p>

    {/* Call-to-Action Buttons */}
    <div className="flex gap-4 items-center flex-col sm:flex-row">
      <button 
        className="rounded-full border border-transparent transition-colors flex items-center justify-center bg-black text-white hover:bg-gray-800 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        onClick={handleButtonClick}
      >
        20 FREE LEADS
      </button>
      <a 
        className="rounded-full border border-solid border-gray-300 transition-colors flex items-center justify-center hover:bg-gray-100 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
        href="https://nextjs.org/docs"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn More
      </a>
    </div>

    {/* Table Component */}
    <SimpleTable/>

  </main>

  {/* Footer */}
  <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
    <a 
      className="flex items-center gap-2 hover:underline"
      target="_blank"
      rel="noopener noreferrer"
    >
      <Image src="/globe.svg" alt="Globe icon" width={16} height={16} />
      Built by Jonathan Hulett
    </a>
  </footer>

</div>

  );
}
