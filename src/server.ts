import app from "./app";
import { EnvVars } from "./config/env";

const bootstrap = () =>{
  try{
    app.listen(EnvVars.PORT, ()=>{
      console.log(`Server is running on http://localhost:${EnvVars.PORT}`);
    })
  }catch (error){
    console.error('Failed to start server:', error)
  }
}

bootstrap();