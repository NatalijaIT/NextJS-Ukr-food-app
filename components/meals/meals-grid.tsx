import MealItem from "./meal-item";
import { Meal } from "@/types/meal";

import classes from "./meals-grid.module.css";

interface MealsGridProps {
    meals: Meal[];
}

export default function MealsGrid({ meals }: MealsGridProps) {

    return (
        <ul className={classes.meals}>
            {meals.map(meal => (
                <li key={meal._id}>
                    <MealItem {...meal} />
                </li>
            ))}
        </ul>
    )

}
