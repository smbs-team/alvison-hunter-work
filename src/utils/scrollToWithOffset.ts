
/*
* This function should be called just from the Component "NavHashLink" example:
*
        <NavHashLink elementId='addressInput' to={{ pathname: '', search: window.location.search}}  smooth scroll={(el) => {scrollWithOffset(el, -300)}}>
               Order Now
        </NavHashLink>
*
* */

export const scrollWithOffset = (targetDOMElement: any, yOffset: number = 0) => {

    const yCoordinate = targetDOMElement.getBoundingClientRect().top + window.pageYOffset;

    window.scrollTo({ top: yCoordinate + yOffset, behavior: 'smooth' });

}