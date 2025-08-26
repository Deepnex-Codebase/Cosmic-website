import React from 'react';
import { FiInfo } from 'react-icons/fi';

const FileUploadInfo = ({ fileType = 'file', maxSize = 40, allowedTypes = [] }) => {
  // Convert MB to human-readable format
  const formatSize = (sizeInMB) => {
    if (sizeInMB >= 1000) {
      return `${(sizeInMB / 1000).toFixed(1)}GB`;
    }
    return `${sizeInMB}MB`;
  };

  // Format allowed types for display
  const formatAllowedTypes = () => {
    if (allowedTypes.length === 0) {
      return fileType === 'image' 
        ? 'JPEG, PNG, JPG, GIF, WEBP' 
        : fileType === 'video'
          ? 'MP4, AVI, MOV, WMV, FLV, WEBM'
          : 'All files';
    }
    
    return allowedTypes.join(', ');
  };

  return (
    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
      <div className="flex items-start">
        <FiInfo className="text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
        <div className="text-sm text-blue-700">
          <p className="font-medium">File Upload Requirements:</p>
          <ul className="list-disc list-inside mt-1 ml-1 space-y-1">
            <li>Maximum file size: <span className="font-semibold">{formatSize(maxSize)}</span></li>
            <li>Allowed file types: <span className="font-semibold">{formatAllowedTypes()}</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FileUploadInfo;