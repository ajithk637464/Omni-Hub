"use client";

import { useRouter } from "next/navigation";
import { type FormEvent } from "react";

export default function LoginForm() {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/dashboard");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="email">Work email</label>
        <input
          autoComplete="email"
          id="email"
          name="email"
          placeholder="you@company.com"
          required
          type="email"
        />
      </div>
      <div className="form-field">
        <label htmlFor="password">Password</label>
        <input
          autoComplete="current-password"
          id="password"
          name="password"
          placeholder="Enter your password"
          required
          type="password"
        />
      </div>
      <div className="form-options">
        <label className="remember-option" htmlFor="remember">
          <input id="remember" name="remember" type="checkbox" />
          Remember me
        </label>
        <span className="text-link">Forgot password?</span>
      </div>
      <button className="primary-button" type="submit">
        Sign in
      </button>
    </form>
  );
}
