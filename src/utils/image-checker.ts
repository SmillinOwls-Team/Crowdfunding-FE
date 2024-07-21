export function isImageUrlValid(url: string): Promise<boolean> {
    const img = new Image();
    img.src = url;

    return new Promise((resolve, _reject) => {
        if (img.complete) {
            resolve(true);
        }

        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
    });
}
