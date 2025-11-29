export const emailDomainValidationFunction = (value, helpers) => {
    for (const domain in VALID_EMAIL_DOMAINS) {
        if (value.endsWith && value.endsWith(domain)) {
            return true;
        }
    }
    return helpers.message(`Solo se permiten los siguientes dominios: ${VALID_EMAIL_DOMAINS.join(", ")}`);
}
