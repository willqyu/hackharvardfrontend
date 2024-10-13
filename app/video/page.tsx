import React from 'react';

interface GoogleDriveVideoProps {
  fileId: string;
  width?: string;
  height?: string;
}

const GoogleDriveVideo: React.FC<GoogleDriveVideoProps> = ({ fileId, width = "1280", height = "960" }) => {
  // Generate the embeddable URL for the video
  const embedUrl = `https://drive.google.com/file/d/1A9fuywM-Fmg9_FdwGrGQGyQaImL8OIao/preview`;
  
  return (
    <div className="video-container">
      <iframe
        src={embedUrl}
        width={width}
        height={height}
        allow="autoplay"
        frameBorder="0"
        allowFullScreen
        title="Google Drive Video"
      ></iframe>
    </div>
  );
};

export default GoogleDriveVideo;
