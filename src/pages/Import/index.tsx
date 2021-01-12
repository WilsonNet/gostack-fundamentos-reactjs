import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import filesize from 'filesize';

import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

interface LocationState {
  fromLink?: boolean;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();
  const location = useLocation();
  const locationState = location.state as LocationState;

  if (!locationState?.fromLink) history.push('/');

  async function handleUpload(): Promise<void> {
    const data = new FormData();
    uploadedFiles.forEach(uploadedFile => {
      data.append('file', URL.createObjectURL(uploadedFile.file));
    });
    try {
      await api.post('/transactions/import', data);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    const fileProps: FileProps[] = files.map(file => {
      return {
        file,
        readableSize: filesize(file.size),
        name: file.name,
      };
    });

    setUploadedFiles(fileProps);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
