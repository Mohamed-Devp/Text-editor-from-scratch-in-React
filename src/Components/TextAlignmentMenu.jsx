import React, { useState } from "react";

// Context
import { useSelectionContext } from "./RichTextEditor";

// Utils
import { getRangeParent } from "../Utils/rangeUtils"

const TextAlignmentMenu = () => {
  const alignmentOptions = ['left', 'center', 'right'];
  const [selectedOption, setSelectedOption] = useState('left');

  const restoreSelection = useSelectionContext();

  const handleAlignText = (option) => {
    const alignClasses = {
      'center': 'ToCenter',
      'left': 'ToLeft',
      'right': 'ToRight'
    }

    // restore the saved selection
    restoreSelection();

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // check if the range is within the editor
      const editor = document.getElementById('Editor');
      if (!editor.contains(range.startContainer)) {
        return;
      }

      // check if the range is already aligned
      const rangeParent = getRangeParent(range);

      if (rangeParent.tagName === 'SPAN') {
        // remove the existing align class and add the new one
        Object.values(alignClasses).forEach(alignClass => {
          if (rangeParent.classList.contains(alignClass)) {
            rangeParent.classList.remove(alignClass);
          }
        })

        rangeParent.classList.add(alignClasses[option]);
        return;
      }

      const alignElement = document.createElement('span');
      alignElement.classList.add(alignClasses[option]);
      alignElement.classList.add('BlockSpan');

      // surround the range content with the align element if the range has content
      if (range.toString().trim()) {
        range.surroundContents(alignElement);

      } else {
        // otherwise wrap the cursor position with the align element
        alignElement.appendChild(document.createTextNode('\u200B'));
        range.insertNode(alignElement);
        range.setStart(alignElement.firstChild, 1);
        range.collapse(true)
      }

      // update the selected option
      setSelectedOption(option);
    }
  }

  return (
    <div className="DistrContent TextAlignment">
      { alignmentOptions.map(option => (
        <button 
          className={`fa-solid fa-align-${option}`}
          style={selectedOption === option ? {backgroundColor: '#e2e2e2'} : {}}
          onClick={() => { handleAlignText(option) }}
          key={ option }></button>
      )) }
    </div>
  )
};

export default TextAlignmentMenu;