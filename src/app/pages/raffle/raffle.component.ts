import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RaffleService } from '../../services/raffle.service';
import { ValidadoresService } from '../../services/validadores.service';
import { GroupService } from '../../services/group.service';
import { Group } from '../../interfaces/get-groups-response';
import Swal from "sweetalert2";
// import { errorValidate } from '../../interfaces/error-validate';
// import { error } from '@angular/compiler/src/util';
import { GroupfichasService } from '../../services/groupfichas.service';
import { UserService } from '../../services/user.service';


@Component({
  selector: 'app-raffle',
  templateUrl: './raffle.component.html',
  styleUrls: ['./raffle.component.css']
})
export class RaffleComponent implements OnInit {
forma_Raffle: FormGroup;
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
   public grupofichas: any;
   public grupoficha: any;

   date = new Date();
   texto:string = "";
   percentLineIsDisabled:Boolean = false;
  constructor(private fb: FormBuilder,
              private RaffleService: RaffleService,
              private validadores: ValidadoresService,
              private GroupService: GroupService,
              private GroupFichas:GroupfichasService,
              private UserService: UserService
            ) {

    this.forma_Raffle = this.fb.group({
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
      grupoficha             : [''],
     }, 
     {
      // validators: this.validadores.passwordsIguales('pass1', 'pass2')
       Validators: this.validadores.sumaPorcentajes('percent_line', 'percent_full')
     }); 
     this.crearListeners();

   } 
 
  ngOnInit(): void {
    this.UserService.getGroups('1')
    .subscribe(resp=>{
      //console.log('grupos=', resp.Group);
       this.grupos = resp.Group;
    });
    this.GroupFichas.getGroupFichas()
      .subscribe(resp => 
        {
          this.grupofichas = resp;
        //  console.log('groupFichas=', resp);
        });
    

    // this.deshabilitar_percent_line();
  }
  AddGrupofichas(grupo: string ){
      // Swal.fire
      this.grupoficha = grupo;
      console.log('grupo=', this.grupoficha);
  }

   deshabilitar_percent_line(){
    this.forma_Raffle.get('reward_line')?.valueChanges.subscribe( value=> {
      if (value == 0){
        //console.log(value);
        this.percentLineIsDisabled= true;
      }
      else{
        this.percentLineIsDisabled =false;
      }
      });
   }

   get nombreNoValido(){
     return this.forma_Raffle.get('nombre')?.invalid && this.forma_Raffle.get('nombre')?.touched;
   }
  
   get descriptionNoValido(){
    return this.forma_Raffle.get('description')?.invalid && this.forma_Raffle.get('description')?.touched;
  }

  get grupoNoValido(){
    return this.forma_Raffle.get('grupo')?.invalid && this.forma_Raffle.get('grupo')?.touched;
  }

  get totalAmountNoValido(){
    return this.forma_Raffle.get('total_amount')?.invalid && this.forma_Raffle.get('total_amount')?.touched;
  }
  
  get cardAmountNoValido(){
    return this.forma_Raffle.get('card_amount')?.invalid && this.forma_Raffle.get('card_amount')?.touched;
  }

  get minimunPlayNoValido(){
    return this.forma_Raffle.get('minimun_play')?.invalid && this.forma_Raffle.get('minimun_play')?.touched;
  }

  get maximunPlayNoValido(){
    return this.forma_Raffle.get('maximun_play')?.invalid && this.forma_Raffle.get('maximun_play')?.touched;
  }

  get maximunUserPlayNoValido(){
    return this.forma_Raffle.get('maximun_user_play')?.invalid && this.forma_Raffle.get('maximun_user_play')?.touched;
  }

  get retentionPercentNoValido(){
    return this.forma_Raffle.get('retention_percent')?.invalid && this.forma_Raffle.get('retention_percent')?.touched;
  }
  
  get retentionAmountNoValido(){
    return this.forma_Raffle.get('retention_amount')?.invalid && this.forma_Raffle.get('retention_amount')?.touched;
  }

  get adminRetentionPercentNoValido(){
    return this.forma_Raffle.get('admin_retention_percent')?.invalid && this.forma_Raffle.get('admin_retention_percent')?.touched;
  }
  
  get adminRetentionAmountNoValido(){
    return this.forma_Raffle.get('admin_retention_amount')?.invalid && this.forma_Raffle.get('admin_retention_amount')?.touched;
  }

  get raffleTypeNoValido(){
    return this.forma_Raffle.get('raffle_type')?.invalid && this.forma_Raffle.get('raffle_type')?.touched;
  }
  
  get privacyNoValido(){
    return this.forma_Raffle.get('privacy')?.invalid && this.forma_Raffle.get('privacy')?.touched;
  }

  get rewardLineNoValido(){
    return this.forma_Raffle.get('reward_line')?.invalid && this.forma_Raffle.get('reward_line')?.touched;
  }
  
  get percentLineNoValido(){
    return this.forma_Raffle.get('percent_line')?.invalid && this.forma_Raffle.get('percent_line')?.touched;
  }
 
  get rewardFullNoValido(){
    return this.forma_Raffle.get('reward_full')?.invalid && this.forma_Raffle.get('reward_full')?.touched;
  }
  
  get percentFullNoValido(){
    return this.forma_Raffle.get('percent_full')?.invalid && this.forma_Raffle.get('percent_full')?.touched;
  }

  get startDateNoValido(){
    return this.forma_Raffle.get('start_date')?.invalid && this.forma_Raffle.get('start_date')?.touched;
  }

  get startHourNoValido(){
    return this.forma_Raffle.get('start_hour')?.invalid && this.forma_Raffle.get('start_hour')?.touched;
  }
  get scheduledDateNoValido(){
    return this.forma_Raffle.get('scheduled_date')?.invalid && this.forma_Raffle.get('scheduled_date')?.touched;
  }

  get scheduledHourNoValido(){
    return this.forma_Raffle.get('scheduled_hour')?.invalid && this.forma_Raffle.get('scheduled_hour')?.touched;
  }

  get endDateNoValido(){
    return this.forma_Raffle.get('end_date')?.invalid && this.forma_Raffle.get('end_date')?.touched;
  }

  get endHourNoValido(){
    return this.forma_Raffle.get('end_hour')?.invalid && this.forma_Raffle.get('end_hour')?.touched;
  }

  get grupofichasNoValido(){
    return this.forma_Raffle.get('grupoficha')?.invalid && this.forma_Raffle.get('grupoficha')?.touched;
  }
  
  crearFromulario(){
  this.forma_Raffle = this.fb.group({
   nombre: ['' ],
   description: ['' ],
  });
  }
   
  crearListeners(...args: []) {
    this.forma_Raffle.valueChanges.subscribe(valor => {

      console.log(valor);
    });
    //  this.forma_Raffle.statusChanges.subscribe(status => console.log({status}));
    this.forma_Raffle.get('percent_line')?.valueChanges.subscribe(console.log);
  }

  guardar(){
    console.log(this.forma_Raffle.value);
    if (this.forma_Raffle.invalid){
      return Object.values(this.forma_Raffle.controls).forEach(control=>{
        control.markAsTouched();
        if (control instanceof FormGroup){
          Object.values(control.controls).forEach(control=>control.markAsTouched());

        } else {
          control.markAsTouched();
        }
      });
    }
     const user = 1;
    const ruta = this.forma_Raffle.get('admin_retention_amount')?.value +'/'+this.forma_Raffle.get('admin_retention_percent')?.value
    +'/'+this.forma_Raffle.get('card_amount')?.value +'/'+this.forma_Raffle.get('description')?.value +'/'+this.forma_Raffle.get('grupo')?.value
    +'/'+this.forma_Raffle.get('maximun_play')?.value+'/'+this.forma_Raffle.get('maximun_user_play')?.value+'/'+this.forma_Raffle.get('minimun_play')?.value
    +'/'+this.forma_Raffle.get('nombre')?.value+'/'+this.forma_Raffle.get('percent_full')?.value+'/'+this.forma_Raffle.get('percent_line')?.value
    +'/'+this.forma_Raffle.get('privacy')?.value+'/'+this.forma_Raffle.get('raffle_type')?.value+'/'+this.forma_Raffle.get('retention_amount')?.value
    +'/'+this.forma_Raffle.get('retention_percent')?.value+'/'+this.forma_Raffle.get('reward_full')?.value+'/'+this.forma_Raffle.get('reward_line')?.value
    +'/'+this.forma_Raffle.get('scheduled_date')?.value+'/'+this.forma_Raffle.get('scheduled_hour')?.value+'/'+this.forma_Raffle.get('time_zone')?.value+'/'+this.grupoficha+'/'+ user;

    //posteo de la informa_Raffleción
      
  //  console.log('ruta', ruta);
    // this.RaffleService.putRaffle(ruta);
    this.RaffleService.putRaffle(ruta).
    subscribe(resp =>{
      // console.log('respuesta en raffle component ='+resp['open_raffle']);
       Swal.close();
          Swal.fire({
            allowOutsideClick: false,
            icon: 'success',
            text: resp['message'],  
          });
          },(err)=>{            
            Swal.fire({
                    allowOutsideClick: false,
                    icon: 'error',
                    text: err.error.message,
                  });
          } );
        
    this.forma_Raffle.reset();
   }
}