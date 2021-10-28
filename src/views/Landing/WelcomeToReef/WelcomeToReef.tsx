import '../../../views/Landing/landing.scss';

export const WelcomeToReef = () => {
    return (
        <div>
        <div className="horiz-center">
        <div className="icecream-banner">
          <div className="icecream-text">
            <div className="title-type">Welcome to REEF, where everything you want, and need, is delivered fast and fresh. </div>
            <div className="body-type">
                How fast? 30 minutes for meals and 10 minutes for your snack cravings and essentials. <br/>
                How fresh? Fries arrive crispy. Ice cream stays icy. And the cheese on your pizza is still melting. <br/>
                From your favorite cravings to what’s new in your neighborhood, REEF offers the best of delivery, in minutes.<br/>
            </div>
          </div>
          <div className="icecream-desktop">
          <img
              alt=""
              src="https://ik.imagekit.io/getreef/reefmarketplacedsp/site-images/ice_cream_3.png"
            />
          </div>
          <div className="icecream-mobile horiz-center reverse">
          <img
              alt=""
              src="https://ik.imagekit.io/getreef/reefmarketplacedsp/site-images/ice_cream_mobile_2.png"
            />
          </div>
        </div>
      </div>
      </div>
    );
};