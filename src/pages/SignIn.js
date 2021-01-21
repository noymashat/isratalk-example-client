import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import { withFirebase } from "../Firebase/context";
import * as ROUTES from "../constants/routes";
// import PasswordForgetPage from './PasswordForget'
// import { PasswordForgetLink } from "./PasswordForget";

import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const SignInPage = () => {
	const pageStyle = {
		margin: "15% 2% 2% 2%",
	};

	return (
		<div style={pageStyle}>
			<h1>Sign In</h1>
			<SignInForm />
			{/* <PasswordForgetLink /> */}
		</div>
	);
};

const SignInFormBase = (props) => {
	const [form] = Form.useForm();
	const [, forceUpdate] = useState(); // To disable submit button at the beginning.
	const [error, setError] = useState("");

	useEffect(() => {
		forceUpdate({});
	}, []);

	const onFinish = (values) => {
		const email = values.email.concat("@gmail.com");
		props.firebase
			.doSignInWithEmailAndPassword(email, values.password)
			.then(() => {
				props.history.push(ROUTES.CHARGE);
			})
			.catch((error) => {
				let err = error.message.replace("email address", "username");
				console.log(err);
				setError(err);
			});
	};

	const layout = {
		labelCol: { span: 24 },
		wrapperCol: { span: 20 },
	};

	return (
		<Form
			form={form}
			name="login"
			onFinish={onFinish}
			layout="horizontal"
			{...layout}
		>
			<Form.Item name="email" label="Username" type="text" required>
				<Input
					prefix={<UserOutlined className="site-form-item-icon" />}
					placeholder="Username"
				/>
			</Form.Item>
			<Form.Item name="password" label="Password" required>
				<Input
					prefix={<LockOutlined className="site-form-item-icon" />}
					type="password"
					placeholder="Password"
				/>
			</Form.Item>
			{error !== "" && <p style={{ color: "red" }}>{error}</p>}

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
						Log in
					</Button>
				)}
			</Form.Item>
		</Form>
	);
};

const SignInLink = () => (
	<p>
		<Link to={ROUTES.SIGN_IN}>Back to Sign In</Link>
	</p>
);

const SignInForm = withRouter(withFirebase(SignInFormBase));

export default SignInPage;

export { SignInForm, SignInLink };
