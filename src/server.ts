import app from "./app";
import { seedSuperAdmin } from "./app/utils.ts/seedAdmin";
import { EnvVars } from "./config/env";

const bootstrap = async() =>{
  try{
    await seedSuperAdmin();
    app.listen(EnvVars.PORT, ()=>{
      console.log(`Server is running on http://localhost:${EnvVars.PORT}`);
    })
  }catch (error){
    console.error('Failed to start server:', error)
  }
}

bootstrap();