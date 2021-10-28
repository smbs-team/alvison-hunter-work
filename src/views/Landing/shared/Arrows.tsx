import cn from 'classnames';
import nextArrow from '../../../assets/images/landingPage/Slider/NextArrow.svg';
import prevArrow from '../../../assets/images/landingPage/Slider/PrevArrow.svg';

interface ArrowProps {
    currentSlide?: number
    slideCount?: number
    className?: string
}

export const PrevArrow = ({ currentSlide, slideCount, className, ...props }: ArrowProps) => (
    <button
        {...props}
        className={cn(className, (currentSlide === 0 ? " slick-disabled" : ""), "invisible sm:visible")}
        aria-hidden="true"
        aria-disabled={currentSlide === 0 ? true : false}
        type="button"
    >
        <img src={prevArrow} alt='back arrow' />
    </button>
);

export const NextArrow = ({ currentSlide, slideCount, className, ...props }: ArrowProps) => (
    <button
        {...props}
        className={cn(className, (currentSlide === 3 ? " slick-disabled" : ""), "invisible sm:visible")}
        aria-hidden="true"
        aria-disabled={currentSlide === slideCount! - 3 ? true : false}
        type="button"
    >
        <img src={nextArrow} alt='next arrow' />
    </button>
);