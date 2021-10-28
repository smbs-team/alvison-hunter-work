import image1 from '../../../assets/images/landingPage/WorkWithReef/handshake.svg';
import image2 from '../../../assets/images/landingPage/WorkWithReef/car.svg';
import { NAME_SPACE } from '../../../utils/constants';

export const WorkWithReef = () => {
  return (
    <section className="container max-w-screen-lg mx-2 lg:mx-auto mt-10 mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
      {/* First Element */}
      <div className="h-full overflow-hidden flex flex-col items-center text-center">
        <img
          height="81px"
          className=" object-cover object-center"
          src={image1}
          alt="handshake"
        />

        <div className="px-0 py-2_5 font-grotesque">
          <h2 className="work-with-reef-title">
            { NAME_SPACE.PARTNER }
          </h2>
          <p className="work-with-reef-description"
          >Want to see your product in the marketplace? Join the platform! More revenue for you, more delivery goodness for our neighborhoods.
          </p>
          <a
            href="https://reeftechnology.com/"
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer no-underline work-with-reef-apply-now-link"
          >Start Now
          </a>
        </div>
      </div>

      {/* 2nd Element */}
      <div className="h-full overflow-hidden flex flex-col items-center text-center">
        <img
          height="81px"
          className=" object-cover object-center"
          src={image2}
          alt="handshake"
        />

        <div className="px-0 py-2_5 font-grotesque">
          <h2 className="work-with-reef-title">
            { NAME_SPACE.DRIVE }
          </h2>
          <p className="work-with-reef-description"
          >Looking to bring the best to your neighborhood? We’ve got a gig for
            you. Check out where we’re hiring. Our top-notch benefits and get
            hired-fast.
          </p>
          <a
            href="https://careers.reeftechnology.com/careers"
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer no-underline work-with-reef-apply-now-link"
          >Apply Now</a>
        </div>
      </div>
    </section>
  );
};
