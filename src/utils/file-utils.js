export class FileUtils {
    static loadPageScript(src) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve('Script loaded: ' + src);
            script.onerror = () => reject(new Error('Script load error for: ' + src));
            document.body.appendChild(script);
        });
    }

    static loadPageStyles(src, position = 'after', referenceId = 'common-css') {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = src;
        link.dataset.position = position; // Помечаем, чтобы сохранять порядок массива

        const referenceElement = document.getElementById(referenceId);
        if (!referenceElement) {
            document.head.appendChild(link);
            return;
        }

        if (position === 'before') {
            // Ищем последний добавленный стиль "до", чтобы вставить после него
            const allBefore = document.head.querySelectorAll(`link[data-position="before"]`);
            if (allBefore.length > 0) {
                const lastBefore = allBefore[allBefore.length - 1];
                document.head.insertBefore(link, lastBefore.nextSibling);
            } else {
                document.head.insertBefore(link, referenceElement);
            }
        } else { // 'after'
            // Ищем последний добавленный стиль "после", чтобы вставить после него
            const allAfter = document.head.querySelectorAll(`link[data-position="after"]`);
            if (allAfter.length > 0) {
                const lastAfter = allAfter[allAfter.length - 1];
                document.head.insertBefore(link, lastAfter.nextSibling);
            } else {
                document.head.insertBefore(link, referenceElement.nextSibling);
            }
        }
    }

    static convertFileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error('Can not convert this file'));
        });
    }
}