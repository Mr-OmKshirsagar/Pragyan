import { FormEvent, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Mail, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/authService";

export default function ForgotPassword() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");

    setMessage("");
    setError("");
    setSubmitting(true);
    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.message || "If an account exists, password reset instructions have been sent.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to send password reset instructions.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-background text-foreground lg:grid-cols-[0.95fr_1.05fr]">
      <section className="relative hidden overflow-hidden bg-[#151D3B] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <img
          src="/opengraph.jpg"
          alt="Pragyan AI"
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-[#151D3B]/75" />

        <Link href="/" className="relative z-10 flex items-center gap-2">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-primary">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-xl font-bold">Pragyan AI</span>
        </Link>

        <div className="relative z-10 max-w-md">
          <p className="text-sm font-semibold uppercase tracking-normal text-blue-200">
            Career intelligence
          </p>
          <h1 className="mt-4 text-5xl font-bold leading-tight tracking-normal">
            Build the path before choosing the destination.
          </h1>
          <p className="mt-5 text-base leading-7 text-white/75">
            Reset your password and continue your recommendations, assessments, learning roadmap, and counselor conversations.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-3">
          {["Assess", "Match", "Grow"].map((item) => (
            <div key={item} className="rounded-lg border border-white/15 bg-white/10 p-4 backdrop-blur">
              <p className="text-sm font-bold">{item}</p>
              <p className="mt-2 text-xs leading-5 text-white/65">Personalized career flow</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-10 flex items-center gap-2 lg:hidden">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-5 w-5" />
            </span>
            <span className="text-xl font-bold">Pragyan AI</span>
          </Link>

          <div className="mb-8">
            <p className="text-sm font-semibold text-primary">
              Account recovery
            </p>
            <h2 className="mt-2 text-4xl font-bold tracking-normal">
              Forgot password?
            </h2>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Enter your email address and Pragyan AI will send reset instructions if the account exists.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold">Email address</span>
              <span className="relative block">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input name="email" className="h-11 pl-10" type="email" placeholder="you@example.com" required />
              </span>
            </label>

            {message && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                {message}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md border border-primary-border bg-primary px-5 py-3 text-sm font-bold text-primary-foreground shadow-md"
            >
              {submitting ? "Please wait..." : "Send reset instructions"} <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Remembered your password?{" "}
            <Link href="/auth" className="font-bold text-primary">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
