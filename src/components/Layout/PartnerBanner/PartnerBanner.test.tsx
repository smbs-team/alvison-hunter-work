import React from "react";
import type { RenderResult } from '@testing-library/react';
import {cleanup, render, screen} from "@testing-library/react";

import {BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import {QueryParamProvider} from "use-query-params";

import PartnerBanner from './PartnerBanner';


describe("PartnerBanner component", () => {
    let renderResult: RenderResult;


    beforeEach(() => {
        renderResult = render(

            <Router>
                {/* QueryParamProvider is need it if we are using the 3rd party hook use-query-param */}
                <QueryParamProvider ReactRouterRoute={Route}>

                    {/*  set an initial url */}
                    <Redirect from="/" to="/?partner=fetch" />

                    {/* Component to test */}
                    <PartnerBanner />

                </QueryParamProvider>

            </Router>


        );
    });

    afterEach(cleanup);


    //Asserts

    it("PartnerBanner contains a partner logo image", () => {
        expect(renderResult.getByAltText('Fetch')).toBeVisible();
    });

});
