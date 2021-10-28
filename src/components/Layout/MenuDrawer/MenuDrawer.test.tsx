import React from "react";
import type { RenderResult } from '@testing-library/react';
import {render, screen} from "@testing-library/react";

import {BrowserRouter as Router, Route, Redirect} from "react-router-dom";
import {QueryParamProvider} from "use-query-params";

import MenuDrawer from './MenuDrawer';
import store from "../../../store";
import {Provider} from "react-redux";


describe("MenuDrawer component", () => {

    let renderResult: RenderResult;



    beforeEach(() => {
        renderResult = render(

            <Router>
                {/* QueryParamProvider is need it if we are using the 3rd party hook use-query-param */}
                <QueryParamProvider ReactRouterRoute={Route}>

                    <Provider store={store}>

                        {/*  set an initial url */}
                        {/*<Redirect from="/" to="/?partner=fetch"/>*/}

                        {/* Component to test */}
                        <MenuDrawer anchorPosition="left" isDrawerOpen={true} toggleDrawerFunction={() => {}} />

                    </Provider>

                </QueryParamProvider>

            </Router>

        );
    });


    //Asserts

    it("MenuDrawer contains a 'Drive with REEF' text", () => {
        expect(screen.getByText('Drive with REEF')).toBeInTheDocument();
    });

    it("MenuDrawer contains a 'Login' text if the user is Log Out", () => {
        expect(screen.getByText('Login')).toBeInTheDocument();
    });

});
