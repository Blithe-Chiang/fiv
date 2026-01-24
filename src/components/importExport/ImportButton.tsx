/**
 * ImportButton - Trigger portfolio data import from JSON file
 */

import { useRef, useState } from 'react';
import { Button } from '../common/Button';
import { ExportFile } from '@/types/importExport';
import { readFileAsText, parseImportFile } from '@/services/import';

interface ImportButtonProps {
  onFileSelected: (exportFile: ExportFile, file: File) => void;
  onError: (error: string) => void;
}

export function ImportButton({ onFileSelected, onError }: ImportButtonProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [processing, setProcessing] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setProcessing(true);

      // Validate file type
      if (!file.name.endsWith('.json')) {
        onError('Invalid file type. Please select a JSON file.');
        return;
      }

      // Check file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        onError('File is too large. Maximum size is 10MB.');
        return;
      }

      // Read and parse file
      const content = await readFileAsText(file);
      const exportFile = parseImportFile(content);

      // Success - pass to parent component
      onFileSelected(exportFile, file);
    } catch (error: any) {
      onError(error.message || 'Failed to read or parse import file');
    } finally {
      setProcessing(false);
      // Reset input so same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        className="hidden"
        aria-label="Select portfolio JSON file to import"
      />
      <Button onClick={handleButtonClick} disabled={processing} variant="secondary">
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        {processing ? 'Processing...' : 'Import Portfolio'}
      </Button>
      <p className="text-xs text-gray-500">
        Upload a JSON file exported from this application
      </p>
    </div>
  );
}
