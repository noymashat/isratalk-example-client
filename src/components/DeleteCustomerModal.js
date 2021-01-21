import React from "react";
import { Modal, Form, Button } from "antd";

const DeleteCustomerModal = (props) => {
	const { show, customerKey, name, onSubmit, handleClose } = props;
	const [form] = Form.useForm();

	const layout = {
		labelCol: { span: 24 },
		wrapperCol: { span: 17 },
	};
	return (
		<Modal
			key={customerKey}
			title="Delete Customer"
			visible={show}
			onCancel={handleClose}
			footer={[]}
		>
			<Form
				key={customerKey}
				form={form}
				name="delete"
				onFinish={onSubmit}
				layout="horizontal"
				{...layout}
			>
				<Form.Item>{`Are you sure you want to delete ${name}?`}</Form.Item>

				<Form.Item style={{ float: "right" }} shouldUpdate={true}>
					{() => (
						<Button
							type="primary"
							htmlType="submit"
							disabled={
								!form.isFieldsTouched(true) ||
								form.getFieldsError().filter(({ errors }) => errors.length)
									.length
							}
						>
							Delete
						</Button>
					)}
				</Form.Item>
			</Form>
		</Modal>
	);
};
export default DeleteCustomerModal;
