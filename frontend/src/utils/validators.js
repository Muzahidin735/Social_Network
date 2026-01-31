// Password must contain:
// - 8+ chars
// - 1 uppercase
// - 1 number
// - 1 special character
export function isStrongPassword(password) {
  const regex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
}

export function isValidImage(file) {
  if (!file) return true;

  const allowedTypes = ["image/jpeg", "image/png"];
  const maxSize = 2 * 1024 * 1024; // 2 MB

  if (!allowedTypes.includes(file.type)) {
    return "Only JPG and PNG images are allowed";
  }

  if (file.size > maxSize) {
    return "Image size must be less than 2 MB";
  }

  return true;
}

export function isValidAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 13) return "Age must be greater than 13.";
  return true;
}

export function isValidUsername(name) {
  if (!name) return "Username cannot be empty.";

  const trimmed = name.trim();

  if (!trimmed) return "Username cannot be empty.";

  if (trimmed.length < 1)
    return "Username must be at least 3 characters.";

  if (trimmed.length > 30)
    return "Username must be at most 30 characters.";

  return true;
}

