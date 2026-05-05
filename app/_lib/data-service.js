import { getStoredUser } from "./apiAuth";

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { "Content-Type": "application/json", ...options.headers },
    cache: "no-store",
    ...options,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error || "Request failed");
  }

  return data;
}

export async function getAppoints() {
  return requestJson("/api/appointments");
}

export async function getAppointsThree() {
  return requestJson("/api/appointments?limit=2");
}

export async function getAppoint(id) {
  return requestJson(`/api/appointments/${id}`);
}

export async function createAppt(newAppt) {
  return requestJson("/api/appointments", {
    method: "POST",
    body: JSON.stringify(newAppt),
  });
}

export async function updateAppoint(id, appointment) {
  return requestJson(`/api/appointments/${id}`, {
    method: "PUT",
    body: JSON.stringify(appointment),
  });
}

export async function getDates() {
  return requestJson("/api/appointments?datesOnly=true");
}

export async function getAppointEqDate(date) {
  return requestJson(`/api/appointments?date=${encodeURIComponent(date)}`);
}

export async function deleteAppoint(id) {
  return requestJson(`/api/appointments/${id}`, {
    method: "DELETE",
  });
}

export async function getPatientAuthID(id) {
  try {
    const data = await requestJson(
      `/api/patients?authUserId=${encodeURIComponent(id)}`
    );
    return { data };
  } catch (error) {
    return { error };
  }
}

export async function updatePatientDetails(newPatientData) {
  try {
    const user = getStoredUser();

    if (!user) {
      throw new Error("User not authenticated.");
    }

    return await requestJson("/api/patients", {
      method: "PUT",
      body: JSON.stringify({ ...newPatientData, authUserId: user.id }),
    });
  } catch (error) {
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
  let profileImageUrl = "/logo.png";

  if (profileImage) {
    profileImageUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(profileImage);
    });
  }

  return requestJson("/api/users", {
    method: "POST",
    body: JSON.stringify({
      email: mail,
      password,
      birthDate: date,
      name,
      surname,
      medicalID,
      profileImageUrl,
    }),
  });
}

export async function getAuthEmails() {
  try {
    return await requestJson("/api/users/emails");
  } catch (error) {
    console.error("Unexpected error fetching users:", error);
    return [];
  }
}

export async function updatePassword(newPassword, email) {
  return requestJson("/api/users/password", {
    method: "PUT",
    body: JSON.stringify({ email, password: newPassword }),
  });
}
