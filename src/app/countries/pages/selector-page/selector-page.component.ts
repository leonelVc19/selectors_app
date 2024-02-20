import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CountriesService } from '../../services/countries.service';
import { Region, SmallCountry } from '../../interfaces/region.interfaces';
import { filter, switchMap, tap } from 'rxjs';

@Component({
  selector: 'selector-page',
  templateUrl: './selector-page.component.html',
})
export class SelectorPageComponent  implements OnInit {

  public countriesByRegion: SmallCountry[] = [];
  public bordersContries: SmallCountry[] = [];
   // Dise;o de formulario
  public myForm: FormGroup = this.fb.group({
    region : ['', Validators.required ],
    country: ['', Validators.required ],
    border : ['', Validators.required ],
  });

  constructor(
    private fb: FormBuilder,
    private countriesServices: CountriesService,
  ) {};

  ngOnInit(): void {
    this.onRegionChanged();
    this.onCountryChange();
  };

  public onRegionChanged(): void {
    this.myForm.get('region')!.valueChanges
      .pipe(
        tap( () => this.myForm.get('country')!.setValue('') ),
        tap( () => this.bordersContries = [] ),
        switchMap( region => this.countriesServices.getCountriesByRegion(region) )
        //switchMap( this.countriesServices.getCountriesByRegion ) //lo mismo
      )
      .subscribe(value => {
        this.countriesByRegion = value;
      })
  };

  get regions(): Region[] {
    return this.countriesServices.regions;
  }

  public onCountryChange(): void {
    this.myForm.get('country')!.valueChanges
    .pipe(
      tap( () => this.myForm.get('border')!.setValue('') ),
      filter((value: string ) => value.length > 0),
      switchMap( ( alphaCode ) => this.countriesServices.getCountryByAlphaCode(alphaCode)),
      switchMap( ( country ) => this.countriesServices.getCountriesByBorders( country.borders ))
      //switchMap( this.countriesServices.getCountriesByRegion ) //lo mismo
    )
    .subscribe(countries => {
      this.bordersContries = countries;

    })
  }
  //peticion
};
