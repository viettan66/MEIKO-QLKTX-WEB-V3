import { KTX0001 } from './KTX0001';
import { KTX0020 } from './KTX0020';

export class KTX0003{
    constructor(KTX0001_ID?: number){
        this.KTX0001_ID=KTX0001_ID
    }
    public  KTX0003_ID : number   ;
    public  KTX0001_ID : number   ;
    public  SoTu :string    ;
    public  MaKhoa :string    ;
    public  ghichu : string   ;
    public  trangthai : boolean   ;
    public  type :   number ;
    public   KTX0001 :KTX0001    ;
    public   KTX0020 :KTX0020    ;
}