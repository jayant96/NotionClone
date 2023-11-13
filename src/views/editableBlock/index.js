import React, { useState, useEffect, useRef, useCallback, forwardRef } from 'react'
import ContentEditable from 'react-contenteditable'
import { Draggable } from 'react-beautiful-dnd'

import TagSelectorMenu from 'views/tagSelectorMenu'
import ActionMenu from 'views/actionMenu'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { setCaretToEnd } from '../../utils'

import { Box, Card, CardContent, InputBase, IconButton, Typography, Button } from '@mui/material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const CMD_KEY = '/'

const EditableBlock = forwardRef(
  (
    { id, position, html: propHtml, tag: propTag, imageUrl: propImageUrl, pageId, updateBlock, addBlock, deleteBlock },
    ref
  ) => {
    const [htmlBackup, setHtmlBackup] = useState(null)
    const [html, setHtml] = useState(propHtml)
    const [tag, setTag] = useState(propTag)
    const [imageUrl, setImageUrl] = useState(propImageUrl)
    const [placeholder, setPlaceholder] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [tagSelectorMenuOpen, setTagSelectorMenuOpen] = useState(false)
    const [actionMenuOpen, setActionMenuOpen] = useState(false)
    const [previousKey, setPreviousKey] = useState(null)
    const [isDragging, setIsDragging] = useState(false)

    const contentEditable = useRef(null)
    const fileInputRef = useRef(null)
    const actionMenuAnchorRef = useRef(null)

    useEffect(() => {
      // Perform actions equivalent to componentDidUpdate for props changes
      if (!placeholder) {
        updateBlock({
          id: id,
          html: html,
          tag: tag,
          imageUrl: imageUrl
        })
      }
    }, [html, tag, imageUrl, placeholder]) // Re-run the effect only if these values change

    const setFocus = () => {
      contentEditable.current?.focus()
    }

    const addPlaceholderIfNeeded = () => {
      const isFirstBlockEmpty = position === 1 && !html && !imageUrl
      // Check if contentEditable.current is not null before trying to access nextSibling
      const isBlockAlone = contentEditable.current && !contentEditable.current.nextSibling
      if (isFirstBlockEmpty && isBlockAlone) {
        setHtml('Type a page title...')
        setTag('h1')
        setPlaceholder(true)
      }
    }

    const handleChange = e => {
      setHtml(e.target.value)
    }

    const handleFocus = () => {
      if (placeholder) {
        setHtml('')
        setPlaceholder(false)
      }
      setIsTyping(true)
    }

    const handleBlur = () => {
      setIsTyping(false)
      addPlaceholderIfNeeded()
    }

    const handleKeyDown = e => {
      if (e.key === CMD_KEY) {
        setHtmlBackup(html)
      } else if (e.key === 'Backspace' && !html) {
        deleteBlock({ id })
      } else if (e.key === 'Enter' && previousKey !== 'Shift' && !tagSelectorMenuOpen) {
        e.preventDefault()
        addBlock({
          id,
          html,
          tag,
          imageUrl
        })
      }
      setPreviousKey(e.key)
    }

    const handleKeyUp = e => {
      if (e.key === CMD_KEY) {
        openTagSelectorMenu()
      }
    }

    const handleMouseUp = useCallback(() => {
      const selectionText = window.getSelection().toString()
      if (selectionText.length > 0) {
        setActionMenuOpen(true)
      }
    }, [])

    const handleDragHandleClick = (event) => {
      // Prevent the drag action from starting
      event.preventDefault();
      event.stopPropagation();
      // Set the current target as the anchor for the action menu
      actionMenuAnchorRef.current = event.currentTarget;
      // Open the action menu
      setActionMenuOpen(true);
    };

    const handleImageUpload = event => {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = readEvent => {
          // The result contains the data URL of the read file as a string
          setImageUrl(readEvent.target.result)
        }
        reader.readAsDataURL(file)
      }
    }

    const openTagSelectorMenu = () => {
      setTagSelectorMenuOpen(true) // Just set the menu to open
    }

    const closeTagSelectorMenu = () => {
      setTagSelectorMenuOpen(false) // Close the menu
    }

    const closeTagSelectorMenuAndUpdate = useCallback(
      (newTag, newHtmlBackup) => {
        closeTagSelectorMenu()
        if (typeof newHtmlBackup === 'string') {
          setCaretToEnd(contentEditable.current)
        }
      },
      [contentEditable, closeTagSelectorMenu]
    )

    const handleTagSelection = useCallback(
      selectedTag => {
        if (selectedTag === 'img') {
          setTag(selectedTag)

          if (fileInputRef.current) {
            fileInputRef.current.click()
          }
          addBlock({
            id: id,
            html: '',
            tag: 'p',
            imageUrl: '',
            ref: contentEditable.current
          })
        } else {
          if (isTyping) {
            setTag(selectedTag)
            setHtml(htmlBackup)
            closeTagSelectorMenuAndUpdate(selectedTag, htmlBackup)
          } else {
            setTag(selectedTag)
            closeTagSelectorMenuAndUpdate(selectedTag)
          }
        }
      },
      [isTyping, htmlBackup, fileInputRef, contentEditable, addBlock, id]
    )

    return (
      <>
          <Draggable draggableId={id.toString()} index={position}>
          {(provided, snapshot) => (
            <Box
              ref={provided.innerRef}
              {...provided.draggableProps}
              elevation={snapshot.isDragging ? 3 : 1} // Adjusting elevation based on drag state
              variant="outlined"
              sx={{
                cursor: 'text', // Set cursor to text for the entire card
                '&:hover': {
                  // Override cursor style when hovering on the card content
                  cursor: 'default',
                },
              }}
            >
                <Box
                  {...provided.dragHandleProps}
                  display="flex"
                  alignItems="center"
                 
                >
                  {/* Drag handle */}
                  <IconButton  ref={actionMenuAnchorRef} size="small"  {...provided.dragHandleProps} onMouseDown={handleDragHandleClick}
                    sx={{ cursor: 'grab' }}>
                    <DragIndicatorIcon />
                  </IconButton>
                  
                  {/* ContentEditable or Image */}
                  {tag !== 'img' ? (
                    <Typography component={tag} variant="body1">
                       <ContentEditable
                    innerRef={ref}
                    html={html}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    onKeyUp={handleKeyUp}
                    onMouseUp={handleMouseUp}
                    style={{
                      width: '100%',
                      minHeight: '10px', 
                      outline: 'none', 
                      cursor: 'text',
                      padding: '4px' 
                    }}
                    tagName={tag}
                  />
                    </Typography>
                  ) : (
                    <Box textAlign="center" width="100%">
                      {imageUrl ? (
                        <img src={imageUrl} alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '600px' }} />
                      ) : (
                        <Button
                          variant="contained"
                          component="label"
                          startIcon={<AddPhotoAlternateIcon />}
                        >
                          Upload Image
                          <input
                            type="file"
                            hidden
                            onChange={handleImageUpload}
                            ref={fileInputRef}
                          />
                        </Button>
                      )}
                    </Box>
                  )}
                </Box>
             
            </Box>
          )}
        </Draggable>
        {tagSelectorMenuOpen && (
          <TagSelectorMenu
            anchorEl={actionMenuAnchorRef.current} // Using actionMenuAnchorRef for positioning
            open={tagSelectorMenuOpen} // Controlled by tagSelectorMenuOpen state
            onClose={closeTagSelectorMenu}
            handleSelection={handleTagSelection}
          />
        )}
        {actionMenuOpen && (
          <ActionMenu
            id={id}
            open={actionMenuOpen}
            onClose={() => setActionMenuOpen(false)}
            onDelete={() => {
              deleteBlock(id)
              setActionMenuOpen(false)
            }}
            onTurnInto={ ()=> {
              openTagSelectorMenu()
              setActionMenuOpen(false)
            }}
          />
        )}
      </>
    )
  }
)

export default EditableBlock
