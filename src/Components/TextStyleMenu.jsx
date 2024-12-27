import React from "react";

// Components
import ColorSelector from "./ColorSelector";

// Context
import { useSelectionContext } from "./RichTextEditor";

// utils
import { getRangeParent } from "../Utils/rangeUtils";

const TextStyleMenu = () => {
  const restoreSelection = useSelectionContext();

  const getStyleJSX = (style) => {
    const stylesJSX = {
      'Bold': <b>B</b>,
      'Italic': <i>I</i>,
      'Underlined': <u>U</u>
    }

    return (
      <div 
        className="TextStyle CenteredContent"
        onClick={ () => { applyStyle(style) } }
        key={ style }>

      { stylesJSX[style] }

      </div>)
  }

  const cleanEditor = (element) => {
    // clean the content editable div from empty tags
    const elementsToRemove = document.querySelectorAll(element);
    const editor = document.getElementById('Editor');
    
    elementsToRemove.forEach(element => {
      if (!element.textContent.trim()) {
        element.remove();
      }
    })

    // normalize the editor dev to merge seperated text nodes
    editor.normalize();
  }

  const applyStyle = (style) => {
    // restore the selection if there is any saved selection
    restoreSelection();

    // initialize the styles element
    const styleElements = {
      'Bold': 'B',
      'Italic': 'I',
      'Underlined': 'U'
    }

    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);

      // get the parent element of the selected text
      const parentElement = getRangeParent(range);
      const styleElement = document.createElement(styleElements[style]);

      // unstyle the text if the text is already styled
      if (parentElement.tagName === styleElements[style]) {

        const beforeText = document.createTextNode(parentElement.textContent.slice(0, range.startOffset));
        const beforeElement = document.createElement(styleElements[style]);
        beforeElement.appendChild(beforeText);

        const selectedText = document.createTextNode(range.toString());
        
        const afterText = document.createTextNode(parentElement.textContent.slice(range.endOffset));
        const afterElement = document.createElement(styleElements[style]);
        afterElement.appendChild(afterText);

        const styleElementParent = parentElement.parentElement;
        styleElementParent.replaceChild(afterElement, parentElement);
        styleElementParent.insertBefore(selectedText, afterElement);
        styleElementParent.insertBefore(beforeElement, selectedText);
        range.selectNodeContents(selectedText);

        // clean the editor from empty style tages
        cleanEditor(styleElements[style]);

        // otherwisw wrapp the text with a style element
      } else if (range.toString().trim()){

        const selectedText = range.extractContents();
        styleElement.appendChild(selectedText);
        range.insertNode(styleElement);

        // warp the cursor with the style element
      } else {

        styleElement.appendChild(document.createTextNode('\u200B'));
        range.insertNode(styleElement);
        range.setStart(styleElement.firstChild, 1);
        range.collapse(true);
      }
    }
  }
  
  return (
    <div className="DistrContent TextStyleMenu">
      {['Bold', 'Italic', 'Underlined'].map(style => getStyleJSX(style))}
      <ColorSelector />
    </div>
  )
};

export default TextStyleMenu;
