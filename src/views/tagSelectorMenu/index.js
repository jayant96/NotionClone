import { useState, useEffect } from "react";
import { matchSorter } from "match-sorter";


import { Menu, MenuItem } from '@mui/material';

const allowedTags = [
  {
    id: "page-title",
    tag: "h1",
    label: "Page Title",
  },
  {
    id: "heading",
    tag: "h2",
    label: "Heading",
  },
  {
    id: "subheading",
    tag: "h3",
    label: "Subheading",
  },
  {
    id: "paragraph",
    tag: "p",
    label: "Paragraph",
  },
  {
    id: "image",
    tag: "img",
    label: "Image",
  },
];

const TagSelectorMenu = ({ anchorEl, open, onClose, handleSelection }) => {
  const [tagList, setTagList] = useState(allowedTags);
  const [selectedTag, setSelectedTag] = useState(0);
  const [command, setCommand] = useState("");

  // Filter tagList based on given command
  useEffect(() => {
    setTagList(matchSorter(allowedTags, command, { keys: ["tag"] }));
  }, [command]);

  // Attach listener to allow tag selection via keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSelection(tagList[selectedTag].tag);
      } else if (e.key === "Tab" || e.key === "ArrowDown") {
        e.preventDefault();
        const newSelectedTag =
          selectedTag === tagList.length - 1 ? 0 : selectedTag + 1;
        setSelectedTag(newSelectedTag);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const newSelectedTag =
          selectedTag === 0 ? tagList.length - 1 : selectedTag - 1;
        setSelectedTag(newSelectedTag);
      } else if (e.key === "Backspace") {
        if (command) {
          setCommand(command.slice(0, -1));
        } else {
          closeMenu();
        }
      } else {
        setCommand(command + e.key);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [tagList, selectedTag, handleSelection, onClose]);

  return (
    <Menu
      anchorEl={anchorEl}
      open={open} // open is now a boolean, depending on anchorEl being set
      onClose={onClose}
    >
     {tagList.map((tag, index) => (
        <MenuItem
          key={tag.id}
          selected={selectedTag === index} 
          onClick={() => handleSelection(tag.tag)}
        >
          {tag.label}
        </MenuItem>
      ))}
    </Menu>
  );
};

export default TagSelectorMenu;
