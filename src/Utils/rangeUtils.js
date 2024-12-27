
export const getRangeParent = (range) => {
    // get the range parent element and return it
    const rangeParent = range.commonAncestorContainer.nodeType === Node.TEXT_NODE
        ? range.commonAncestorContainer.parentElement
        : range.commonAncestorContainer;

    return rangeParent;
}