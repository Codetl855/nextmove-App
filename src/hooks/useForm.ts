import { useState } from "react";

type FormValues = Record<string, any>;

export function useForm<T extends FormValues>(initialValues: T) {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

    const handleChange = <K extends keyof T>(
        key: K,
        value: T[K],
        error?: string
    ) => {
        setValues(prev => ({
            ...prev,
            [key]: value,
        }));

        if (error !== undefined) {
            setErrors(prev => ({
                ...prev,
                [key]: error,
            }));
        } else {

            setErrors(prev => ({
                ...prev,
                [key]: undefined,
            }));
        }
    };

    const validate = (
        rules: Partial<Record<keyof T, (value: any) => string | null>>
    ) => {
        const newErrors: any = {};
        let valid = true;

        for (const key in rules) {
            const rule = rules[key];
            if (!rule) continue;

            const error = rule(values[key]);
            if (error) {
                valid = false;
                newErrors[key] = error;
            }
        }

        setErrors(newErrors);
        return valid;
    };

    const reset = () => {
        setValues(initialValues);
        setErrors({});
    };

    return {
        values,
        errors,
        handleChange,
        validate,
        reset,
        setValues,
    };
}
