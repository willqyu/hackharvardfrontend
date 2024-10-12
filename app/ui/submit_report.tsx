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
    const router = useRouter();

    const createQueryString = () => {
        const params = new URLSearchParams();
        params.set("type", type);
        params.set("comment", comment);
        params.set("timestamp", timestamp.toString());
        params.set("longitude", longitude.toString());
        params.set("latitude", latitude.toString());
        return params.toString();
    }

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

        router.push(
            "/email?" + createQueryString()
        );

        } catch (error) {
        console.error('Error sending image to endpoint:', error);
        }
    };

  return (
    <Button
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
