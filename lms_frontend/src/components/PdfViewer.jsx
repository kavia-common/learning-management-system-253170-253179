import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// react-pdf worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// PUBLIC_INTERFACE
export default function PdfViewer({ url }) {
  /** Renders a PDF document with pagination */
  const [numPages, setNumPages] = useState(null);
  const [page, setPage] = useState(1);

  if (!url) return <div className="text-sm text-gray-500">No PDF available.</div>;

  return (
    <div className="rounded-lg border border-gray-200 p-4">
      <Document file={url} onLoadSuccess={({ numPages: n }) => setNumPages(n)}>
        <Page pageNumber={page} width={800} />
      </Document>
      <div className="mt-2 flex items-center justify-between">
        <button
          className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
        >
          Previous
        </button>
        <div className="text-sm text-gray-600">
          Page {page} of {numPages || 1}
        </div>
        <button
          className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50 disabled:opacity-50"
          onClick={() => setPage((p) => Math.min(numPages || 1, p + 1))}
          disabled={!numPages || page >= numPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
