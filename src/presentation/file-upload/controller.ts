import { Request, Response } from "express";
import { CustomErrors } from "../../domain";


export class FileUploadController {
  constructor() {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomErrors) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);

    return res.status(500).json({ error: "Internal server error" });
  };

  uploadFile =  (req: Request, res: Response) => {
    
    res.json('upload file')
  };
  uploadMultipleFile =  (req: Request, res: Response) => {
    
    res.json('upload multiple file')
  };
}
