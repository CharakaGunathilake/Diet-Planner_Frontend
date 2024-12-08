import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpoonacularService {

  private baseUrl: String = "https://api.spoonacular.com/recipes/";
  private apiKey = "a4cc5dffa90c4777b649112d67c3cecc";
  constructor(
    private http: HttpClient
  ) { }

  searchMeal(searchQuery: String) {
    return this.http.get<any>(`${this.baseUrl}complexSearch?apiKey=${this.apiKey}&query=${searchQuery}&addRecipeNutrition=true`);
  }

  getRecipeById(mealId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}${mealId}/information?apiKey=${this.apiKey}&includeNutrition=true`);
  }

  getRandomRecipe(mealName: string, userDietaryInfo: any): any {
    const intolerances = userDietaryInfo.intolerances != 'none' ? userDietaryInfo.intolerances : "";
    const cuisines = userDietaryInfo.specificCuisine != 'none' ? userDietaryInfo.specificCuisine : "";
    return this.http.get<any>(`${this.baseUrl}random?apiKey=${this.apiKey}&include-tags=${mealName.toLowerCase()}&includeTags=${cuisines}`);
  }

  getSuggestions(mealName: string, userDietaryInfo: any): any {
    const intolerances = userDietaryInfo.intolerances != 'none' ? userDietaryInfo.intolerances : "";
    const cuisines = userDietaryInfo.specificCuisine != 'none' ? userDietaryInfo.specificCuisine : "";
    return this.http.get<any[]>(`${this.baseUrl}complexSearch?apiKey=${this.apiKey}&query=${mealName}&number=2&intolerances=${intolerances}&cuisine=${cuisines}&addRecipeInformation=true&instructionsRequired=true`);
  }
}



// function getSplittedString(index: number, array: any): string {
//   let names = "";
//   switch (index) {
//     case 1: {
//       array.forEach((obj: any) => {
//         obj.name = obj.name.charAt(0).toUpperCase() + obj.name.slice(1);
//         names += obj.amount + " " + obj.unit + " " + obj.name + ", ";
//       })
//       return names = names.substring(0, names.length - 2);
//     }
//     case 2: {
//       if (array.length == 0) {
//         return "Common"
//       } else {
//         array.forEach((obj: any) => {
//           names += obj + ", ";
//         })
//         return names = names.substring(0, names.length - 2);
//       }
//     } default: {
//       return "none";
//     }
//   }
// }
