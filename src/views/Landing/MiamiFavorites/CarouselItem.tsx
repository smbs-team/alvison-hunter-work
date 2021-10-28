interface CarouselItemProps {
    imageUrl: string,
    alt?: string,
    title?: string,
    description?: string,
}

const CarouselItem = ({ imageUrl, alt, title, description }: CarouselItemProps) => {

    return (
        <div className='mr-2 cursor-pointer relative'>
            <img className="w-full object-cover h-36 md:h-60 object-center" src={imageUrl} alt={alt} />
            <div className="px-0 py-2_5 font-sofia flex flex-col items-start">
                <h2 className="text-xl md:text-2xl text-center mb-1 mt-0 miami-favorites-title">{title}</h2>
                <p className="text-sm text-center md:text-lg mb-3 mt-0 max-w-xs miami-favorites-subtitle">
                    {description}
                </p>
            </div>
        </div>
    )
}

export default CarouselItem;