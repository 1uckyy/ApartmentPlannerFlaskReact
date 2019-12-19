import axios from 'axios'

export const register = newUser => {
    return axios
        .post("users/register", {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            password: newUser.password
        })
        .then(response => {
            return response.data
        })
}

export const login = user => {
    return axios
        .post("users/login", {
            email: user.email,
            password: user.password
        })
        .then(response => {
            if(!response.data.error){
                localStorage.setItem('usertoken', response.data.token)
                return response.data
            } else {
                return response.data
            }
        })
        .catch(err => {
            console.log(err)
        })
}