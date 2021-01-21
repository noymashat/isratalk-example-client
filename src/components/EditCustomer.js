import React from "react";
import { Modal, Button } from "antd";
import { withFirebase } from "../Firebase/context";
import EditCustomerForm from "./EditCustomerForm";

const EditCustomer = ({
	onSubmitEdit,
	customer,
	show,
	handleShow,
	handleClose,
	farms,
	error,
}) => {

    const onSubmitEditForm = (values) => {
        onSubmitEdit(customer[0].key, values)
    }

	return (
		<div>
			<Button variant="primary" onClick={handleShow}>
				Edit
			</Button>
			<Modal
				title="Edit Customer"
				visible={show}
				onCancel={handleClose}
				footer={[]}
			>
				<EditCustomerForm
					customer={customer}
					onSubmit={onSubmitEditForm}
					handleClose={handleClose}
					farms={farms}
					error={error}
				/>
			</Modal>
		</div>
	);
};

export default withFirebase(EditCustomer);
