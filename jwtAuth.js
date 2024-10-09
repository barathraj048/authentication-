import jwt from 'jsonwebtoken'
import z from 'zod'
const jwtPassword = 'secret';

const username='barath@gmail.com'
const password='sdvvvcvvd'
let token=''

function signJwt(username, password) {
    try{
        const passSchema=z.string().min(6)
        const usernameSchema=z.string().email()
        let passVerify = passSchema.parse(password)
        let userVerify = usernameSchema.parse(username)
        if(passVerify && userVerify){
            token = jwt.sign({username,password},jwtPassword)
            console.log(token)
        }
        console.log(`sucesfully this program was compleated`)
    }catch(e){
        console.log(e)
    }

}
const jwtVerify=(jwttoken)=> {
    try {
        jwt.verify(jwttoken,jwtPassword)
        console.log(`json token is verified sucesfully`)
    }
    catch(e){
       console.log(e)
    }
}
const jwsdecode = (jwttoken)=> {
    const decodedMSG= jwt.decode(jwttoken)
    console.log(decodedMSG)
}

signJwt(username,password)
jwtVerify(token)
jwsdecode(token)


export {
    signJwt,
    jwtVerify,
    jwsdecode,
    jwtPassword,  
    token 
};
