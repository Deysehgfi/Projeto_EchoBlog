const getToken = (request) => {
    const authHeader = request.headers.authorization
    //bearer token 
    const token = authHeader.split("")[1]
    return token
}

export default getToken;