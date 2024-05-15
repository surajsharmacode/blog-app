

const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };


const validateRegistrationData = ({name,email,username,password}) => {
    return new Promise((resolve,reject)=>{
        if(!name || !email || !username || !password){
            reject("Missing credential")
        }
        if(typeof email !== 'string') reject("Email is not valid")
        if(typeof password !== 'string') reject("Password is not string")
        if(typeof username !== 'string') reject("Username is not string")
        if(typeof name !== 'string') reject("name is not string"
        )

        if(username.length < 3 || username.length>30) reject("Username should be 2-30")

        console.log(validateEmail(email))
        if(!validateEmail(email)) reject("Email is invalid")

        resolve();

    })

    
}

module.exports = {validateRegistrationData}