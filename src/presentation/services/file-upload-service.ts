import path from "path";
import fs from "fs";
import { UploadedFile } from "express-fileupload";
import { Uuid } from "../../config";
import { CustomErrors } from "../../domain";



export class FileUploadService{
    constructor(
        private readonly uuid = Uuid.v4,
    ){}

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
            const fileExtensions = file.mimetype.split('/').at(1) ?? ''// separamos el mimetype por el slash y tomamos su segunda posicion para saber el tipo de archivo
            if(!validEstensions.includes(fileExtensions)){
                throw CustomErrors.badRequest(`Invalid extension: ${fileExtensions}, valid ones${validEstensions} `); // haciendo la validacion de las extensiones si no es ninguna a las que tenemos definidas dara un error 
            }
            const destination = path.resolve(__dirname, '../../../', folder)// aqui tomamos todo el path de nuestro ordenador no solo la ruta en la que lo almacenaremos en el proyecto
            this.checkFolder(destination)
            const fileName = `${this.uuid()}.${fileExtensions}`
            file.mv(`${destination}/${fileName}`)
            return {fileName}
        } catch (error) {
            console.log(error);
            
        }
    }

    async upLoadMultipleFile(
        files: UploadedFile[],
        folder: string = 'uploads',
        validEstensions: string[]=['jpg', 'png', 'jpeg', 'gif'],
    ){

        const filesNames = await Promise.all(
            files.map(file=>this.upLoadSingleFile(file, folder, validEstensions)),
        )

        return filesNames
    }
}