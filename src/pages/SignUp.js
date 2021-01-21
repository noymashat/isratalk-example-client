import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { withFirebase } from "../Firebase/context";
import { compose } from "recompose";
import { Form, Input, Button, Checkbox, Modal } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import * as ROUTES from "../constants/routes";
import * as ROLES from "../constants/roles";
import axios from "axios";
require("dotenv").config();

const SignUpPage = () => {
	const pageStyle = {
		margin: "2%",
	};

	return (
		<div style={pageStyle}>
			<h1>Sign Up</h1>
			<SignUpForm />
		</div>
	);
};

const SignUpFormBase = (props) => {
	const [isAdmin, setIsAdmin] = useState(false);
	const [form] = Form.useForm();
	const [, forceUpdate] = useState(); // To disable submit button at the beginning.
	const [error, setError] = useState(null);
	const [show, setShow] = useState(false);

	useEffect(() => {
		forceUpdate({});
	}, [error]);

	const onChangeCheckbox = (e) => {
		setIsAdmin(e.target.checked);
	};

	const onFinish = (values) => {
		const roles = {};
		let email = values.email.toLowerCase();
		email = email.concat("@gmail.com");

		const username = values.email.toLowerCase();
		const isInvalid =
			values.passwordOne !== values.passwordTwo ||
			values.passwordOne === "" ||
			username === "" ||
			email === "";

		if (!isInvalid) {
			if (isAdmin) {
				roles[ROLES.ADMIN] = ROLES.ADMIN;
			}
			return axios
				.post(process.env.REACT_APP_SERVER_URL + "create", {
					email: email,
					password: values.passwordOne,
				})
				.then((res) => {
					// Create a user in your Firebase realtime database
					if (res.data.uid) {
						setShow(true);
						props.firebase
							.user(res.data.uid)
							.set({
								email,
								roles,
								username,
								collect: 0,
								sell: 0,
							})
							.then(() => {
								console.log("User was created in DB");
								setShow(true);
							})
							.catch((e) => {
								console.log(e);
							});
					}
				})
				.catch((e) => {
					console.log(e);
				});
		} else {
			setError({ message: "Some of the details are invalid" });
		}
	};

	const layout = {
		labelCol: { span: 24 },
		wrapperCol: { span: 24 },
	};

	return (
		<div>
			<Modal
				title=""
				visible={show}
				onOk={() => {
					setShow(false);
					props.history.push(ROUTES.CHARGE);
				}}
				onCancel={() => {
					setShow(false);
					props.history.push(ROUTES.CHARGE);
				}}
			>
				New User Was Created!
			</Modal>
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
						placeholder="Email"
					/>
				</Form.Item>
				<Form.Item name="passwordOne" label="Password One" required>
					<Input.Password
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="password"
						placeholder="Password"
					/>
				</Form.Item>
				<Form.Item name="passwordTwo" label="Password Two" required>
					<Input.Password
						prefix={<LockOutlined className="site-form-item-icon" />}
						type="password"
						placeholder="Password"
						dependencies={["passwordOne"]}
						rules={[
							{
								required: true,
								message: "Please confirm your password!",
							},
							({ getFieldValue }) => ({
								validator(rule, value) {
									if (!value || getFieldValue("passwordOne") === value) {
										return Promise.resolve();
									}
									return Promise.reject(
										"The two passwords that you entered do not match!"
									);
								},
							}),
						]}
					/>
				</Form.Item>
				<Form.Item>
					<Checkbox checked={isAdmin} onChange={onChangeCheckbox}>
						Create as Admin
					</Checkbox>
				</Form.Item>
				{error && <p style={{ color: "red" }}>{error.message}</p>}

				<Form.Item shouldUpdate={true}>
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
							Sign Up
						</Button>
					)}
				</Form.Item>
			</Form>
		</div>
	);
};

const SignUpForm = compose(withRouter, withFirebase)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm };
