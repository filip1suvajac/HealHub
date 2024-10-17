import supabase from "./supabase";

export async function getAppoints() {
  let { data: appoints, error } = await supabase.from("appoints").select("*");

  if (error) {
    console.error("Error fetching appointments:", error);
  }

  return appoints;
}

export async function getAppointsThree() {
  // Fetch all appointments from the database
  let { data: appoints, error } = await supabase
    .from("appoints")
    .select("*")
    .order("created_at", { ascending: false }); // Order by `created_at` in descending order

  if (error) {
    console.error("Error fetching appointments:", error);
    return [];
  }

  // Return the first two appointments or all if there's one
  return appoints.length > 2 ? appoints.slice(0, 2) : appoints;
}

export async function getAppoint(id) {
  const { data: appoint, error } = await supabase
    .from("appoints")
    .select("*")
    .eq("id", id)
    .single(); // Use .single() to fetch a single record directly

  if (error) {
    console.error("Error fetching appointment:", error);
  }

  console.log("Fetched appointment:", appoint);
  return appoint;
}

export async function createAppt(newAppt) {
  const { data, error } = await supabase
    .from("appoints")
    .insert([newAppt])
    .select()
    .single(); // Get the newly created appointment

  if (error) {
    console.error("Error creating appointment:", error);
    throw new Error("Appointment could not be created");
  }
  return data;
}

export async function getDates() {
  let { data, error } = await supabase.from("appoints").select("date");

  if (error) {
    console.error("Error fetching dates:", error);
    throw new Error("Dates could not be fetched");
  }
  return data;
}

export async function getAppointEqDate(date) {
  let { data, error } = await supabase
    .from("appoints")
    .select("*")
    .eq("date", date);

  if (error) {
    console.error("Error fetching appointments by date:", error);
    throw new Error("Dates could not be fetched");
  }
  return data;
}

export async function deleteAppoint(id) {
  const { error } = await supabase.from("appoints").delete().eq("id", id);
  if (error) {
    console.error("Error deleting appointment:", error);
    throw new Error("Appointment could not be deleted");
  }
  return { message: "Appointment deleted successfully." };
}

export async function getPatientAuthID(id) {
  try {
    let { data, error: patientError } = await supabase
      .from("patients")
      .select("*")
      .eq("auth_user_id", id);

    if (patientError) {
      console.error("Error fetching patient data:", patientError.message);
      return { error: patientError };
    }

    console.log("Fetched patient data:", data); // Log the data response
    return { data };
  } catch (error) {
    console.error("Unexpected error in getPatientAuthID:", error);
    return { error };
  }
}

export async function updatePatientDetails(newPatientData) {
  try {
    // 1. Get the currently authenticated user
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      throw new Error("User not authenticated or session error.");
    }

    const authUserId = session.user.id; // Get the user's UUID from the session

    // 2. Update the patient's details using the auth_user_id
    const { data: patientResult, error: patientError } = await supabase
      .from("patients")
      .update({
        name: newPatientData.name, // Update patient name
        surname: newPatientData.surname, // Update surname
        birthDate: newPatientData.birthDate, // Update birth date
        medicalID: newPatientData.medicalID, // Update medical ID
        profileImageUrl: newPatientData.profileImageUrl,
      })
      .eq("auth_user_id", authUserId) // Use auth_user_id as a reference to update the correct patient
      .select(); // Optionally return the updated patient data

    if (patientError) {
      console.error("Error updating patient:", patientError.message);
      throw new Error(`Error updating patient: ${patientError.message}`);
    }

    return {
      message: "Patient details successfully updated!",
      updatedPatient: patientResult,
    };
  } catch (error) {
    console.error("Error in updatePatientDetails:", error);
    return { error: error.message };
  }
}

export async function createUser(
  mail,
  password,
  date,
  name,
  surname,
  medicalID,
  profileImage
) {
  const { data: userData, error: userError } = await supabase.auth.signUp({
    email: mail,
    password: password,
  });

  if (userError) {
    console.error("User creation error:", userError);
    throw new Error("Unable to create user");
  }

  const authID = userData?.user?.id;

  let imageUrl = null;
  if (profileImage) {
    const { data: imageData, error: imageError } = await supabase.storage
      .from("profile-images")
      .upload(`profiles/${authID}/${profileImage.name}`, profileImage);

    if (imageError) {
      console.error("Image upload error:", imageError);
      throw new Error("Unable to upload profile image");
    }
    imageUrl = supabase.storage
      .from("profile-images")
      .getPublicUrl(`profiles/${authID}/${profileImage.name}`).data.publicUrl;
  }

  // Step 2: Insert patient data
  const { data: patientData, error: patientError } = await supabase
    .from("patients")
    .insert([
      {
        birthDate: date,
        name: name,
        surname: surname,
        medicalID: medicalID,
        auth_user_id: authID,
        profileImageUrl: imageUrl, // Store the image URL if uploaded
      },
    ])
    .select();

  if (patientError) {
    console.error("Patient insertion error:", patientError);
    throw new Error("Unable to insert patient data");
  }

  return { userData, patientData };
}
export async function getAuthEmails() {
  try {
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error("Error fetching users from auth:", error);
      throw new Error("Unable to fetch users");
    }

    // Extract and return emails from users
    const emails = data.users.map((user) => user.email);
    return emails;
  } catch (error) {
    console.error("Unexpected error fetching users:", error);
    return [];
  }
}
export async function updatePassword(newPassword, email) {
  try {
    // Fetch all users and filter them by email
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      console.error("Error fetching users from auth:", error);
      throw new Error("Unable to fetch users");
    }

    // Find the user with the provided email
    const user = data.users.find((user) => user.email === email);

    if (!user) {
      console.error("User not found for email:", email);
      throw new Error("User not found.");
    }

    const userId = user.id; // Correct user ID based on the filtered email

    console.log("Fetched user before password update:", user); // Log the user details before update

    // Now update the user's password
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      userId,
      {
        password: newPassword, // Set the new password
      }
    );

    if (updateError) {
      console.error("Error updating password:", updateError);
      throw new Error("Failed to update password.");
    }

    // Fetch the user again after updating the password
    const { data: updatedUser, error: postUpdateError } =
      await supabase.auth.admin.getUserById(userId);

    if (postUpdateError) {
      console.error("Error fetching user after update:", postUpdateError);
      throw new Error("Failed to fetch user after password update.");
    }

    console.log("Updated user after password update:", updatedUser); // Log the updated user

    return { message: "Password updated successfully." };
  } catch (err) {
    console.error("Error in updatePassword:", err);
    throw new Error(err.message || "Failed to reset password.");
  }
}
