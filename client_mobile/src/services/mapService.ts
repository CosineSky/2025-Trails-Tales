export const getAddressFromCoords = async (latitude: number, longitude: number) => {
    const key = '4345bbee84d8a67580da1b64d228f6ad';
    const location = `${longitude},${latitude}`;
    const url = `https://restapi.amap.com/v3/geocode/regeo?output=json&location=${location}&key=${key}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === "1") {
            const address = data.regeocode.formatted_address;
            const city = data.regeocode.addressComponent.city || data.regeocode.addressComponent.province;
            return { address, city };
        }
        else {
            console.warn("Failed to locate: ", data.info);
            return null;
        }
    } catch (error) {
        console.error("Error during requesting map api: ", error);
        return null;
    }
};
