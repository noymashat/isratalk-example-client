import React, { useEffect, useState } from "react";
import { withFirebase } from "../Firebase/context";

import { Button, Form, Modal, Select } from "antd";

const BuyModal = (props) => {
	const { show, customerKey, name, options, onSubmit, handleClose } = props;
	const { Option } = Select;

	const [form] = Form.useForm();
	const [, forceUpdate] = useState(); // To disable submit button at the beginning.

	useEffect(() => {
		forceUpdate({});
	}, []);

	const onFinish = (values) => {
		const planName = options[values.plans].name;
		const amount = options[values.plans].cost;
		onSubmit(planName, amount);
		form.resetFields();
	};

	const layout = {
		labelCol: { span: 24 },
		wrapperCol: { span: 12 },
	};

	return (
		<Modal
			key={customerKey}
			title="Buy"
			visible={show}
			onCancel={handleClose}
			footer={[]}
		>
			<Form
				key={customerKey}
				form={form}
				name="choosePlan"
				onFinish={onFinish}
				layout="horizontal"
				{...layout}
			>
				<Form.Item name="plans" label={`Choose a plan for ${name}`} required>
					<Select style={{ width: 200 }} placeholder="Choose plan...">
						{options.map((option, index) => {
							return (
								<Option key={index} value={index} name={option.name}>
									{option.name + " - " + option.cost + " ILS"}
								</Option>
							);
						})}
					</Select>
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
							Buy
						</Button>
					)}
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default withFirebase(BuyModal);
