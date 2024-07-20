const bcrypt = require('bcrypt');

async function testBcrypt() {
    const password = 'testpassword';
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed Password:', hashedPassword);

    const isMatch = await bcrypt.compare(password, hashedPassword);
    console.log('Password Match:', isMatch);
}

testBcrypt();
