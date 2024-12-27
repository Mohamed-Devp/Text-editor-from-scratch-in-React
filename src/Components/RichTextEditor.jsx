import React, { useRef, useEffect, createContext, useContext, useState } from "react";

// Components
import EditorMenu from "./EditorMenu";
import Editor from "./Editor";

// Context
const SelectionContext = createContext();
export const useSelectionContext = () => useContext(SelectionContext);

const RichTextEditor = () => {
    const selectionRef = useRef(null);
    const [isOpen, setIsOpen] = useState(true);

    // save the current selection in the selectionRef
    const saveSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            selectionRef.current = selection.getRangeAt(0);
        }
    }

    // restore the selection if there is a saved selection
    const restoreSelection = () => {
        if (selectionRef.current) {
            const selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(selectionRef.current);
        }
    }

    useEffect(() => {
        const editorContainer = document.getElementById('EditorContainer');
        editorContainer.addEventListener('mouseup', saveSelection);
        editorContainer.addEventListener('keydown', saveSelection);

        return () => {
            editorContainer.removeEventListener('mouseup', saveSelection);
            editorContainer.removeEventListener('keydown', saveSelection);
        }
    },[])

    return (
    <div className="TextEditor">
        <SelectionContext.Provider value={ restoreSelection }>

            <div className="EditorMenuContainer" >
                <div className="CenteredContent EditorMenuWrraper">
                    {isOpen 
                      ? (<i className="fa-solid fa-chevron-up Opened" onClick={() => { setIsOpen(false) }}></i>)
                      : (<i className="fa-solid fa-chevron-down Closed" onClick={() => { setIsOpen(true) }}></i>)}

                    {isOpen ? (<EditorMenu />) : null}
                </div>
            </div>
            <Editor />

        </SelectionContext.Provider>
    </div>
    )
};

export default RichTextEditor;
