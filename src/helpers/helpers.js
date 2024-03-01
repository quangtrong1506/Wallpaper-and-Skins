const arrCharacters = 'qwertyuiopasdfghjklzxcvbnm1234567890';

const randomID = () => {
    let length = 32;
    let bit = 4;
    let n = length / bit;
    let id = '';
    while (n--) {
        for (let i = 0; i < bit; i++) {
            id += randomCharacter();
        }
    }
    return id.slice(id.lastIndexOf('-'));
};
const randomCharacter = () => {
    let char = arrCharacters[Math.floor(Math.random() * (arrCharacters.length - 1))];
    return char;
};

export { randomID };
