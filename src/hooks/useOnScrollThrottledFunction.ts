
import { useEffect } from "react";
import throttle from "lodash/throttle";

/*
* Custom Hook to bind a callback function to the 'scroll' event.
* params: callbackToThrottle, timeToThrottle, callbackArgs
* */
export function useOnScrollThrottledFunction(callbackToThrottle: (...anyArgs: any[]) => any, timeToThrottle : number = 1000, ...callbackArgs : any[]) : void {

    // @ts-ignore
    const throttledFunction = throttle(callbackToThrottle.bind(this, ...callbackArgs), timeToThrottle, {leading: true});

    useEffect(function () {
        try {
            window.addEventListener('scroll', throttledFunction);

            //clear the handler after the Component is unmounted to avoid pollute another environments
            return () => {
                window.removeEventListener('scroll', throttledFunction);
                throttledFunction.cancel();
            }
        } catch (error) {
            console.log(error);
        }

    }, [throttledFunction])

}