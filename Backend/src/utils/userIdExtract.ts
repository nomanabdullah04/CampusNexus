import AppError from "../errorHelpers/AppError";
import httpStatus from "http-status-codes";

/**
 * Extracts the student ID from a Comilla University (@cou.ac.bd) email.
 * Only COU university emails are accepted for registration.
 */
export const extractUniversityId = (email: string): string => {
    if (!email.endsWith("@cou.ac.bd")) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            "Registration is only allowed for Comilla University students. Please use your @cou.ac.bd university email."
        );
    }
    const universityId = email.split("@")[0];

    // Validate CoU student ID format (alphanumeric with optional dots/dashes)
    if (!/^[a-zA-Z0-9._-]+$/.test(universityId)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid student ID format in university email.");
    }
    return universityId;
};