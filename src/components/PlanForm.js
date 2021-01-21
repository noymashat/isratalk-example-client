import React, { useState, useEffect } from "react";
import { withFirebase } from "../Firebase/context";

import { Form, Input, InputNumber, Button, Row, Col } from "antd";

const PlanForm = (props) => {
	const { onFinishPlan } = props;

	const [form] = Form.useForm();
	const [, forceUpdate] = useState(); // To disable submit button at the beginning.

	useEffect(() => {
		forceUpdate({});
	}, []);

	const layout = {
		labelCol: { span: 24 },
		wrapperCol: { span: 5 },
	};

	return (
		<Form
			form={form}
			name="plans"
			onFinish={onFinishPlan}
			layout="horizontal"
			{...layout}
		>
			<Col>
				<Form.Item name="name" label="Plan Name" type="text" required>
					<Input placeholder="Plan" />
				</Form.Item>
			</Col>
			<Row>
				<Col span={7}>
					<Form.Item name="cost" label="Cost" required>
						<InputNumber placeholder="Cost" />
					</Form.Item>
				</Col>
				<Col span={5}>
					<Form.Item shouldUpdate={true}>
						{() => (
							<Button
								style={{ marginTop: "40px" }}
								type="primary"
								htmlType="submit"
								disabled={
									!form.isFieldsTouched(true) ||
									form.getFieldsError().filter(({ errors }) => errors.length)
										.length
								}
							>
								Add
							</Button>
						)}
					</Form.Item>
					{props.error && <p style={{ color: "red" }}>{props.error.message}</p>}
				</Col>
			</Row>
		</Form>
	);
};

export default withFirebase(PlanForm);
