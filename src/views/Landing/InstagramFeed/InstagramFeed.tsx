import Slider, { Settings } from "react-slick";
import InstagramItem from "./InstagramItem";
import { NextArrow, PrevArrow } from "../shared/Arrows";
import "./slick.scss";
import "./slick-theme.scss";
import useSWR from "swr";
import { SWRFetchWithoutCredentials } from "../../../utils";

interface ISliderContainer {
    posts: IInstagramPost[]
    carouselSettings: Settings
    instagramUser: (caption: string) => string;
}

export interface IInstagramPost {
    id: string;
    media_url: string;
    caption: string;
    timestamp: string;
    thumbnail_url: string;
    media_type: string;
    permalink: string;
}

const SliderContainer = ({ posts, carouselSettings, instagramUser }: ISliderContainer) => (
    <Slider {...carouselSettings}>
        {posts.map((item: IInstagramPost) => {
            return (
                <InstagramItem
                    key={item.id}
                    instaFeed={item.caption}
                    instaUser={instagramUser(item.caption)}
                    imageUrl={
                        (item.media_type === 'IMAGE' && item.media_url) ||
                        (item.media_type === 'CAROUSEL_ALBUM' && item.media_url) ||
                        (item.media_type === 'VIDEO' && item.thumbnail_url) ||
                        ''
                    }
                    instaURL={item.permalink}
                />
            )
        })}
    </Slider>
);

const API_URL = "https://graph.instagram.com/me/media?fields=";
const API_FIELDS = "caption,media_url,timestamp,thumbnail_url,media_type,permalink";
const INSTAGRAM_TOKEN = process.env.REACT_APP_INSTAGRAM_TOKEN;

//! Component
export const InstagramFeed = () => {
    const getUrl = API_URL + API_FIELDS + "&access_token=" + INSTAGRAM_TOKEN;
    const { data: posts, error: instagramError } = useSWR((getUrl) || null, SWRFetchWithoutCredentials);
    if (instagramError) {
        console.log("Instagram media fetch " + instagramError);
    }

    const carouselSettings = {
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 600,
                settings: {
                    centerPadding: "20px",
                    className: "center",
                    centerMode: true,
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }],
        prevArrow: <PrevArrow />,
        nextArrow: <NextArrow />
    };

    const instagramUser = (caption: string): string => {
        let instaUser = caption.match(/@\S+/g);
        return instaUser === null ? '@getREEF' : instaUser[0];
    };

    return (
        <>
            {!instagramError && posts?.data?.length > 0 ?
                <section className="w-full -mt-3 pt-4 sm:pt-6 justify-center items-center box-border sm:px-3 lg:px-32 relative bg-gray-100 sm:bg-transparent">
                    <h2 className="text-2xl md:text-3xl lg:text-5xl mb-4 px-3 sm:px-0 font-bold uppercase font-hanson">WORD ON THE STREET</h2>
                    <SliderContainer
                        posts={posts.data}
                        carouselSettings={carouselSettings}
                        instagramUser={instagramUser}
                    />
                </section>
                : null
            }
        </>
    )
}