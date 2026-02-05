export function levenshteinDistance(a: string, b: string): number {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) == a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    Math.min(matrix[i][j - 1] + 1, matrix[i - 1][j] + 1)
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

export function isNameSimilar(name1: string, name2: string, threshold = 3): boolean {
    if (!name1 || !name2) return false;
    const n1 = name1.toLowerCase().trim();
    const n2 = name2.toLowerCase().trim();

    if (n1.includes(n2) || n2.includes(n1)) return true;

    return levenshteinDistance(n1, n2) <= threshold;
}
