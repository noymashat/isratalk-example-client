import React from "react";
import { Modal, Form, Button } from "antd";

const DeleteModal = (props) => {
	const { show, ID, onSubmit, handleClose } = props;
	const [form] = Form.useForm();

	const layout = {
		labelCol: { span: 24 },
		wrapperCol: { span: 17 },
	};
	return (
		<Modal
			key={ID}
			title="Delete"
			visible={show}
			onCancel={handleClose}
			footer={[]}
		>
			<Form
				key={ID}
				form={form}
				name="delete"
				onFinish={onSubmit}
				layout="horizontal"
				{...layout}
			>
				<Form.Item>{`Are you sure you want to delete this?`}</Form.Item>

				<Form.Item style={{ float: "right" }} shouldUpdate={true}>
					{() => (
						<Button
							type="primary"
							htmlType="submit"
						>
							Delete
						</Button>
					)}
				</Form.Item>
			</Form>
		</Modal>
	);
};
export default DeleteModal;
