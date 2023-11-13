import { useState, useEffect, useRef, createRef } from "react";
import { useRouter } from "next/router";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import EditableBlock from "views/editableBlock";
import Notice from "views/notice";
import { usePrevious } from "../../hooks";
import { objectId, setCaretToEnd } from "../../utils";

import { Box, Grid, Typography } from "@mui/material";

const defaultBlocks = [
    {
      _id: '5f54d75b114c6d176d7e9765',
      html: 'Heading',
      tag: 'h1',
      imageUrl: '',
    },
    {
      _id: '5f54d75b114c6d176d7e9766',
      html: 'I am a <strong>paragraph</strong>',
      tag: 'p',
      imageUrl: '',
    },
    {
      _id: '5f54d75b114c6d176d7e9767',
      html: 'Image Block',
      tag: 'img',
      imageUrl: '', 
    },
  ];

const Homepage = ({ id, fetchedBlocks, err }) => {
  if (err) {
    return (
      <Notice status="ERROR">
        <Typography variant="h3">Something went wrong 💔</Typography>
        <Typography variant="body1">Have you tried to restart the app at '/' ?</Typography>
      </Notice>
    );
  }

  const router = useRouter();
  const [blocks, setBlocks] = useState(defaultBlocks);
  const [currentBlockId, setCurrentBlockId] = useState(null);

  const prevBlocks = usePrevious(blocks);
  const blockRefs = useRef([]);

  blockRefs.current = blocks.map((_, i) => blockRefs.current[i] ?? createRef());

  // Update the database whenever blocks change
  useEffect(() => {
    const updatePageOnServer = async (blocks) => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API}/pages/${id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            blocks: blocks,
          }),
        });
      } catch (err) {
        console.log(err);
      }
    };
    if (prevBlocks && prevBlocks !== blocks) {
      updatePageOnServer(blocks);
    }
  }, [blocks, prevBlocks]);

  // Handling the cursor and focus on adding and deleting blocks
  useEffect(() => {
    // If a new block was added, move the caret to it
    if (prevBlocks && prevBlocks.length + 1 === blocks.length) {
      const nextBlockPosition =
        blocks.map((b) => b._id).indexOf(currentBlockId) + 1 + 1;
      const nextBlock = document.querySelector(
        `[data-position="${nextBlockPosition}"]`
      );
      if (nextBlock) {
        nextBlock.focus();
      }
    }
    // If a block was deleted, move the caret to the end of the last block
    if (prevBlocks && prevBlocks.length - 1 === blocks.length) {
      const lastBlockPosition = prevBlocks
        .map((b) => b._id)
        .indexOf(currentBlockId);
      const lastBlock = document.querySelector(
        `[data-position="${lastBlockPosition}"]`
      );
      if (lastBlock) {
        setCaretToEnd(lastBlock);
      }
    }
  }, [blocks, prevBlocks, currentBlockId]);

  useEffect(() => {
    if (currentBlockId) {
      // Find the newly added block index by currentBlockId
      const newBlockIndex = blocks.findIndex(block => block._id === currentBlockId);
      if (newBlockIndex !== -1 && blockRefs.current[newBlockIndex]) {
        // Use a timeout to ensure the new block has been rendered
        setTimeout(() => {
          blockRefs.current[newBlockIndex].current?.focus();
        }, 0);
      }
    }
  }, [blocks, currentBlockId]);
  

  const deleteImageOnServer = async (imageUrl) => {
    // The imageUrl contains images/name.jpg, hence we do not need
    // to explicitly add the /images endpoint in the API url
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/pages/${imageUrl}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
    } catch (err) {
      console.log(err);
    }
  };

  const updateBlockHandler = (currentBlock) => {
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    const oldBlock = blocks[index];
    const updatedBlocks = [...blocks];
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: currentBlock.tag,
      html: currentBlock.html,
      imageUrl: currentBlock.imageUrl,
    };
    setBlocks(updatedBlocks);
    // If the image has been changed, we have to delete the
    // old image file on the server
    if (oldBlock.imageUrl && oldBlock.imageUrl !== currentBlock.imageUrl) {
      deleteImageOnServer(oldBlock.imageUrl);
    }
  };

  const addBlockHandler = (currentBlock) => {
    setCurrentBlockId(currentBlock.id);
    const index = blocks.map((b) => b._id).indexOf(currentBlock.id);
    const updatedBlocks = [...blocks];
    const newBlock = { _id: objectId(), tag: "p", html: "", imageUrl: "" };
    updatedBlocks.splice(index + 1, 0, newBlock);
    updatedBlocks[index] = {
      ...updatedBlocks[index],
      tag: currentBlock.tag,
      html: currentBlock.html,
      imageUrl: currentBlock.imageUrl,
    };
    setBlocks(updatedBlocks);
    setCurrentBlockId(newBlock._id);
  };

  const deleteBlockHandler = (blockId) => {
    // Find the index of the block with the specified ID
    const index = blocks.findIndex((block) => block._id === blockId);
    if (index === -1) {
      // Block with given ID doesn't exist in the array, handle this error case appropriately
      console.error('Block not found. Cannot delete.');
      return;
    }
  
    // Now we have the index, and we can proceed with certainty
    const deletedBlock = blocks[index];
  
    // Delete the block from the state array
    const updatedBlocks = [...blocks];
    updatedBlocks.splice(index, 1);
    setBlocks(updatedBlocks);
  
    // If the deleted block was an image block, delete the image file on the server
    if (deletedBlock.tag === "img" && deletedBlock.imageUrl) {
      deleteImageOnServer(deletedBlock.imageUrl);
    }
  
    // Update currentBlockId if necessary, or perform other state cleanup
    setCurrentBlockId(null); // or some other appropriate action
  };
  

  const onDragEndHandler = (result) => {
    const { destination, source } = result;

    // If we don't have a destination (due to dropping outside the droppable)
    // or the destination hasn't changed, we change nothing
    if (!destination || destination.index === source.index) {
      return;
    }

    const updatedBlocks = [...blocks];
    const removedBlocks = updatedBlocks.splice(source.index - 1, 1);
    updatedBlocks.splice(destination.index - 1, 0, removedBlocks[0]);
    setBlocks(updatedBlocks);
  };

  const isNewPublicPage = router.query.public === "true";
  return (
    <>
      <DragDropContext onDragEnd={onDragEndHandler}>
        <Droppable droppableId={id}>
          {(provided) => (
            <Grid container justifyContent="center" alignItems="center" style={{ minHeight: '5vh' }} ref={provided.innerRef} {...provided.droppableProps}>
              {blocks.map((block, index) => {
                const position =
                  blocks.map((b) => b._id).indexOf(block._id) + 1;
                return (
                   <Grid item xs={12} key={block._id}> 
                  <EditableBlock
                   ref={(el) => (blockRefs.current[index] = el)}
                    key={block._id}
                    position={position}
                    id={block._id}
                    tag={block.tag}
                    html={block.html}
                    imageUrl={block.imageUrl}
                    pageId={id}
                    addBlock={addBlockHandler}
                    deleteBlock={deleteBlockHandler}
                    updateBlock={updateBlockHandler}
                  />
                  </Grid>
                );
              })}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};


export default Homepage;
