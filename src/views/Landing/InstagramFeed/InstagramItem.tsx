interface InstagramItemProps {
    imageUrl: string,
    instaFeed?: string,
    instaUser: string,
    instaURL: string,
}

const InstagramItem = ({ imageUrl, instaFeed, instaUser, instaURL }: InstagramItemProps) => {
    const goToInstagramPost = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        window.open(instaURL, "_blank");
    }

    return (
        <div className='mr-2 relative instagram-card'>
            <img alt={instaFeed} className="w-full object-cover h-40 sm:h-48 object-center" src={imageUrl} />
            <div className="instagram-card__body items-center px-0 py-2_5 font-sofia flex flex-col sm:border-solid sm:border-2 sm:border-gray-200" >
                <div className="text-lg text-center mb-2 mt-0 w-9/12 h-18 line-clamp-2 sm:line-clamp-2 lg:line-clamp-2">{instaFeed}</div>
                <p className="text-taupe text-sm text-center mb-2 mt-0 max-w-xs">
                    {instaUser}
                </p>
                <button className="cursor-pointer mb-4 sm:mb-2 lg:mb-4 mt_0 px-2 py-1_5 text-xl text-center 
                    font-bold border-solid border-1 content_black bg-white" onClick={goToInstagramPost}>
                    View Story
                </button>
            </div>
        </div>
    )
}

export default InstagramItem;