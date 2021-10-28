import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
export const Discounts: React.FC = () => {
    /*- Custom Styling for the Order Button with Material-UI -*/ 
    const OrderNowButton = withStyles({
        root: {
          background: '#ffffff',
          cursor:'pointer',
          borderRadius: 0,
          border: 0,
          color: '#030E1B',
          fontSize:'20px',
          fontFamily:'Sofia Pro',
          letterSpacing:'-0.5px',
          lineHeight:'24px',
          height: 48,
          width:187,
          padding: '11px 16px 11px 16px',
        },
        label: {
          textTransform: 'capitalize',
        },
      })(Button);

    /** This fn will scroll up and focus on the searchbar select input element */
    const handleOrderNowBtn = () =>{
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        const searchBarInput = document.getElementById('places-search');
        searchBarInput && searchBarInput.focus();
    }

    return (
        <div
            className="flex flex-col space-y-4 md:space-y-6 py-4 md:py-10 items-center md:items-start jumbotron-regular-text bg-brown-color">
            <div className="md:ml-5 lg:ml-10 w-11/12 lg:w-8/12 text-center lg:text-left">
                <span className="jumbotron-discounts-title">Discounts Taste...<br className="block sm:hidden" />SO Good</span>
            </div>
            <div className="lg:ml-10 w-9/12 sm:w-7/12 lg:w-8/12 text-center items-center lg:text-left mx-auto">
                <span className="jumbotron-discounts-description">
                    Get 40% Off your first order when you use promo code GET40 at checkout.
                </span>
            </div>
            <div className="lg:ml-10 mx-auto pb-3 sm:pb-0 md:w-8/12 flex flex-row justify-center items-center lg:items-start lg:justify-start">
                <OrderNowButton 
                variant="contained"
                onClick={()=>{handleOrderNowBtn()}}
                >
                    Order Now
                </OrderNowButton>
            </div>
        </div>
    );
};
