import { FC } from "react";


const BrandsLoadingSkeleton: FC = function () {

    return (
        <div className="loading-skeleton location-section">
            <div className="all-restaurants-container">
                <div className="skeleton-title section-title type sm bold" />
                <div className="brand-list">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((each) => (
                        <div key={each} className="brand-list-item">
                            <div className="brand-box">
                                <div className="brand-image" />
                            </div>
                            <div className="type s16 bold brand-name" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default BrandsLoadingSkeleton;

