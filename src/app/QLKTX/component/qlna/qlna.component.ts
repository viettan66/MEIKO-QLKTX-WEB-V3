import { Component, OnInit } from '@angular/core';
import { MKV8002 } from 'src/app/Models/MKV8002';
import { RESTService } from 'src/app/Service/rest.service';
import { result } from '../../models/result';
import { MKV9999 } from 'src/app/Models/MKV9999';
import { FingerPrints } from 'src/app/Models/FingerPrints';
declare var $:any
@Component({
  selector: 'app-qlna',
  templateUrl: './qlna.component.html',
  styleUrls: ['./qlna.component.css']
})
export class QlnaComponent implements OnInit {

  constructor(public rest:RESTService) { }
public newnhaan=new MKV8002()
public listMKV8002:MKV8002[]=[]
public thisMKV8002:MKV8002
public listMKV9999:any[]=[]
public start=0
public startdate=''
public enddate=''
public tab=0
    public     step=30
 async ngOnInit() {
    this.newnhaan.port='4370'
    this.newnhaan.commkey='0'
    this.newnhaan.type=1
    this.newnhaan.trangthai=true
    this.newnhaan.ip='192.84.100.xxx'
    this.listMKV8002=await this.rest.PostDataToAPI<MKV8002[]>({type:1,trangthai:true},'MKV8002/Getall').toPromise()
    if(this.listMKV8002.length>0)this.thisMKV8002=this.listMKV8002[0]
  }
  themnhaan(){
$('#themnhaanmodal').modal()
  }
async  save(){
  let data=await this.rest.PostDataToAPI<result<MKV8002>>(this.newnhaan,'MKV8002/add').toPromise()
  if(data.code=="OK"){
    this.listMKV8002.push(data.data)
    $('#themnhaanmodal').modal('hide')
  }
  }
  getstartdate($event){
    this.startdate=$event
  }
  getstart($event){
    this.start=$event
  }
  getstep($event){
    this.step=$event
  }
  getenddaate($event){
    this.enddate=$event
  }
  active(element:MKV8002){
    this.listMKV9999=[]
    this.thisMKV8002=element
    this.tab=this.listMKV8002.indexOf(element)
  }
  getlist($event){
    this.listMKV9999=$event
  }
  async getdataa() {
    this.listMKV9999 = []
    if (this.startdate == '') {
      alert('Bạn phải chọn thời gian bắt đầu')
      return false
    }
    if (this.enddate == '') {
      alert('Bạn phải chọn thời gian kết thúc')
      return false
    }
    let data = await this.rest.PostDataToAPI<FingerPrints[]>({ ip: this.thisMKV8002.ip, port: this.thisMKV8002.port, commkey: this.thisMKV8002.commkey, startdate: this.startdate, enddate:this.enddate }, 'FingerPrints/Getdata').toPromise()
    if (data != null) {
      data.forEach(async val => {
        if (val.User_ID.length < 6)
          val.User_ID = "00000000".substring(0, 6 - val.User_ID.length) + val.User_ID
      })
      let lisstid = [...new Set(data.map(x => { return x.User_ID }))]
      lisstid.forEach(async k => {
        let mkv9999 = await this.rest.PostDataToAPI<MKV9999>({ ID: k }, 'Account/Check').toPromise()
        this.listMKV9999.push({
          MKV9999: mkv9999,User_ID:k,
          Count: data.filter(c => { return c.User_ID === k }).length,
          ten:(mkv9999!=null?mkv9999.hodem:'zzzz')+' '+(mkv9999!=null?mkv9999.ten:''),
          id:(mkv9999!=null?mkv9999.manhansu:'9999'),
        })
      })
    }
    console.log(this.listMKV9999)
  } async deleteitem(element){
    if(!confirm('Bạn muốn xóa máy chấm vân tay "'+element.ten+'" này chứ?'))return false
    let dataa= await this.rest.PutDataToAPI<result<MKV8002>[]>([element],'MKV8002/delete').toPromise()
    dataa.filter(c=>{return c.code==="OK"}).forEach(dataa=>{

    if(dataa.code=="OK"){{
         this.listMKV8002.splice(this.listMKV8002.indexOf(element),1)
       }}
    })
  }
  async edititem(element:MKV8002){
    if( $('#edit'+element.MKV8002_ID).find('i').hasClass('fa-edit')){
       $('#row'+element.MKV8002_ID).find('input:text,select').removeClass('none').removeAttr('disabled') 
       $('#edit'+element.MKV8002_ID).find('i').removeClass('fa-edit').addClass('fa-save')
     }else{
       $('#row'+element.MKV8002_ID).find('input:text,select').addClass('none').attr('disabled',true)
       $('#edit'+element.MKV8002_ID).find('i').removeClass('fa-save').addClass('fa-edit')
       let dataa= await this.rest.PutDataToAPI<result<MKV8002>>(element,'MKV8002/update').toPromise()
       console.log(dataa)
       if(dataa.code=="OK"){{
         element=dataa.data
       }}
     }
   }
}
