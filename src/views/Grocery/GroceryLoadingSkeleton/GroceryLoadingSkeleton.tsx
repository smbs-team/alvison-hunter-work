import {FC} from "react";


const GroceryLoadingSkeleton : FC = function() {

    return (
        <div className="loading-skeleton location-section">
            <div className="space-bt">
                <div className="skeleton-title type sm bold" />
                <div className="type s14 view-all"></div>
            </div>
            <div className="brand-list">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((each) => (
                    <div key={each} className="horiz-center brand-list-item">
                        <div className="brand-box">
                            <div className="brand-image" />
                            <div className="type s16 bold brand-name" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GroceryLoadingSkeleton;
