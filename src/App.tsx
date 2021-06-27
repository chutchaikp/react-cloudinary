import React from 'react';
import { Flex, Heading } from '@chakra-ui/react';
import PhotoUploader from './components/PhotoUploader';

const App = () => {
  return (
    <Flex justify="center" p="2rem" minH="100vh" >
      <Flex direction="column" >
        <Heading>Image gallery</Heading>

        [
        <span>{process.env.REACT_APP_CLOUD_NAME}</span>
        ]

        <PhotoUploader />
      </Flex>
    </Flex>
  );
}

export default App;
