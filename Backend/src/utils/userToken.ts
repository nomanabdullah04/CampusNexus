import { envVars } from "../config/env";
import { IUser } from "../modules/user/user.interface";
import { generateToken } from "./jwt";



export const createUserToken =  (user: Partial<IUser>)=>{
     const jwtPayload = {
        userId: user.id,
        email: user.email,
        activeRole: user.activeRole,
      };
    
      const accessToken = generateToken(jwtPayload, envVars.JWT_ACCESS_SECRET, envVars.JWT_ACCESS_EXPIRES);
      const refreshToken = generateToken(jwtPayload, envVars.JWT_REFRESH_SECRET, envVars.JWT_REFRESH_EXPIRE);
    
      return {
        accessToken,
        refreshToken
      }
}

