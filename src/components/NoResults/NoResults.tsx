import { INoResultsProps } from './NoResults.interface';
import { useHistory } from "react-router-dom";
import NoResultsImg from '../../assets/images/no-results.png';
import { Button, Typography } from '@material-ui/core';
import './NoResults.scss';


const NoResults = ({search}: INoResultsProps) => {
    const history = useHistory();

    return(
        <section className="no-results flex flex-col items-center pt-8 pb-28 px-1 font-sofia">
            <img src={NoResultsImg} alt="Empty plate with no results" />
            <Typography variant="h3" className="mt-4 mb-1 text-2xl text-center font-sofia">Sorry, there are no results { search ? `for "${search}"` : '' }</Typography>
            <Typography variant="subtitle1" className="mt-0 mb-5 font-semibold text-sm font-sofia">Try searching for something else instead</Typography>
            <Button className="no-results__button font-sofia" variant="contained" color="primary">Back to homepage</Button>
        </section>
    );
}
export default NoResults;