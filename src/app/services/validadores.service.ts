import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';

interface ErrorValidate{
  [s:string]: boolean
}

@Injectable({
  providedIn: 'root'
})
export class ValidadoresService {

  constructor() { }

//VALIDACIONES SINCRONAS

//Validacion personalizada por ejemplo que no se acepte ningun apellido Herrera
  //como regresa un objeto va entre llaves {} que va a tener una propiedad llamada string que podrian ser varias y esa propiedad retorna un booleano
noHerrera( control: FormControl):{[s:string]: boolean} {
  
    if( control.value?.toLowerCase() === 'herrera' ){
      return { noHerrera: true}
    }
      return null;
  
}

// Esta funcion es para poder validar que ambas contrasenas son iguales
passwordsIguales(pass1Name: string, pass2Name: string){
  return ( formGroup: FormGroup ) => {
    const pass1Control = formGroup.controls[pass1Name];
    const pass2Control = formGroup.controls[pass2Name];

    if( pass1Control.value === pass2Control.value ){
      pass2Control.setErrors(null);
    } else {
      pass2Control.setErrors({ noEsIgual: true});
    }
  }
}


//VALIDACION ASINCRONA
existeUsuario(control: FormControl): Promise<ErrorValidate> | Observable<ErrorValidate> {

  // el siguiente if es porque el campo no es obligatorio, entonces es para que evalue solo la existencia del usuario ingresado
  if( !control.value ){
    return Promise.resolve(null);
  }

  return new Promise( (resolve, rejects) => {
    setTimeout(() => {
        if ( control.value === 'agoss') {
          resolve ({ existe: true});
        } else {
          resolve (null);
        }
    }, 3500);
  });
}

}


// Los validadores asincronos resuelven una promesa o un observable 