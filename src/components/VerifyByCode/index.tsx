import React, { useState } from "react";
import axios from "axios";
import { sha256 } from "js-sha256";
import './index.css'
import { useNavigate } from "react-router-dom";

const VerifyByCode = () => {
	const [wrongCode, setWrongCode] = useState(false);
	const [authorizationCode, setAuthorizationCode] = useState("");

	const navigate = useNavigate();
	const verifyCode = async (e: any) => {
		e.preventDefault();
		try {
			//console.log(sha256(authorizationCode))
			const response = await axios.post(
				'/api/getClassListByCode',
				{ code: sha256(authorizationCode) },
				{ headers: { 'Content-Type': 'application/json' } }
			);
			console.log(response.data)
			if (response.data.length) {
				localStorage.setItem('authorizationCode', sha256(authorizationCode));
				localStorage.setItem('classList', JSON.stringify(response.data));
				navigate("/index");
			} else {
				setWrongCode(true);
				setTimeout(() => setWrongCode(false), 2000);
			}
		} catch (error) {
			console.error("请求错误:", error);
		}
	};

	return (
		<div className={"border-flowing-lines page-center " + (wrongCode ? "border-flowing-lines-error" : "")}>
			<form onSubmit={verifyCode}>
				<div className="inputBox margin-auto">
					<input
						id="authorization-code"
						type="password"
						autoComplete="off"
						required
						onChange={(e) => setAuthorizationCode(e.target.value)}
					/>
					<span>授权码</span>
				</div>
				<button type="submit" className={"button teal margin-auto " + (wrongCode ? "disabled" : "")}>
					Verify
				</button>
			</form>
		</div>
	);
};

export default VerifyByCode;
