import Slider from "react-slick";
import CarouselItem from "./CarouselItem";
import "./slick.scss";
import "./slick-theme.scss";

import image1 from "../../../assets/images/landingPage/MiamiFavorites/fast-food.jpg";
import image2 from "../../../assets/images/landingPage/MiamiFavorites/sticky-wings.jpg";
import image3 from "../../../assets/images/landingPage/MiamiFavorites/gourmet.jpg";
import { NextArrow, PrevArrow } from "../shared/Arrows";

// TODO: Remove once the API is ready gallery items
// this is temporary
export const galleryItems = [{
    imageUrl: image1,
    alt: "Fuku",
    title: "Fuku",
    description: "FREE Delivery | Sandwiches",
},
{
    imageUrl: image2,
    alt: "Fuku",
    title: "Genuine Burger",
    description: "FREE Delivery | Burgers",
},
{
    imageUrl: image3,
    alt: "Fuku",
    title: "Krispy Rice",
    description: "FREE Delivery | Sushi",
},
{
    imageUrl: image1,
    alt: "Fuku",
    title: "Fuku",
    description: "FREE Delivery | Sandwiches",
},
{
    imageUrl: image2,
    alt: "Fuku",
    title: "Genuine Burger",
    description: "FREE Delivery | Burgers",
},
{
    imageUrl: image3,
    alt: "Fuku",
    title: "Krispy Rice",
    description: "FREE Delivery | Sushi",
}
]

export interface GalleryItemsProps {
    imageUrl: string,
    alt: string,
    title?: string,
    description?: string,
}

//! Component
export const MiamiFavorites = () => {

    const carouselSettings = {
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 600,
                settings: {
                    centerPadding: "20px",
                    className: "center",
                    centerMode: true,
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }],
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />
    };

    return (
        <section className="max-w-screen-lg mx-auto w-full box-border justify-center items-center box-border md:px-3 sm:px-5 relative">
            <h2 className="text-2xl md:text-3xl lg:text-5xl mb-3_5 px-3 md:px-0 font-bold uppercase font-hanson">MIAMI FAVORITES</h2>
            <Slider {...carouselSettings}>
                {galleryItems.map((item: GalleryItemsProps, index: number) => {
                    return (
                        <CarouselItem
                            key={index}
                            title={item.title}
                            description={item.description}
                            imageUrl={item.imageUrl}
                            alt={item.alt} />
                    )
                })}
            </Slider>
        </section>
    )
}