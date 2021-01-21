import React from "react";
import { Button } from "antd";
import { withFirebase } from "../Firebase/context";

const Pay = (props) => {
	const { customerKey, debt, onClickPay } = props;

	const onClick = () => {
		onClickPay(customerKey, debt);
	};

	return (
		<div>
			<Button variant="primary" onClick={onClick}>
				Pay
			</Button>
		</div>
	);
};

export default withFirebase(Pay);
