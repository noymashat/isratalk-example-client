import React from "react";
import { withFirebase } from "../Firebase/context";
import { compose } from "recompose";
import { Row, Col } from "antd";
import withAuthorization from "../Session/withAuthorization";
import PlansManagment from "../components/PlansManagment";
import FarmsManagment from "../components/FarmsManagment";
import * as ROLES from "../constants/roles";

const PlansAndFarms = () => {
	return (
		<div style={{ margin: "2%", flex: "2", flexDirection: "column" }}>
			<h1>Plans & Farms</h1>
			<>
				<Row>
					<Col span={24}>
						<h3>Plans</h3>
						<PlansManagment />

						<h3>Farms</h3>
						<FarmsManagment />
					</Col>
				</Row>
			</>
		</div>
	);
};

const condition = (authUser) => authUser && !!authUser.roles[ROLES.ADMIN];

export default compose(
	withAuthorization(condition),
	withFirebase
)(PlansAndFarms);
