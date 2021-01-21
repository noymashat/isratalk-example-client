import React from "react";
import { Button } from "antd";
import { withFirebase } from "../Firebase/context";

const DeleteButton = (props) => {
	const { ID, onClickDelete } = props;

	const onClick = () => {
		onClickDelete(ID);
	};

	return (
		<div>
			<Button variant="primary" onClick={onClick}>
				Delete
			</Button>
		</div>
	);
};

export default withFirebase(DeleteButton);
