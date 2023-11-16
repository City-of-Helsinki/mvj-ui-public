import React, { PropsWithChildren, useState } from 'react';

type FileUploadsContextState = {
  files: Readonly<Record<string, Array<File>>>;
  setFieldFiles: (field: string, files: Array<File>) => void;
  clearFiles: () => void;
};

const FileUploadsContext = React.createContext<FileUploadsContextState | null>(
  null,
);

export const FileUploadsProvider = ({
  children,
}: PropsWithChildren<Record<string, unknown>>): JSX.Element => {
  const [files, setFiles] = useState<Record<string, Array<File>>>({});

  return (
    <FileUploadsContext.Provider
      value={{
        files,
        setFieldFiles: (field: string, newFiles: Array<File>): void => {
          setFiles({
            ...files,
            [field]: newFiles,
          });
        },
        clearFiles: (): void => {
          setFiles({});
        },
      }}
    >
      {children}
    </FileUploadsContext.Provider>
  );
};

export const useFileUploads = (): FileUploadsContextState => {
  const context = React.useContext(FileUploadsContext);

  if (!context) {
    throw new Error('Context used outside a matching provider');
  }

  return context;
};
