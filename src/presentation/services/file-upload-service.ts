import path from "path";
import fs from "fs";
import { UploadedFile } from "express-fileupload";



export class FileUploadService{
    constructor(){}

    private checkFolder(folderPath: string){
        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath);
        }
    }

    async upLoadSingleFile(
        file: UploadedFile,
        folder: string = 'uploads',
        validEstensions: string[]=['jpg', 'png', 'jpeg', 'gif'],
    ){
        try {
            const fileExtensions = file.mimetype.split('/').at(1) // separamos el mimetype por el slash y tomamos su segunda posicion para saber el tipo de archivo
            const destination = path.resolve(__dirname, '../../../', folder)// aqui tomamos todo el path de nuestro ordenador no solo la ruta en la que lo almacenaremos en el proyecto
            this.checkFolder(destination)
            file.mv(destination + `/mi-imagen.${fileExtensions}`)
            
        } catch (error) {
            console.log(error);
            
        }
    }

    upLoadMultipleFile(
        file: UploadedFile[],
        folder: string = 'uploads',
        validEstensions: string[]=['jpg', 'png', 'jpeg', 'gif'],
    ){}
}