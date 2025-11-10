type RawNameData = {
  firstName?: unknown;
  lastName?: unknown;
  fullName?: unknown;
  username?: unknown;
  email?: unknown;
};

const normalize = (value: unknown): string =>
  typeof value === "string" ? value.trim() : "";

const capitalizeWord = (word: string): string => {
  if (!word) {
    return "";
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
};

export const deriveUserNames = (
  raw: RawNameData
): { firstName: string; lastName: string } => {
  let firstName = normalize(raw.firstName);
  let lastName = normalize(raw.lastName);

  const fullNameCandidate = normalize(raw.fullName) || normalize(raw.username);

  if ((!firstName || !lastName) && fullNameCandidate) {
    const parts = fullNameCandidate.split(/\s+/).filter(Boolean);
    if (!firstName && parts.length > 0) {
      firstName = parts[0] || "";
    }
    if (!lastName && parts.length > 1) {
      lastName = parts.slice(1).join(" ");
    }
  }

  if (!firstName || !lastName) {
    const email = normalize(raw.email);
    if (email) {
      const localPart = email.split("@")[0] || "";
      const emailParts = localPart.split(/[._-]+/).filter(Boolean);
      if (!firstName && emailParts.length > 0) {
        firstName = capitalizeWord(emailParts[0] || "");
      }
      if (!lastName && emailParts.length > 1) {
        lastName = capitalizeWord(emailParts[emailParts.length - 1] || "");
      }
    }
  }

  if (!firstName) {
    firstName = lastName || normalize(raw.fullName) || "User";
  }

  if (!lastName) {
    lastName = firstName;
  }

  return {
    firstName,
    lastName,
  };
};
