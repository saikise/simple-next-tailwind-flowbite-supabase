"use client";

import ToggleModalButton from "@/components/client-components/ToggleModalButton";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

export default function LoggedOutMenu() {
  return (
    <div className="flex gap-4">
      <ToggleModalButton
        buttonName="Login"
        modalID="loginModal"
        key="loginModal"
        modalTitle="Login"
      >
        <LoginForm />
      </ToggleModalButton>

      <ToggleModalButton
        buttonName="Register"
        modalID="registerModal"
        key="registerModal"
        modalTitle="Register"
      >
        <RegisterForm />
      </ToggleModalButton>
    </div>
  );
}
