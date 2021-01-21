import React, { useState, useEffect } from "react";

import { Button, Form, Modal, InputNumber } from "antd";

const PayModal = (props) => {
	const { show, customerKey, name, onSubmit, handleClose } = props;

	const [form] = Form.useForm();
	const [, forceUpdate] = useState(); // To disable submit button at the beginning.

	useEffect(() => {
		forceUpdate({});
	}, []);

	const onFinish = (values) => {
		onSubmit(values.pay);
		form.resetFields();
	};

	const layout = {
		labelCol: { span: 24 },
		wrapperCol: { span: 24 },
	};

	return (
		<Modal
			key={customerKey}
			title="Pay"
			visible={show}
			onCancel={handleClose}
			footer={[]}
			cancelButtonProps={{ style: { display: "none", border: "0px" } }}
		>
			<Form
				key={customerKey}
				form={form}
				name="pay"
				onFinish={onFinish}
				layout="horizontal"
				{...layout}
			>
				<Form.Item
					name="pay"
					label={`Add payment amount from ${name}`}
					required
				>
					<InputNumber style={{ width: "50%" }} />
				</Form.Item>

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
							Pay
						</Button>
					)}
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default PayModal;
