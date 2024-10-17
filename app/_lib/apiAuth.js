import supabase from "./supabase";

export async function login({ password, email }) {
  let { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  console.log("Login Data:", data); // Log the login response
  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();

  if (!session.session) return null; // Return null if no session

  const { data: user, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);

  return user; // Return the user object
}

export async function logout() {
  const { error } = await supabase.auth.signOut();
  if (error) throw new Error(error.message);
}
