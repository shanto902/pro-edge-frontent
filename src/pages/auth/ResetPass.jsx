// src/pages/auth/ResetPass.jsx
import React from "react";
import BackButton from "../../components/common/utils/button/BackButton"
import TextInput from "../../components/common/form/TextInput"
import Button from '../../components/common/utils/button/Button'

const ResetPass = () => {
  return (
    <main className="flex items-start justify-center min-h-screen">
      <article className="bg-white p-8 max-w-xl w-full rounded-xl">
        <header className="mb-8">
          <BackButton to="/auth/signin" />
        </header>

        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#182B55]">
              Forgot Password?
            </h1>
            <p className="text-[#5D6576]">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          <form className="space-y-6" method="POST" action="#">
            <TextInput
              type="email"
              id="email"
              name="email"
              label="Email Address"
              placeholder="Enter your email"
              required
            />

            
          <Button label="Send Email" />
          </form>
        </div>
      </article>
    </main>
  );
};

export default ResetPass;
