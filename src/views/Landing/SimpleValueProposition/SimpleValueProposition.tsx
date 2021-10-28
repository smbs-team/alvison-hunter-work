import { Burger, Clock, Coin } from "../../../assets/icons";

export const SimpleValueProposition = () => {
    return (
        <section className="container max-w-screen-lg mx-2 lg:mx-auto mt-4 mb-8">
            <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4">
                {/* First Element */}
                <div className="h-full overflow-hidden flex flex-col items-center text-center">
                    <div className="px-0 py-0 md:py-2_5 font-grotesque">
                        < Clock />
                        <h2 className="simple-value-proposition-title my-0.5 md:my-3">Faster</h2>
                        <p className="simple-value-proposition-description mb-0 sm:mb-2">
                            We’re in your neighborhood, so your order gets to you in minutes.
                        </p>
                    </div>
                </div>

                {/* 2nd Element */}
                <div className="h-full overflow-hidden flex flex-col items-center text-center">
                    <div className="px-0 py-0 md:py-2_5 font-grotesque">
                      <Burger />
                        <h2 className="simple-value-proposition-title my-0.5 md:my-3">Better Food</h2>
                        <p className="simple-value-proposition-description mb-0 sm:mb-2">
                            Food tastes better hot. Fast delivery means better quality on arrival.
                        </p>
                    </div>
                </div>

                {/* 3rd Element */}
                <div className="h-full overflow-hidden flex flex-col items-center text-center">
                    <div className="px-0 py-0 md:py-2_5 font-grotesque">
                        <Coin />
                        <h2 className="simple-value-proposition-title my-0.5 md:my-3">No Fees</h2>
                        <p className="simple-value-proposition-description mb-0 sm:mb-2">
                            We hate hidden fees, too. So our platform is service- and delivery-fee free.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};