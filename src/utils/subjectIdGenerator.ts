export const generateSubjectID = () => {
    // Generates a mock Hash ID like 'PT-X9L2M4'
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `PT-${result}`;
};
