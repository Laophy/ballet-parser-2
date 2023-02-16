export default function removeDuplicates(arr) {
    const obj = {
        arr: [],
        dups: []
    }
    obj.arr = arr.reduce((acc, current) => {
        const x = acc.find(item => item.voterID === current.voterID);
        if (!x) {
            return acc.concat([current]);
        } else {
            obj.dups.push(x.voterID)
            return acc;
        }
    }, []);

    return obj
}