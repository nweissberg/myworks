import {
	getAuth,
	isSignInWithEmailLink,
	signInWithEmailLink,
} from "firebase/auth";
import { useAuth } from "../api/auth";
import { useRouter } from "next/router";
import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import React, { useRef, useState, useEffect } from "react";
export default function FinishSignUp() {
	// Confirm the link is a sign-in with email link.
	const auth = getAuth();
	const router = useRouter()

	useEffect(()=>{
		console.log("Confirm email link", router)
		if (isSignInWithEmailLink(auth, window.location.href)) {
			// Additional state parameters can also be passed via URL.
			// console.log(window.location.href)
			// This can be used to continue the user's intended action before triggering
			// the sign-in operation.
			// Get the email if available. This should be available if the user completes
			// the flow on the same device where they started it.
			let email = window.localStorage.getItem("emailForSignIn");
			// console.log(email)
			if (!email) {
				// User opened the link on a different device. To prevent session fixation
				// attacks, ask the user to provide the associated email again. For example:
				email = window.prompt("Entre com seu email aqui");
			}
			console.log(email)
			// The client SDK will parse the code from the link for you.
			signInWithEmailLink(auth, email, window.location.href)
			.then((result) => {
				console.log(result)
				// Clear email from storage.
				window.localStorage.removeItem("emailForSignIn");
				// You can access the new user via result.user
				// Additional user info profile not available via:
				// result.additionalUserInfo.profile == null
				// You can check if the user is new or existing:
				// result.additionalUserInfo.isNewUser
				router.push({ pathname: '/', shallow: true })
			})
			.catch((error) => {
				console.log(error)
				// Some error occurred, you can inspect the code: error.code
				// Common errors could be invalid email and invalid or expired OTPs.
				router.push({ pathname: '/', shallow: true })
			});
		}

	},[router])

	return <>
		<div className="center">
			CONFIRMAR?
		</div>
	</>;

}
