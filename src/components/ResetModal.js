import React from "react";
import { Modal, Form, Button } from "antd";

const ResetModal = (props) => {
	const { show, ID, onSubmit, handleClose } = props;
	const [form] = Form.useForm();

	const layout = {
		labelCol: { span: 24 },
		wrapperCol: { span: 17 },
	};
	return (
		<Modal
			key={ID}
			title="Reset"
			visible={show}
			onCancel={handleClose}
			footer={[]}
		>
			<Form
				key={ID}
				form={form}
				name="reset"
				onFinish={onSubmit}
				layout="horizontal"
				{...layout}
			>
				<Form.Item>{`Are you sure you want to reset ?`}</Form.Item>

				<Form.Item style={{ float: "right" }} shouldUpdate={true}>
					{() => (
						<Button type="primary" htmlType="submit">
							Reset
						</Button>
					)}
				</Form.Item>
			</Form>
		</Modal>
	);
};
export default ResetModal;
