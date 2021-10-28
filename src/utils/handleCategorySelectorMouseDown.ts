import { MouseEvent as ReactMouseEvent } from 'react';
// This function handles dragging on the category selector and makes it behave like 
// on a touchscreen when a mouse is being used.
export function handleCategorySelectorMouseDown(e: ReactMouseEvent) {
  const selector = document.getElementsByClassName(
    'category-selector'
  )[0] as HTMLDivElement;
  selector.style.cursor = 'grabbing';
  const left = selector.scrollLeft;
  const x = e.clientX;
  const scrollRatio = selector.scrollWidth / selector.scrollWidth;
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
  function onMouseMove(e: MouseEvent) {
    const dx = e.clientX - x;
    selector.scrollLeft = left - dx / scrollRatio;
  }
  function onMouseUp(e: MouseEvent) {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }
}
