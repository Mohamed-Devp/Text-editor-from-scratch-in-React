import React from "react";

// Components
import ElementSelector from "./ElementSelector";
import TextStyleMenu from "./TextStyleMenu";
import TextAlignmentMenu from "./TextAlignmentMenu";

const EditorMenu = () => {
  
  return (
      <div className="DistrContent EditorMenu" >
        <ElementSelector />

        <TextStyleMenu />

        <TextAlignmentMenu />
      </div>
  )
};

export default EditorMenu;