import React, { useState } from "react";
import Wrapper from "../../Wrapper";
import styles from "./CommunityRecipes.module.css";

function CommunityRecipes() {
  const [coffeeName, setCoffeeName] = useState("");
  const [roasteryName, setRoasteryName] = useState("");
  const [coffeeData, setCoffeeData] = useState(null);
  const [error, setError] = useState(null);

 const handleSearch = async (e) => {
  e.preventDefault();
  setError(null);
  setCoffeeData(null);

  try {
    const coffeeResponse = await fetch(
      `http://localhost:8080/api/discover?coffeeName=${encodeURIComponent(coffeeName)}&roasteryName=${encodeURIComponent(roasteryName)}`,
      { credentials: "include" }
    );

    if (!coffeeResponse.ok) {
      let errorMessage = "Coffee not found";

      try {
        const errorData = await coffeeResponse.json();
        if (errorData.error) {
          errorMessage = errorData.error;
        }
      } catch {
      }

      setError(errorMessage);
      return; 
    }

    const coffee = await coffeeResponse.json();
    const coffeeObj = Array.isArray(coffee) ? coffee[0] : coffee;

    if (!coffeeObj || !coffeeObj.coffeeId) {
      setError("Invalid coffee data");
      return;
    }

    setCoffeeData(coffeeObj);
  } catch (err) {
    setError("An error occurred: " + err.message);
  }
};

  return (
    <div className={styles.bcg}>
      <Wrapper>
        <div>
          <h2 className={styles.recipeRoast}>search... and brew!</h2>
          {error && <p className={styles.error}>{error}</p>}

          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Enter coffee name"
              value={coffeeName}
              onChange={(e) => setCoffeeName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Enter roastery name"
              value={roasteryName}
              onChange={(e) => setRoasteryName(e.target.value)}
              required
            />
            <button type="submit">Search</button>
          </form>

          <div>
            <p className={styles.orText}>or</p>
            <p className={styles.addRecipeText}>
              <a href="/add-recipe">add your recipe!</a>
            </p>
          </div>

          {coffeeData && (
            <div className={styles.coffeeCard}>
              <div className={styles.imageContainer}>
                {coffeeData.imageUrl && (
                  <img
                    className={styles.coffeeImage}
                    src={coffeeData.imageUrl}
                    alt={coffeeData.nameCoffee}
                  />
                )}
                <div className={styles.ratingBox}>
                  <span className={styles.ratingValue}>
                    {coffeeData.rating
                      ? coffeeData.rating.toFixed(1)
                      : "No rating"}
                  </span>
                  <span className={styles.ratingStar}>★</span>
                </div>
              </div>

              <div className={styles.coffeeDetails}>
                <h3>{coffeeData.nameCoffee}</h3>

                <div className={styles.coffeeParam}>
                  <span className={styles.coffeeLabel}>Origin:</span>
                  <span className={styles.coffeeValue}>
                    {coffeeData.origin}
                  </span>
                </div>

                <div className={styles.coffeeParam}>
                  <span className={styles.coffeeLabel}>Roastery:</span>
                  <span className={styles.coffeeValue}>
                    {coffeeData.roastery}
                  </span>
                </div>

                <div className={styles.coffeeParam}>
                  <span className={styles.coffeeLabel}>Roast Level:</span>
                  <span className={styles.coffeeValue}>
                    {coffeeData.roastLevel}
                  </span>
                </div>

                <div className={styles.coffeeParam}>
                  <span className={styles.coffeeLabel}>Flavour Notes:</span>
                  <span className={styles.coffeeValue}>
                    {coffeeData.flavourNotes?.join(", ")}
                  </span>
                </div>

                <div className={styles.coffeeParam}>
                  <span className={styles.coffeeLabel}>
                    Recommended Methods:
                  </span>
                  <span className={styles.coffeeValue}>
                    {coffeeData.recommendedMethods?.join(", ")}
                  </span>
                </div>
              </div>

              <div className={styles.beanBookContainer}>
                <h4 className={styles.beanBook}>the bean book</h4>
                {coffeeData.brewRecipes?.length > 0 ? (
                  <ul>
                    {coffeeData.brewRecipes.map((recipe) => (
                      <li key={recipe.id}>
                        <span className={styles.highlight1}>Added by:</span>{" "}
                        {recipe.username} <br />
                        <span className={styles.highlight}>
                          Brewing Method:
                        </span>{" "}
                        {recipe.brewingMethodName || "—"} <br />
                        <span className={styles.highlight}>Grinder:</span>{" "}
                        {recipe.grinderName || "—"} <br />
                        <span className={styles.highlight}>
                          Grind Setting:
                        </span>{" "}
                        {recipe.grindSetting} <br />
                        <span className={styles.highlight}>Dose:</span>{" "}
                        {recipe.coffeeDoseGrams}g <br />
                        <span className={styles.highlight}>Water:</span>{" "}
                        {recipe.waterVolumeMl}ml <br />
                        <span className={styles.highlight}>
                          Temperature:
                        </span>{" "}
                        {recipe.waterTemperatureCelsius}°C <br />
                        <span className={styles.highlight}>
                          Brewing time:
                        </span>{" "}
                        {recipe.brewingTimeSeconds}s <br />
                        <span className={styles.highlight}>Notes:</span>{" "}
                        {recipe.notes} <br />
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className={styles.noRecipe}>
                    <p>This coffee is still waiting for its <strong>first</strong> recipe.</p>
                    <p>
                      <a href="/add-recipe" className={styles.addRecipeText2}>Will it be yours?</a>
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </Wrapper>
    </div>
  );
}

export default CommunityRecipes;
