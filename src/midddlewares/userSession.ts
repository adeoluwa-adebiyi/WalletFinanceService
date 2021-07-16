import { authorize, extractJwtToken } from "../helpers/auth"

export const userSessionMiddleware = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    const jwtString = extractJwtToken(authHeader);
    try{
        const userId = authorize(jwtString);
        req.user = { id: userId };
    }catch(e){
        req.user = null;
    }
    next();
}

export const userAuthenticated = (req:any, res:any, next: any) => {
    if(!req.user){
        res.status(401).json({
            status:"failure",
            message: "User not authenticated!"
        });
    }else{
        next();
    }
}