export default function removeDuplicates(arr) {
    const config = {
        arr: [],
        dups: []
    }
    config.arr = arr.reduce((acc, current) => {
        const x = acc.find(item => item.voterID === current.voterID);
        if (!x) {
            return acc.concat([current]);
        } else {
            config.dups.push(x.voterID)
            return acc;
        }
    }, []);

    return config
}