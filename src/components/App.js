import React from "react";
import withAuthentication from "../Session/withAuthentication";

import { BrowserRouter as Router, Route } from "react-router-dom";
import * as ROUTES from "../constants/routes";
import Navigation from "../Navigation";
import SignUpPage from "../pages/SignUp";
import SignInPage from "../pages/SignIn";
import ManageAgentsPage from "../pages/ManageAgents";
import PlansAndFarms from "../pages/PlansAndFarms";
import ChargePage from "../pages/Charge";
import AgentHistory from "../pages/AgentHistory";
import CustomerHistory from "../pages/CustomerHistory";
import "antd/dist/antd.css";
import PasswordForgetPage from "../pages/PasswordForget";
import { useMediaQuery } from "react-responsive";

const App = (props) => {
	const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1224px)" });
	const styleDesktop = {
		width: "55%",
		margin: "auto",
		alignContent: "center",
	};
	const styleMobile = { margin: "2%" };
	const deviceStyle = isTabletOrMobile ? styleMobile : styleDesktop;
	return (
		<Router>
			<div style={deviceStyle}>
				<Navigation isMobile={false} />
				<hr style={{ margin: "0px" }} />
				<Route path={ROUTES.SIGN_IN} component={SignInPage} />
				<Route exact path={ROUTES.CHARGE} component={ChargePage} />
				<Route path={ROUTES.SIGN_UP} component={SignUpPage} />
				<Route path={ROUTES.MANAGE} component={ManageAgentsPage} />
				<Route path={ROUTES.PLANS_FARMS} component={PlansAndFarms} />
				<Route path={ROUTES.AGENT_HISTORY} component={AgentHistory} />
				<Route path={ROUTES.CUSTOMER_HISTORY} component={CustomerHistory} />
				<Route path={ROUTES.PASSWORD_FORGET} component={PasswordForgetPage} />
				{/* <Route path={"/signout"} component={() => props.firebase.doSignOut()} /> */}
			</div>
		</Router>
	);
};

export default withAuthentication(App);
