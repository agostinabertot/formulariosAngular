import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ValidadoresService } from '../../services/validadores.service';

@Component({
  selector: 'app-reactive',
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.css']
})
export class ReactiveComponent implements OnInit {

  forma: FormGroup;


  constructor( private fb: FormBuilder, private validadores: ValidadoresService ) { 

    this.crearFormulario();
    this.cargarDataAlFormulario();
    this.crearListeners(); //importante que este despues de crear el formulario, porque va a escchar los cambios

  }

  ngOnInit(): void {
  }

  get pasatiempos(){
    return this.forma.get('pasatiempos') as FormArray
  }
  
//Los formularios al ser reactivos me permiten suscribirme para escuchar los cambios del mismo
  
crearFormulario(){

    this.forma = this.fb.group({
      // [valor por defecto, validadores sincronos, validadores asincronos]
        nombre: ['', [Validators.required, Validators.minLength(5)]],
        apellido: ['', [Validators.required, this.validadores.noHerrera]],
        correo: ['', [Validators.required, Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$')]],
       //validacion asincrona 
        usuario: ['', , this.validadores.existeUsuario],
        pass1: ['', Validators.required],
       pass2: ['', Validators.required],
        // objeto anidado por ejemplo la direccion que es una informacion que se puede componer de varios campos
        direccion: this.fb.group({
          distrito: ['', Validators.required],
          ciudad: ['', Validators.required]
        }),
         pasatiempos: this.fb.array([])
              }, {
                validators: this.validadores.passwordsIguales('pass1', 'pass2')
              });
  }

  crearListeners(){
    // this.forma.valueChanges.subscribe( valor => {
    // para ver los cambios del formulario 
    // });
    // this.forma.statusChanges.subscribe( status => {
    // para ver si es valido o invalido
    // })
    // SI ME INERESA EL CAMBIO DE UN SOLO CAMPO:
    // this.forma.get('nombre').valueChanges() 
  }

  // esto regresa un booleano
  get nombreNoValido(){
    return this.forma.get('nombre').invalid && this.forma.get('nombre').touched
  }

  get apellidoNoValido(){
    return this.forma.get('apellido').invalid && this.forma.get('apellido').touched
  }

  get correoNoValido(){
    return this.forma.get('correo').invalid && this.forma.get('correo').touched
  }

  get usuarioNoValido(){
    return this.forma.get('usuario').invalid && this.forma.get('usuario').touched
  }

  get distritoNoValido(){
    return this.forma.get('direccion.distrito').invalid && this.forma.get('direccion.distrito').touched
  }

  get ciudadNoValido(){
    return this.forma.get('direccion.ciudad').invalid && this.forma.get('direccion.ciudad').touched
  }

  get pass1NoValido(){
    return this.forma.get('pass1').invalid && this.forma.get('pass1').touched
  }

  get pass2NoValido(){
    const pass1 = this.forma.get('pass1').value;
    const pass2 = this.forma.get('pass2').value;

    // con esta linea digo que si las pass son iguales retorna true y sino false
    return ( pass1 == pass2 ) ? false : true;
  }

  // con el setValue tengo que si o si ponerle un valor a todos los campos aunq sea vacio ''. En cambio si en lugar de setValue uso reset puedo darle a algunos valor y a otros no y no me tira un error. 
  cargarDataAlFormulario(){
    //this.forma.setValue
    this.forma.reset({
        nombre: 'agostina',
        apellido: 'bertot',
        correo: 'agos.bertot@hotmail.com',
        pass1:'123',
        pass2: '123',
        direccion: {
          distrito:'centro',
          ciudad:'rosario'}
    });
    // ['comer', 'dormir'].forEach( valor => this.pasatiempos.push( this.fb.control(valor) ) );
    
  }

  guardar(){
    console.log(this.forma);
    //con lo siguiente hago que si no manipule los campos y pongo guardar y me ponga todo en rojo por las validaciones
    //esto no funciona para distrito y ciudad que estan dentro de un formgroup (direccion) entonces tengo que agregar el segundo if 
    if( this.forma.invalid){
      return Object.values( this.forma.controls ).forEach( control => {
       
        if( control instanceof FormGroup ){
          Object.values( control.controls ).forEach( control => control.markAsTouched());
        } else {
        control.markAsTouched();
        }
      });
    }
    // luego de que pongo Guardar se resetea el formulario y me vacia los campos
    this.forma.reset();
  }

  agregarPasatiempo(){
    this.pasatiempos.push( this.fb.control('', Validators.required ) );
  }

  borrarPasatiempo(i: number){
    this.pasatiempos.removeAt(i);
  }

}
