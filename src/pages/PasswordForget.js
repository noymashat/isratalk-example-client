import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { withFirebase } from "../Firebase/context";
import * as ROUTES from "../constants/routes";
import { SignInLink } from "./SignIn";

import { Form, Input, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";

const PasswordForgetPage = () => {
	const pageStyle = {
		margin: "130px auto",
		width: "25%",
	};

	return (
		<div style={pageStyle}>
			<h1>Reset Password</h1>
			<PasswordForgetForm />
			<SignInLink />
		</div>
	);
};

const PasswordForgetFormBase = (props) => {
	const [sent, setSent] = useState(false);
	const [form] = Form.useForm();
	const [, forceUpdate] = useState(); // To disable submit button at the beginning.
	const [error, setError] = useState(null);

	useEffect(() => {
		forceUpdate({});
	}, []);

	const onFinish = (values) => {
		props.firebase
			.doPasswordReset(values.email)
			.then(() => {
				setSent(true);
			})
			.catch((error) => {
				setError(error);
			});
	};

	return (
		<Form
			form={form}
			layout="horizontal"
			name="forgot-password"
			onFinish={onFinish}
		>
			<Form.Item name="email" label="Email" required>
				<Input
					prefix={<UserOutlined className="site-form-item-icon" />}
					placeholder="Email"
				/>
			</Form.Item>
			{error && <p style={{ color: "red" }}>{error.message}</p>}

			{sent && <p>Check your email to reset password, then sign in again.</p>}
			<Form.Item shouldUpdate={true}>
				{() => (
					<Button
						type="primary"
						htmlType="submit"
						disabled={
							!form.isFieldsTouched(true) ||
							form.getFieldsError().filter(({ errors }) => errors.length).length
						}
					>
						Reset Password
					</Button>
				)}
			</Form.Item>
		</Form>
	);
};

const PasswordForgetLink = () => (
	<p>
		<Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
	</p>
);

export default PasswordForgetPage;

const PasswordForgetForm = withFirebase(PasswordForgetFormBase);

export { PasswordForgetForm, PasswordForgetLink };
