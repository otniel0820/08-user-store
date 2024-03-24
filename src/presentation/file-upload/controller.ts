import { Request, Response } from "express";
import { CustomErrors } from "../../domain";
import { FileUploadService } from "../services/file-upload-service";
import { UploadedFile } from "express-fileupload";


export class FileUploadController {
  constructor(
    private readonly fileUploadService: FileUploadService,
  ) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomErrors) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    console.log(`${error}`);

    return res.status(500).json({ error: "Internal server error" });
  };

  uploadFile =  (req: Request, res: Response) => {
    
    const type = req.params.type
  
    const file = req.body.files.at(0) as UploadedFile;
    
    
    //Con este log mostramos la informacion que nos trae el body vemos que podemos hacer el multipack de crear usuario producto con toda la informacion que nos arroja el body
    // console.log({body: req.body});
    
    this.fileUploadService.upLoadSingleFile(file, `uploads/${type}`)// colocandole el type le podemos enviar al endpoint donde queremos que se guarde el archivo en una subcarpeta en uploads y los permitidos son los que tenemos en la constante validTpes si enviamos algo que no este ahi caera en el error que validamos despues 
    .then(uploaded => res.json(uploaded))
    .catch(error => this.handleError(error, res))
  };

  uploadMultipleFile =  (req: Request, res: Response) => {
    
    const type = req.params.type
   
    const files = req.body.files as UploadedFile[];
    
    this.fileUploadService.upLoadMultipleFile(files, `uploads/${type}`)
    .then(uploaded => res.json(uploaded))
    .catch(error => this.handleError(error, res))
  };
}
