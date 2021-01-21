import React from "react";
import { Button } from "antd";
import { withFirebase } from "../Firebase/context";

const ResetButton = (props) => {
	const { ID, onClickReset } = props;

	const onClick = () => {
		onClickReset(ID);
	};

	return (
		<div>
			<Button variant="primary" onClick={onClick}>
				Reset
			</Button>
		</div>
	);
};

export default withFirebase(ResetButton);
