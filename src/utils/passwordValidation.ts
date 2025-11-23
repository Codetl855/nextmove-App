export const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required";
    const capital = /[A-Z]/;
    const small = /[a-z]/;
    const number = /[0-9]/;
    const special = /[@$!%*#?&]/;

    if (!capital.test(password))
        return "Password must contain at least one uppercase letter";
    if (!small.test(password))
        return "Password must contain at least one lowercase letter";
    if (!number.test(password))
        return "Password must contain at least one number";
    if (!special.test(password))
        return "Password must contain at least one special character (@$!%*#?&)";
    if (password.length < 8)
        return "Password must be at least 8 characters long";

    return null;
};

// export const validatePassword = (password: string): string | null => {
//     const capital = /[A-Z]/;
//     const small = /[a-z]/;
//     const number = /[0-9]/;
//     const special = /[@$!%*#?&]/;

//     if (!capital.test(password))
//         return "Password must contain at least one uppercase letter";

//     if (!small.test(password))
//         return "Password must contain at least one lowercase letter";

//     if (!number.test(password))
//         return "Password must contain at least one number";

//     if (!special.test(password))
//         return "Password must contain at least one special character (@$!%*#?&)";

//     if (password.length < 8)
//         return "Password must be at least 8 characters long";

//     return null;
// };
