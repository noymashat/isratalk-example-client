import React, { useState, useEffect } from "react";
import { withFirebase } from "../Firebase/context";

import { Form, Input, Button, Row, Col } from "antd";

const FarmForm = (props) => {
	const { onFinishFarm, error } = props;

	const [form] = Form.useForm();
	const [, forceUpdate] = useState(); // To disable submit button at the beginning.

	useEffect(() => {
		forceUpdate({});
	}, []);

	const layout = {
		labelCol: { span: 24 },
		wrapperCol: { span: 14 },
	};

	return (
		<Form
			form={form}
			name="farms"
			onFinish={onFinishFarm}
			layout="horizontal"
			{...layout}
		>
			<Row>
				<Col>
					<Form.Item name="name" label="Farm Name" type="text" required>
						<Input placeholder="Farm" />
					</Form.Item>
				</Col>
				<Col>
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
					{error && <p style={{ color: "red" }}>{error.message}</p>}
				</Col>
			</Row>
		</Form>
	);
};

export default withFirebase(FarmForm);
