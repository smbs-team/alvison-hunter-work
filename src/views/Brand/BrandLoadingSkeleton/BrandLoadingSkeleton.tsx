import {FC} from "react";


const BrandLoadingSkeleton : FC = function() {

    return (
        <div className="loading-skeleton">
            <div className="branding">
                <div className="brand-img"/>
                <div className="brand-info">
                    <div className="brand-name"/>
                    <div className="store-hrs-mobile"/>
                </div>
            </div>
            <div className="store-hrs-desktop"/>
            <div className="location-mobile"/>
            <div className="location-mobile"/>
            <div className="items">
                <div className="width">
                    <div className="categories">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
                            (each) => (
                                <div key={each} className="horiz-center cat-container ">
                                    <div className="category"/>
                                </div>
                            )
                        )}
                    </div>
                    <div className="item-list">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((each) => (
                            <div key={each} className="item">
                                <div className="item-img"/>
                                <div className="item-text">
                                    <div className="item-name"/>
                                    <div className="item-desc"/>
                                    <div className="item-price"/>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

 export default BrandLoadingSkeleton;