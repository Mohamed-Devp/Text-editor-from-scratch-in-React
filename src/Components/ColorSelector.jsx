import React, { useState } from "react";

// Context
import { useSelectionContext } from "./RichTextEditor";

// Utils
import { getRangeParent } from "../Utils/rangeUtils"

const ColorSelector = () => {
  const colorOptions = ['#3F7DE8', '#893FE8', '#67BD67', '#F0C422', '#000000'];
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [isOpen, setIsOpen] = useState(false);

  const restoreSelection = useSelectionContext();

  const handleChangeColor = ( color ) => {
    // restore the saved selection
    restoreSelection();

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // check if the range is not within the editor
      const editor = document.getElementById('Editor');
      if (!editor.contains(range.startContainer)) {
        return;
      }

      // check if the range is already styled
      const rangeParent = getRangeParent(range);

      // change the text color
      if (rangeParent.tagName === 'SPAN') {
        rangeParent.style.color = color;
        return;
      }

      const colorElement = document.createElement('span');
      colorElement.style.color = color;

      if (range.toString().trim()) {
        // surround the range content with the color element if the range has a content
        range.surroundContents(colorElement);

      } else {
        // otherwise insert the color elements at the cursor position
        colorElement.appendChild(document.createTextNode('\u200B'));
        range.insertNode(colorElement);
        range.setStart(colorElement.firstChild, 1);
        range.collapse();
      }

      // close the selection menu and update the selected color
      setIsOpen(false);
      setSelectedColor(color);
    }
  }

  return (
    <div className="CenteredContent ColorSelector" >
      <div 
        className="SelectedColor" 
        style={{backgroundColor: selectedColor}}
        onClick={() => { setIsOpen(!isOpen) }}>
      </div>

      {isOpen && (
        <div className="ColorOptions" >
          <div className="Header" >Color</div>
          
          <div className="DistrContent Selector" >
            {colorOptions.map(color => (
              <div 
                className="Color" 
                key={ color } 
                style={{backgroundColor: color}}
                onClick={() => { handleChangeColor(color) }}>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
};

export default ColorSelector;