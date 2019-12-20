import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.example.mynetwork{
   export class Sicknote extends Asset {
      sickNoteID: string;
      description: string;
      cid: number;
      doctor: Doctor;
      pacient: Pacient;
   }
   export class Doctor extends Participant {
      doctorId: string;
      firstName: string;
      lastName: string;
   }
   export class Pacient extends Participant {
      pacientID: string;
      firstName: string;
      lastName: string;
   }
// }
