import React from "react";
import { Modal, Button } from "antd";
import { withFirebase } from "../Firebase/context";
import AddCustomerForm from "./AddCustomerForm";

const AddNewCustomer = ({
	onSubmit,
	show,
	handleShow,
	handleClose,
	farms,
	error,
}) => {
	return (
		<div>
			<Button variant="primary" onClick={handleShow}>
				Add New Customer
			</Button>

			<Modal
				title="Add New Customer"
				visible={show}
				onCancel={handleClose}
				footer={[]}
			>
				<AddCustomerForm
					onSubmit={onSubmit}
					handleClose={handleClose}
					farms={farms}
					error={error}
				/>
			</Modal>
		</div>
	);
};

export default withFirebase(AddNewCustomer);
