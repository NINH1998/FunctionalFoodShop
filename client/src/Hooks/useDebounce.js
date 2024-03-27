import { useEffect, useState } from 'react';

const useDebounce = (value, delay) => {
    const [debounceValue, setDebounceValue] = useState('');
    useEffect(() => {
        const setTimeoutId = setTimeout(() => {
            setDebounceValue(value);
        }, delay);

        return () => clearTimeout(setTimeoutId);
    }, [value, delay]);
    return debounceValue;
};

export default useDebounce;
