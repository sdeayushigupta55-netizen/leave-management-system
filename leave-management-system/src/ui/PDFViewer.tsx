import React from "react";

interface PDFViewerProps {
  src: string;
  title?: string;
  width?: string | number;
  height?: string | number;
}

const PDFViewer: React.FC<PDFViewerProps> = ({
  src,
  title = "PDF Document",
  width = "100%",
  height = "100%",
}) => (
  <div className="flex items-center justify-center h-screen">
    <iframe
      src={src}
      title={title}
      width={width}
      height={height}
      className="border-2 border-gray-300 rounded-lg shadow-lg"
    />
  </div>
);

export default PDFViewer;