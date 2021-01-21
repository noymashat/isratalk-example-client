import React, { useState, useEffect } from "react";
import { Form, Input, Button, Select } from "antd";

const EditCustomerForm = (props) => {
	const [form] = Form.useForm();
	const [, forceUpdate] = useState(); // To disable submit button at the beginning.
	// const [error, setError] = useState(null);
	const { customer, onSubmit, handleClose, farms } = props;
	const { Option } = Select;

	React.useEffect(() => {
		form.setFieldsValue({
			key: customer[0].key,
			firstName: customer[0].firstName,
			lastName: customer[0].lastName,
			phoneNumber: customer[0].phoneNumber,
			farm: customer[0].farm,
		});
	}, []);

	useEffect(() => {
		forceUpdate({});
	}, []);

	const layout = {
		labelCol: { span: 7 },
		wrapperCol: { span: 12 },
	};

	return (
		<Form
			form={form}
			name="editCustomer"
			onFinish={onSubmit}
			layout="horizontal"
			{...layout}
		>
			<Form.Item
				style={{ margin: "0px 0px 24px 0px" }}
				name="firstName"
				label="First Name"
				type="text"
				required
			>
				<Input placeholder="First Name" />
			</Form.Item>
			<Form.Item name="lastName" label="Last Name" required>
				<Input type="text" placeholder="Last Name" />
			</Form.Item>
			<Form.Item name="phoneNumber" label="Phone Number" required>
				<Input type="tel" placeholder="Phone Number" />
			</Form.Item>
			<Form.Item name="farm" label="Farm" required>
				<Select style={{ width: 200 }} placeholder="Choose farm...">
					{farms.map((farm, index) => {
						return (
							<Option key={index} value={farm.name}>
								{farm.name}
							</Option>
						);
					})}
				</Select>
			</Form.Item>
			{props.error && <p style={{ color: "red" }}>{props.error.message}</p>}

			<Button
				style={{ float: "right", margin: "0px 0px 0px 10px" }}
				variant="secondary"
				onClick={handleClose}
			>
				Cancel
			</Button>
			<Form.Item style={{ float: "right" }} shouldUpdate={true}>
				{() => (
					<Button
						type="primary"
						htmlType="submit"
						disabled={
							!form.isFieldsTouched(true) ||
							form.getFieldsError().filter(({ errors }) => errors.length).length
						}
					>
						Update
					</Button>
				)}
			</Form.Item>
		</Form>
	);
};

export default EditCustomerForm;
