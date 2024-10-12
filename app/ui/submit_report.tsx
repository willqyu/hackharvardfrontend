import React from "react";
import { Button } from '@/components/ui/button';
import { backendAPI } from "@/lib/config";


interface reportPayload {
    type: String,
    image_data: String,
    comment: String,
    timestamp: Number,
    Lat: Number,
    Long: Number,
}

const SubmitReport = (
    report_data: reportPayload
) => {

    const sendReportToEndpoint = async (report_data: reportPayload) => {
        try {
          const response = await fetch(backendAPI + '/api/submit-report', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(report_data),
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
                sendReportToEndpoint(report_data)
            }
        }>Submit Report</Button>
    )
}

export default SubmitReport;
