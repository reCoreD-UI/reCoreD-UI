import { useState, useEffect } from 'react';

const isBrowserDarkTheme = () => {
    const [isDarkTheme, setIsDarkTheme] = useState(false);

    useEffect(() => {
        const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: { matches: boolean | ((prevState: boolean) => boolean); }) => setIsDarkTheme(e.matches);
        mediaQueryList.addEventListener('change', handleChange);
        setIsDarkTheme(mediaQueryList.matches);

        return () => mediaQueryList.removeEventListener('change', handleChange);
    }, []);

    return isDarkTheme
};

export default isBrowserDarkTheme;