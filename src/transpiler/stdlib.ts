export const INI_STD_LIB = {
    aleatoire: (min: number, max: number) => {
        if (min > max) {
            [min, max] = [max, min];
        }
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    longueur: (value: any) => String(value ?? '').length,
    arrondi: (value: number) => Math.round(value),
    abs: (value: number) => Math.abs(value),
    max: (...values: number[]) => Math.max(...values),
    min: (...values: number[]) => Math.min(...values),
    puissance: (base: number, exposant: number) => Math.pow(base, exposant),
    entier: (value: number) => Math.trunc(value),
    texte: (value: any) => String(value),
    est_nombre: (value: any) => typeof value === 'number' && !Number.isNaN(value),
    est_texte: (value: any) => typeof value === 'string',
    est_vrai: (value: any) => Boolean(value),
};

export const INI_STD_LIB_KEYS = Object.keys(INI_STD_LIB) as (keyof typeof INI_STD_LIB)[];
