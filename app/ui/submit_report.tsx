"use client"

import React from "react";
import { Button } from '@/components/ui/button';
import { backendAPI } from "@/lib/config";
import { useRouter } from "next/navigation";

export interface reportPayload {
  type: string;
  image: string;
  comment: string;
  timestamp: number;
  latitude: number;
  longitude: number;
}


const SubmitReport = ({
  type,
  image,
  comment,
  timestamp,
  longitude,
  latitude
}: reportPayload) => {

    const sendReportToEndpoint = async (reportData: reportPayload) => {
        console.log("Submit button clicked. Sending report...", reportData);

        try {
        const response = await fetch(`${backendAPI}/api/submit-report`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(reportData),
        });

        if (!response.ok) {
            throw new Error('Failed to upload report');
        }

        } catch (error) {
        console.error('Error sending image to endpoint:', error);
        }
    };

  return (
    <Button
      className="px-6 py-2 bg-gradient-to-r from-slate-200 to-slate-300 text-black rounded-2xl shadow-lg shadow-slate-600 hover:shadow-xl transition-shadow duration-300 hover:bg-slate-950 focus:outline-none"
      onClick={() =>
        sendReportToEndpoint({
          type,
          image,
          comment,
          timestamp,
          latitude,
          longitude,
        })
      }
    >
      Submit Report
    </Button>
  );
};

export default SubmitReport;
