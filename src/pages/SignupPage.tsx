import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const signupSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Username must be at least 3 characters.")
    .max(24, "Username must be 24 characters or less.")
    .regex(/^[a-z0-9_]+$/, "Use only letters, numbers, and underscores."),
  email: z.string().trim().min(1, "Enter your email.").email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<
    Partial<Record<"username" | "email" | "password", string>>
  >({});

  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();
    const parsed = signupSchema.safeParse({
      username: cleanUsername,
      email: cleanEmail,
      password,
    });

    if (!parsed.success) {
      const fieldErrors = parsed.error.flatten().fieldErrors;
      setErrors({
        username: fieldErrors.username?.[0],
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });
      return;
    }

    setErrors({});
    setLoading(true);

    const { data: existingEmail, error: usernameCheckError } =
      await supabase.rpc("get_email_by_username", {
        input_username: cleanUsername,
      });

    if (usernameCheckError) {
      console.error(usernameCheckError);
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: "Could not check username. Please try again.",
      });
      setLoading(false);
      return;
    }

    if (existingEmail) {
      toast({
        variant: "destructive",
        title: "Username already used",
        description: "Choose another username.",
      });
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: cleanEmail,
      password,
      options: {
        data: {
          username: cleanUsername,
        },
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.message,
      });
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").upsert({
        id: data.user.id,
        username: cleanUsername,
        email: cleanEmail,
      });

      if (profileError) {
        console.error(profileError);

        if (
          profileError.message.toLowerCase().includes("duplicate") ||
          profileError.message.toLowerCase().includes("unique")
        ) {
          toast({
            variant: "destructive",
            title: "Username already used",
            description: "Choose another username.",
          });
          setLoading(false);
          return;
        }
      }
    }

    setLoading(false);

    if (data.session) {
      toast({
        title: "Account created",
        description: "Welcome to Roavooo.",
      });
      setLocation("/favorites");
      return;
    }

    toast({
      title: "Account created",
      description: "Please log in to continue.",
    });

    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <form
        onSubmit={handleSignup}
        noValidate
        className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl space-y-4"
      >
        <h1 className="text-3xl font-serif font-bold text-foreground">
          Sign up
        </h1>

        <p className="text-sm text-muted-foreground">
          Create an account to save favorites and plan your trips.
        </p>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 rounded-lg bg-muted border border-border outline-none"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setErrors((prev) => ({ ...prev, username: undefined }));
          }}
        />
        {errors.username && (
          <p className="text-sm text-destructive">{errors.username}</p>
        )}

        <input
          type="text"
          inputMode="email"
          placeholder="Email"
          className="w-full p-3 rounded-lg bg-muted border border-border outline-none"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prev) => ({ ...prev, email: undefined }));
          }}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg bg-muted border border-border outline-none"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setErrors((prev) => ({ ...prev, password: undefined }));
          }}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white p-3 rounded-lg font-semibold disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <p className="text-sm text-muted-foreground text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
