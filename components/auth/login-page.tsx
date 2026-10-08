import LoginForm from "@/components/auth/login-form";
import Brand from "@/components/ui/brand";

export default function LoginPage() {
  return (
    <main className="auth-page">
      <section className="auth-aside" aria-label="Company introduction">
        <Brand />

        <div className="auth-promo">
          <span className="eyebrow">The workspace for ambitious teams</span>
          <h1>Make your best work happen.</h1>
          <p>
            Bring your people, projects, and progress together in one clear
            view. Less busywork, more momentum.
          </p>
          <div className="auth-proof">
            <div className="avatar-stack" aria-hidden="true">
              <span>AM</span>
              <span>JL</span>
              <span>SK</span>
            </div>
            <span>Trusted by teams building what&apos;s next</span>
          </div>
        </div>

        <span className="auth-copyright">© 2026 Omni-Hub Workspace</span>
      </section>

      <section className="auth-main">
        <div className="login-card">
          <span className="eyebrow">Welcome back</span>
          <h2>Sign in to your account</h2>
          <p className="login-intro">
            Enter your details to access your workspace.
          </p>
          <LoginForm />
          <p className="login-footer">
            This is a UI demo. Authentication is not configured yet.
          </p>
        </div>
      </section>
    </main>
  );
}
