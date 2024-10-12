"use client"
import Letter from '@/app/ui/letter';
import { useParams } from 'next/navigation';

export default function Email() {
    const params = useParams();
    
    return (
      <div className="grid items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">  
        <Letter
            recipient="John Doe"
            initialTitle="Greetings!"
            initialBody={params.comment}
        />
      </div>
    );
  }
