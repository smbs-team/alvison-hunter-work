import "./brandsHero.scss"

export const BrandsHero = () => {
    return <div className="brands-hero">
        <div className="brands-container">
            <div className="brands-container__wrapper">
                <div className="brands-container__description">
                    <div className="brands-giant-text sm:leading-loose">
                        40% OFF
                    </div>
                    <div className="md:text-4xl text-xl text-center pt-1 sm:pt-2 md:pt-4 font-sofia">Get what you want for less</div>
                    <p className="md:text-base text-center font-sofia leading-6" >Get 40% off your first order when you use promo code GET40 at checkout.</p>
                </div>
            </div>
        </div>
    </div>
}
