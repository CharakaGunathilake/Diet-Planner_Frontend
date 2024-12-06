import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpoonacularServiceService {
  private baseUrl: String = "https://api.spoonacular.com/";
  private apiKey = "4e17416fa2b3412897f061c2d9df1cbd";
  constructor(
    private http: HttpClient
  ) { }

  getRecipeById(mealId: number): any {
    let recipe = {};
    this.http.get<any>(`${this.baseUrl}${mealId}/information?apiKey=${this.apiKey}&includeNutrition=true`).subscribe((data) => {
      recipe = data;
    });
    return recipe;
  }

  getRandomRecipe(mealName: string, userDietaryInfo: any): any {
    let recipe = {};
    const intolerances = userDietaryInfo.intolerances != 'none' ? userDietaryInfo.intolerances : "";
    const cuisines = userDietaryInfo.specificCuisine != 'none' ? userDietaryInfo.specificCuisine : "";
    this.http.get<any>(`${this.baseUrl}random?apiKey=${this.apiKey}&include-tags=${mealName.toLowerCase()},${intolerances}&exclude-tags=${cuisines}`).subscribe((data) => {
      data = data.recipes[0];
      recipe = data;
    });
    return recipe;
  }

}
