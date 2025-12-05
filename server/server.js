import app from "./app.js";
const PORT=process.env.PORT;
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLIENT_NAME,
    api_key: process.env.CLOUDINARY_CLIENT_API,
    api_secret: process.env.CLOUDINARY_CLIENT_SECRET,
});

app.listen(PORT,()=>{ 
    console.log(`server is running on port ${PORT}`);
});
  