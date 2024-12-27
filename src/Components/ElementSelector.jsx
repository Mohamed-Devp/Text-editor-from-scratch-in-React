import React, { useState } from "react";

// Context
import { useSelectionContext } from "./RichTextEditor";

// Utils
import { getRangeParent } from "../Utils/rangeUtils";

const ElementSelector = () => {
    const [isOpen, setIsOpen] = useState(false);;
    const restoreSelection = useSelectionContext();

    // insert the given node after domNode
    const insertAfter = (node, domNode) => {
        const container = domNode.parentElement;
        container.replaceChild(node, domNode);
        container.insertBefore(domNode, node);
    }

    const handleInsertEelement = (element) => {
        const elementClasses = {
            'Header 1': 'H1',
            'Header 2': 'H2',
            'Header 3': 'H3',
            'Text': 'Txt'
        }

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

            // checks if the selected range overlaps with other blockEelement
            let overlaps = false;
            const rangeParent = getRangeParent(range);
            if (rangeParent.tagName === 'SPAN') {
                Object.values(elementClasses).forEach(blockClass => {
                    if (rangeParent.classList.contains(blockClass)) {
                        overlaps = true;
                    }
                })
            }

            // insert the range content in the selected element
            const selectedEelement = document.createElement('span');
            selectedEelement.classList.add(elementClasses[element]);
            selectedEelement.classList.add('BlockSpan');
            selectedEelement.textContent = range.toString().trim() ? range.toString() : element;

            // delete the range content and insert the selected element in the range
            const { startContainer } = range;
            if (overlaps) { insertAfter(selectedEelement, rangeParent) }

            else if (range.toString().trim()) {
                selectedEelement.textContent = '';
                range.surroundContents(selectedEelement);

            }

            else if (startContainer.nodeType === Node.TEXT_NODE) { insertAfter(selectedEelement, startContainer) }

            else {
                selectedEelement.textContent = range.toString().trim() ? range.toString() : element;
                range.deleteContents();
                range.insertNode(selectedEelement);
            }

            // select the inserted element
            range.selectNodeContents(selectedEelement);
            setIsOpen(false);
        }
    }

  return (
    <div className="CenteredContent ElementSelector" >
        <div className="CenteredContent ToggleMenu" onClick={ () => { setIsOpen(!isOpen) } }>
            Insert
        </div>

        { isOpen && (
            <div className="Options">
                {['Header 1', 'Header 2', 'Header 3', 'Text'].map(element => (
                    <div className="Element" onClick={() => { handleInsertEelement(element) }} key={ element } >
                        { element }
                    </div>
                )) }
            </div>
        )}
    </div>
  )
};

export default ElementSelector;