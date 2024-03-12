import nodemailer, { Transporter } from 'nodemailer';


export interface SendMailOptions {
  to: string | string[];
  subject: string;
  htmlBody: string;
  attachements?: Attachement[];
}

export interface Attachement {
  filename: string;
  path: string;
}


export class EmailService {

  private transporter: Transporter; 
  
  

  constructor(
    mailerService: string,
    mailerEmail: string,
    senderEmailPassword: string,
    //Esto es para hacer un envio de correo electronico ficticio y no estar enviando correos a cada rato que creemos un usuario
    private readonly postToProvider: boolean
  ) {
    this.transporter = nodemailer.createTransport( {
        service: mailerService,
        auth: {
          user: mailerEmail,
          pass: senderEmailPassword,
        }
      });
  }


  async sendEmail( options: SendMailOptions ): Promise<boolean> {

    const { to, subject, htmlBody, attachements = [] } = options;


    try {

      //se llama aqui el post to provider para hacer la simulacion de que ya el email a sido enviado
      if (!this.postToProvider) return true

      const sentInformation = await this.transporter.sendMail( {
        to: to,
        subject: subject,
        html: htmlBody,
        attachments: attachements,
      });

      // console.log( sentInformation );

      return true;
    } catch ( error ) {
        // console.log(error);
        
      return false;
    }

  }

}