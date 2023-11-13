
import React, { useEffect, useState } from 'react';
import HomePage from 'views/HomePage';

const Home = () => {
  const [fetchedBlocks, setFetchedBlocks] = useState([]);

  useEffect(() => {
    // Check if 'blocks' exists in localStorage and set it if not
    const blocksFromStorage = localStorage.getItem('blocks');
    if (!blocksFromStorage) {
      const hardcodedBlocks = [
        {
          _id: 'block1',
          html: 'This is a hardcoded paragraph block',
          tag: 'p',
          imageUrl: '',
        },
        {
          _id: 'block2',
          html: 'This is another hardcoded paragraph block with <strong>bold text</strong>',
          tag: 'p',
          imageUrl: '',
        },
      ];
      localStorage.setItem('blocks', JSON.stringify(hardcodedBlocks));
      setFetchedBlocks(hardcodedBlocks); // Initialize state with hardcoded blocks
    } else {
      setFetchedBlocks(JSON.parse(blocksFromStorage)); // Or set state with blocks from storage
    }
  }, []);
  
    // Function to add a new block
    const addBlock = (newBlock) => {
      const currentBlocks = JSON.parse(localStorage.getItem('blocks')) || [];
      const updatedBlocks = [...currentBlocks, newBlock];
      localStorage.setItem('blocks', JSON.stringify(updatedBlocks));
    };

  
    // Pass the fetched blocks to the HomePage component
    return <HomePage id={'hardcodedPageId'} fetchedBlocks={fetchedBlocks} err={null} />;
  };
  
  export default Home;
  