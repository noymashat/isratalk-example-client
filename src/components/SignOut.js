import React from "react";
import { withRouter, Link } from "react-router-dom";

import * as ROUTES from "../constants/routes";
import { withFirebase } from "../Firebase/context";

const SignOutButton = (props) => (
	<Link
		to={ROUTES.SIGN_IN}
		onClick={() => {
			props.firebase.doSignOut();
		}}
	>
		<p
			style={{
				margin: "auto",
				lineHeight: "20px",
			}}
		>
			<b>Sign Out</b>
		</p>
	</Link>
);

const SignOut = withRouter(withFirebase(SignOutButton));

export default withFirebase(SignOut);
