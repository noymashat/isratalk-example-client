import React from "react";
import { Button } from "antd";
import { withFirebase } from "../Firebase/context";

const DeleteCustomer = (props) => {
	const { customerKey, onClickDelete } = props;

	const onClick = () => {
		onClickDelete(customerKey);
	};

	return (
		<div>
			<Button variant="primary" onClick={onClick}>
				Delete
			</Button>
		</div>
	);
}

export default withFirebase(DeleteCustomer);
