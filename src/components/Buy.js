import React from "react";
import { Button } from "antd";
import { withFirebase } from "../Firebase/context";

const Buy = (props) => {
	const { customerKey, debt, onClickBuy } = props;

	const onClick = () => {
		onClickBuy(customerKey, debt);
	};

	return (
		<Button variant="primary" onClick={onClick}>
			Buy
		</Button>
	);
};
export default withFirebase(Buy);
