import React from "react";
import { Button } from '@/components/ui/button';
import { backendAPI } from "@/lib/config";


export interface reportPayload {
    type: string,
    image: string,
    comment: string,
    timestamp: number,
    latitude: number,
    longitude: number,
}

const SubmitReport = (
    {type, image, comment, timestamp, latitude, longitude} : reportPayload
) => {

    const sendReportToEndpoint = async (reportData: reportPayload) => {
        console.log(reportData);
        try {
          const response = await fetch(backendAPI + '/api/submit-report', {
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
        <Button onClick={
            () => {
                sendReportToEndpoint(
                    {type, image, comment, timestamp, latitude, longitude}
                )
            }
        }>Submit Report</Button>
    )
}

export default SubmitReport;
