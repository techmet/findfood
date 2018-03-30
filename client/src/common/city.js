export const getCurrentCity = () => {
    const cityString = window.localStorage.getItem('current-city');
    return cityString ? JSON.parse(cityString) : null;
}

export const setCity = (city) => {
    window.localStorage.setItem('current-city', JSON.stringify(city));
}

export const removeCity = () => {
    window.localStorage.removeItem('current-city');
}