import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RaffleService } from '../../services/raffle.service';
import { ValidadoresService } from '../../services/validadores.service';
import { GroupService } from '../../services/group.service';
import { Group } from '../../interfaces/get-groups-response';
import Swal from "sweetalert2";
import { errorValidate } from '../../interfaces/error-validate';
import { error } from '@angular/compiler/src/util';


@Component({
  selector: 'app-raffle',
  templateUrl: './raffle.component.html',
  styleUrls: ['./raffle.component.css']
})
export class RaffleComponent implements OnInit {
forma: FormGroup;
mensaje: string;
icono: string;
ListaYesNo= [
    {id: 0, name: 'NO' },
    {id: 1, name: 'SI' }
  ];
listaPublicPrivate = [
    {id: 0, name: 'Publico' },
    {id: 1, name: 'Privado' }
  ];
listaRaffleType = [
    {id: 0, name: 'Automático' },
    {id: 1, name: 'Manual' }
    ];
listaPercent = [  
    {id: 0, name: "0" },
    {id: 1, name: "1" },
    {id: 2, name: "2" },
    {id: 3, name: "3" },
    {id: 4, name: "4" },
    {id: 5, name: "5" },
    {id: 6, name: "6" },
    {id: 7, name: "7" },
    {id: 8, name: "8" },
    {id: 9, name: "9" },
    {id: 10, name: "10" },
    {id: 11, name: "11" },
    {id: 12, name: "12" },
    {id: 13, name: "13" },
    {id: 14, name: "14" },
    {id: 15, name: "15" },
    {id: 16, name: "16" },
    {id: 17, name: "17" },
    {id: 18, name: "18" },
    {id: 19, name: "19" },
    {id: 20, name: "20" }
    ];
    listaPercent2 = [ 
      {id: 0, name: "0" },
      {id: 10, name: "10" },
      {id: 20, name: "20" },
      {id: 30, name: "30" },
      {id: 40, name: "40" },
      {id: 50, name: "50" },
      {id: 60, name: "60" },
      {id: 70, name: "70" },
      {id: 80, name: "80" },
      {id: 90, name: "90" },
      {id: 100, name: "100" },
      ];
   public grupos: Group[]= [];
   date = new Date();
   texto:string = "";
   percentLineIsDisabled:Boolean = false;
  constructor(private fb: FormBuilder,
              private RaffleService: RaffleService,
              private validadores: ValidadoresService,
              private GroupService: GroupService
            ) {

    this.forma = this.fb.group({
      nombre                 : ['Sorteo número  '+ this.date, [Validators.required]],
      description            : ['Sorteo número  '+ this.date, [Validators.required]],
      grupo                  : ['', [Validators.required]],
      total_amount           : ['', []],
      card_amount            : ['1', [Validators.required]],
      minimun_play           : ['10',],
      maximun_play           : ['10000',],
      maximun_user_play      : ['10000',],	
      retention_percent	     : ['10',],
      retention_amount	     : ['0',],
      admin_retention_percent: ['10',],	
      admin_retention_amount : ['0',],	
      raffle_type	           : ['1',[] ],
      privacy	               : ['1', ],
      reward_line	           : ['1', ],
      percent_line	         : ['40', ],
      reward_full	           : ['1', ],
      percent_full           : ['0',],
      scheduled_date         : [this.date, ],
      scheduled_hour         : ['', ],
      time_zone              : ['chile'],
      start_date             : [''],
      start_hour             : [''],
      end_date               : [''],
      end_hour               : [''],
     }, 
     {
      // validators: this.validadores.passwordsIguales('pass1', 'pass2')
       Validators: this.validadores.sumaPorcentajes('percent_line', 'percent_full')
     }); 
     this.crearListeners();

   } 
 
  ngOnInit(): void {
    this.GroupService.getGroups('1')
    .subscribe(resp=>{
      console.log('grupos=', resp.Group);
       // .subscribe( resp => {
      //   // console.log('resp= ', resp.Card);
       this.grupos = resp.Group;
    })
    this.deshabilitar_percent_line();
  }
   deshabilitar_percent_line(){
    this.forma.get('reward_line')?.valueChanges.subscribe( value=> {
      if (value == 0){
        console.log(value);
        this.percentLineIsDisabled= true;
      }
      else{
        this.percentLineIsDisabled =false;
      }
      });
   }

   get nombreNoValido(){
     return this.forma.get('nombre')?.invalid && this.forma.get('nombre')?.touched;
   }
  
   get descriptionNoValido(){
    return this.forma.get('description')?.invalid && this.forma.get('description')?.touched;
  }

  get grupoNoValido(){
    return this.forma.get('grupo')?.invalid && this.forma.get('grupo')?.touched;
  }

  get totalAmountNoValido(){
    return this.forma.get('total_amount')?.invalid && this.forma.get('total_amount')?.touched;
  }
  
  get cardAmountNoValido(){
    return this.forma.get('card_amount')?.invalid && this.forma.get('card_amount')?.touched;
  }

  get minimunPlayNoValido(){
    return this.forma.get('minimun_play')?.invalid && this.forma.get('minimun_play')?.touched;
  }

  get maximunPlayNoValido(){
    return this.forma.get('maximun_play')?.invalid && this.forma.get('maximun_play')?.touched;
  }

  get maximunUserPlayNoValido(){
    return this.forma.get('maximun_user_play')?.invalid && this.forma.get('maximun_user_play')?.touched;
  }

  get retentionPercentNoValido(){
    return this.forma.get('retention_percent')?.invalid && this.forma.get('retention_percent')?.touched;
  }
  
  get retentionAmountNoValido(){
    return this.forma.get('retention_amount')?.invalid && this.forma.get('retention_amount')?.touched;
  }

  get adminRetentionPercentNoValido(){
    return this.forma.get('admin_retention_percent')?.invalid && this.forma.get('admin_retention_percent')?.touched;
  }
  
  get adminRetentionAmountNoValido(){
    return this.forma.get('admin_retention_amount')?.invalid && this.forma.get('admin_retention_amount')?.touched;
  }

  get raffleTypeNoValido(){
    return this.forma.get('raffle_type')?.invalid && this.forma.get('raffle_type')?.touched;
  }
  
  get privacyNoValido(){
    return this.forma.get('privacy')?.invalid && this.forma.get('privacy')?.touched;
  }

  get rewardLineNoValido(){
    return this.forma.get('reward_line')?.invalid && this.forma.get('reward_line')?.touched;
  }
  
  get percentLineNoValido(){
    return this.forma.get('percent_line')?.invalid && this.forma.get('percent_line')?.touched;
  }
 
  get rewardFullNoValido(){
    return this.forma.get('reward_full')?.invalid && this.forma.get('reward_full')?.touched;
  }
  
  get percentFullNoValido(){
    return this.forma.get('percent_full')?.invalid && this.forma.get('percent_full')?.touched;
  }

  get startDateNoValido(){
    return this.forma.get('start_date')?.invalid && this.forma.get('start_date')?.touched;
  }

  get startHourNoValido(){
    return this.forma.get('start_hour')?.invalid && this.forma.get('start_hour')?.touched;
  }
  get scheduledDateNoValido(){
    return this.forma.get('scheduled_date')?.invalid && this.forma.get('scheduled_date')?.touched;
  }

  get scheduledHourNoValido(){
    return this.forma.get('scheduled_hour')?.invalid && this.forma.get('scheduled_hour')?.touched;
  }

  get endDateNoValido(){
    return this.forma.get('end_date')?.invalid && this.forma.get('end_date')?.touched;
  }

  get endHourNoValido(){
    return this.forma.get('end_hour')?.invalid && this.forma.get('end_hour')?.touched;
  }
  // set percentLineIsDisabled(value: boolean){
  //    const percentLineIsDisabled = value;
  // }

  crearFromulario(){
  this.forma = this.fb.group({
   nombre: ['' ],
   description: ['' ],
  });
  }
   
  crearListeners(...args: []) {
    this.forma.valueChanges.subscribe(valor => {

      console.log(valor);
    });
    //  this.forma.statusChanges.subscribe(status => console.log({status}));
    this.forma.get('percent_line')?.valueChanges.subscribe(console.log);
  }

  guardar(){
    console.log(this.forma.value);
    if (this.forma.invalid){
      return Object.values(this.forma.controls).forEach(control=>{
        control.markAsTouched();
        if (control instanceof FormGroup){
          Object.values(control.controls).forEach(control=>control.markAsTouched());

        } else {
          control.markAsTouched();
        }
      });
    }
     const user = 1;
    const ruta = this.forma.get('admin_retention_amount')?.value +'/'+this.forma.get('admin_retention_percent')?.value
    +'/'+this.forma.get('card_amount')?.value +'/'+this.forma.get('description')?.value +'/'+this.forma.get('grupo')?.value
    +'/'+this.forma.get('maximun_play')?.value+'/'+this.forma.get('maximun_user_play')?.value+'/'+this.forma.get('minimun_play')?.value
    +'/'+this.forma.get('nombre')?.value+'/'+this.forma.get('percent_full')?.value+'/'+this.forma.get('percent_line')?.value
    +'/'+this.forma.get('privacy')?.value+'/'+this.forma.get('raffle_type')?.value+'/'+this.forma.get('retention_amount')?.value
    +'/'+this.forma.get('retention_percent')?.value+'/'+this.forma.get('reward_full')?.value+'/'+this.forma.get('reward_line')?.value
    +'/'+this.forma.get('scheduled_date')?.value+'/'+this.forma.get('scheduled_hour')?.value+'/'+this.forma.get('time_zone')?.value+'/'+ user;

    //posteo de la información
      
   console.log('ruta', ruta);
    // this.RaffleService.putRaffle(ruta);
    this.RaffleService.putRaffle(ruta).
    subscribe(resp =>{
      console.log('respuesta en raffle component ='+resp['open_raffle']);
       Swal.close();
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text: resp['message'],  
          });
          },(err)=>{
            console.log(err);
            
            Swal.fire({
                    allowOutsideClick: false,
                    icon: 'error',
                    text: err.error.message,
                  });
          } );
        
    this.forma.reset();
  }
}
