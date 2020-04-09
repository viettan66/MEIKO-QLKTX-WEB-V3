import { Component, OnInit, Input } from '@angular/core';
import { RESTService } from 'src/app/Service/rest.service';
import { CookieService } from 'ngx-cookie-service';
import { MKV9999 } from 'src/app/Models/MKV9999';
import { result } from 'src/app/QLKTX/models/result';
declare var $:any
@Component({
  selector: 'app-taikhoan',
  templateUrl: './taikhoan.component.html',
  styleUrls: ['./taikhoan.component.css']
})
export class TaikhoanComponent implements OnInit {
@Input()listMKV9999input:MKV9999[]
@Input()listMKV9999show:MKV9999[]
@Input()id
  constructor(public rest:RESTService,public cookie:CookieService) { }
  public listacc:MKV9999[]=[]
  public listdept=[]
  public start:number=0
  public step:number=20
  public keysearch=''
  public phong_id='all'
 async ngOnInit() {
    let that=this
     that.listacc=(this.listMKV9999show!=null?this.listMKV9999show:await this.rest.GetDataFromAPI<MKV9999[]>('Account/Get').toPromise())
     this.listacc.forEach(val=>{
       if(val.phong_id!=null)
       this.listdept.filter(c=>{return c['id']===val.phong_id}).length==0?this.listdept.push({id:val.phong_id,ten:val.thetu_id}):''
     })
      ///////////////////////////
      $('.taikhoan').on('click','tr',function(){
        $('.taikhoan>tr').css('background','white')
        $(this).css('background','gray')
      })
  }

  checkkey(element:MKV9999){
    if(element.manhansu.indexOf(this.keysearch)!=-1)return true
    if((element.hodem+' '+element.ten).toLowerCase().indexOf(this.keysearch.toLowerCase())!=-1)return true
  }
  pre(){
    if(this.start==0)return false
    this.start--
  }
  nex(){
    if(this.listMKV9999show!=null){
      
    if((this.start+1)*this.step>=this.listMKV9999show.length)return false
    this.start++
    }else{
      
    if((this.start+1)*this.step>=this.listacc.length)return false
    this.start++
    }
  }
 async resetpass(element:MKV9999){
element.matkhau="123456"
let data=await this.rest.PutDataToAPI<result<MKV9999>>(element,'Account/Update').toPromise()
if( data.code=="OK"){
  alert("Thành công: Passworld mới là 123456")
}
else
  alert( data.mess)
  }
  checkin(element:MKV9999){
   if(this.listMKV9999input==null)return false
 return  this.listMKV9999input.filter(c=>{return c.MKV9999_ID===element.MKV9999_ID}).length==0?false:true
  }
}
