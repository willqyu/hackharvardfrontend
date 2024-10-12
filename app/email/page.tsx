"use client"
import Letter from '@/app/ui/letter';
import { useSearchParams } from 'next/navigation';

export default function Email() {
    const params = useSearchParams();
    console.log(params);
    
    const type = params.get("type");
    const comment = params.get("comment");
    const timestamp = params.get("timestamp");
    const longitude = params.get("longitude");
    const latitude = params.get("latitude");

    return (
      <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">  
        <Letter
            recipient="John Doe"
            initialTitle="Greetings!"
            initialBody={comment as string}
        />
      </div>
    );
  }
